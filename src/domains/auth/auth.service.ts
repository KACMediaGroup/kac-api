import { BaseService } from '@/base.service'
import { UserService } from '@/domains/user/user.service'
import { ResetDbService } from '@/providers/database/services/reset-db.service'
import { VerificationDbService } from '@/providers/database/services/verification-db.service'
import { EmailService } from '@/providers/email/email.service'
import { AligoService } from '@/providers/external-api/aligo/aligo.service'
import { VerificationQueryDto } from '@/shared/dtos/query/verification-query.dto'
import { ResetPasswordRequestDto } from '@/shared/dtos/request/reset-password-request.dto'
import { SendAligoRequestDto } from '@/shared/dtos/request/send-aligo-request.dto'
import { SignInRequestDto, SignUpRequestDto } from '@/shared/dtos/request/user-request.dto'
import { SendVerificationRequestDto } from '@/shared/dtos/request/verification-request.dto'
import { AuthResponseDto } from '@/shared/dtos/response/auth-response.dto'
import { TemplateCode } from '@/shared/enums/kakao-template-code.enum'
import ApplicationException from '@/shared/exceptions/application.exception'
import { ErrorCode } from '@/shared/exceptions/error-code'
import { CodeGeneratorUtil } from '@/shared/utils/code-generator.util'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import * as dayjs from 'dayjs'
import axios from 'axios'
import { SnsType } from '@/shared/enums/sns-type.enum'
import { KakaoUserResponseDto } from '@/shared/dtos/response/kakao-user-reponse.dto'

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private verificationDbService: VerificationDbService,
    private aligoService: AligoService,
    private resetDbService: ResetDbService,
    private emailService: EmailService,
  ) {
    super()
  }

  async signUp(dto: SignUpRequestDto) {
    this.logger.debug(`[${this.signUp.name}] dto: ${JSON.stringify(dto)}`)
    dto.password = await this.#hashPassword(dto.password)
    const { verificationCode, ...rest } = dto

    // 회원 가입 때 폰 인증만을 수단으로 가정, 이후 변경 시 같이 변경 필요
    if (!(await this.isVerifiedCode(verificationCode, dto.phoneNumber))) {
      throw new ApplicationException(
        new BadRequestException('인증 내역 확인 불가'),
        ErrorCode.NOT_FOUND_VERIFICATION,
      )
    }
    return await this.userService.signUp(rest)
  }

  async signIn(dto: SignInRequestDto): Promise<AuthResponseDto> {
    const { isSns, providerType, providerId, email, password } = dto

    if (isSns) {
      if (!providerType || !providerId) {
        throw new ApplicationException(
          new BadRequestException('잘못된 파라미터로 요청하였습니다.'),
          ErrorCode.WRONG_PARAMETER,
        )
      }

      const snsUser = await this.userService.snsUser(providerType, providerId)
      if (!snsUser) {
        if (email) {
          // 이미 가입되었는지 확인
          const registeredUser = await this.userService.profile({ email })
          if (registeredUser) {
            throw new ApplicationException(
              new BadRequestException('이미 가입된 회원입니다.'),
              ErrorCode.ALREADY_EXISTS,
            )
          }
        }
        throw new ApplicationException(
          new BadRequestException('계정이 존재하지 않습니다.'),
          ErrorCode.NOT_FOUND_ACCOUNT,
        )
      }

      const jwt = await this.jwtService.signAsync({
        id: snsUser.id,
        email: snsUser.email,
        roles: snsUser.roles,
      })

      return { accessToken: jwt }
    }

    // 이메일 로그인
    const user = await this.userService.profile({ email }, true)

    if (!user) {
      throw new ApplicationException(
        new BadRequestException('계정이 존재하지 않습니다.'),
        ErrorCode.NOT_FOUND_ACCOUNT,
      )
    }

    // 소셜 가입 확인
    if (!user.password && user.providers.length > 0) {
    }

    // 비밀번호 체크
    const isSamePassword = this.#comparePassword(password, user.password || '')
    if (!isSamePassword) {
      throw new ApplicationException(
        new BadRequestException('이메일 혹은 비밀번호가 올바르지 않습니다.'),
        ErrorCode.WRONG_PARAMETER,
      )
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      roles: user.roles,
    })

    return { accessToken: jwt }
  }

  async kakaoLogin(code: string): Promise<AuthResponseDto> {
    // 카카오에서 액세스 토큰 요청
    const tokenUrl = 'https://kauth.kakao.com/oauth/token'
    const body = {
      grant_type: 'authorization_code',
      client_id: this.configService.get('auth.kakao.clientId'),
      redirect_uri: this.configService.get('auth.kakao.redirectUrl'),
      code,
      // client_secret: this.configService.get('auth.kakao.clientSecret'), // 선택 사항 (설정 시)
    }

    const tokenResponse = await axios.post(tokenUrl, new URLSearchParams(body), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const { access_token } = tokenResponse.data

    // 카카오 사용자 정보 요청
    const userInfo = (
      await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      })
    ).data as KakaoUserResponseDto

    // 사용자 정보를 통해 JWT 발급
    const jwtToken = await this.processSnsUser(SnsType.KAKAO, userInfo.id.toString())

    // 유저가 없을 경우 회원가입 플로우로 안내
    if (!jwtToken) {
      return { userNotFound: true } // 프론트엔드에서 이 상태를 확인
    }
    return { accessToken: jwtToken }
  }

  async processSnsUser(snsType: SnsType, providerId: string): Promise<string | null> {
    // 사용자 정보로 유저 조회
    const user = await this.userService.snsUser(snsType, providerId)
    if (!user) {
      return null
    }

    // JWT 생성
    return this.jwtService.sign({ id: user.id, email: user.email, roles: user.roles })
  }

  async sendVerification(dto: SendVerificationRequestDto) {
    this.logger.debug(`[${this.sendVerification.name}] dto: ${JSON.stringify(dto)}`)
    const verificationCode = CodeGeneratorUtil.generateCode(6)
    const expiresAt = dayjs().add(5, 'minute').toDate()
    await this.verificationDbService.createVerification({
      ...dto,
      verificationCode,
      expiresAt,
    })

    // 알림톡 발송
    const { apiKey, userId, senderKey } = this.configService.get('aligo')
    const sendKakaoDto: SendAligoRequestDto = {
      apikey: apiKey,
      userid: userId,
      senderkey: senderKey,
      tpl_code: TemplateCode.TT_6010,
      sender: this.configService.get<string>('aligo.senderNumber'),
      receiver_1: dto.identifier,
      subject_1: '회원가입 인증번호 발송',
      message_1:
        `안녕하세요\nK-ARTIST CLASS입니다.\n` + `인증번호 [${verificationCode}] 를 입력해주세요.`,
    }
    await this.aligoService.sendKaKaoTalk(sendKakaoDto)
    return '알림톡이 발송되었습니다.'
  }

  // 인증 코드 생성 내역과 사용자가 입력한 코드를 비교
  async checkVerifyCode(queryDto: VerificationQueryDto): Promise<string> {
    const existingVerification = await this.verificationDbService.verification(queryDto)
    if (!existingVerification) {
      throw new ApplicationException(
        new BadRequestException('인증 중 오류가 발생했습니다. 인증을 다시 시도해 주세요'),
      )
    }
    return '인증이 성공하였습니다.'
  }

  async isVerifiedCode(verificationCode: string, identifier: string) {
    // 하루 전을 기준일로 전달 -> 이후에 인증한 것만 유효하게 (추후 비즈니스 로직에서 구체화)
    const oneDayAgo = dayjs().subtract(1, 'day').toDate()

    // 최신 검증 정보 가져오기
    const lastVerification = await this.verificationDbService.lastVerification(
      identifier,
      oneDayAgo,
    )

    return lastVerification && lastVerification.verificationCode === verificationCode
  }

  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userService.profile({ email })
    if (!user) {
      throw new ApplicationException(
        new BadRequestException('존재하지 않는 이메일입니다.'),
        ErrorCode.NOT_FOUND_ACCOUNT,
      )
    }
    // Oauth 유저면 애초에 비밀번호 없음
    if (user.providers && user.providers.length > 0) {
      throw new ApplicationException(
        new BadRequestException('비밀번호 재설정을 요청할 수 없습니다.'),
        ErrorCode.BAD_REQUEST_ERROR,
      )
    }

    const resetCode = CodeGeneratorUtil.generateRandomString(24)
    // 임시 비밀번호 기한 설정: 4시간
    const expiresAt = dayjs().add(4, 'hour').toDate()
    await this.resetDbService.createResetCode(user.id, resetCode, expiresAt)

    await this.emailService.sendEmailToResetPassword(email, resetCode, user.name)

    return '비밀번호 재설정 메일이 발송되었습니다.'
  }

  async resetPassword(dto: ResetPasswordRequestDto): Promise<string> {
    const { resetCode, newPassword } = dto

    // DB에서 코드 확인 (유효성 및 만료 시간 확인)
    const resetRequest = await this.resetDbService.findByCode(resetCode)
    if (!resetRequest) {
      throw new ApplicationException(
        new NotFoundException('유효하지 않은 비밀번호 재설정 요청입니다.'),
        ErrorCode.NOT_FOUND_RESET_CODE,
      )
    }

    // 코드 사용 여부 및 만료 시간 확인
    if (resetRequest.isUsed || dayjs().isAfter(resetRequest.expiresAt)) {
      throw new ApplicationException(
        new UnauthorizedException('비밀번호 재설정 코드가 만료되었습니다.'),
        ErrorCode.INVALID_CODE,
      )
    }

    // 비밀번호 해싱 및 저장
    const hashedPassword = await this.#hashPassword(newPassword)
    await this.userService.updateUserInfo(resetRequest.userId, { password: hashedPassword })

    // 코드 무효화 (코드 재사용 방지)
    await this.resetDbService.updateResetCode(resetRequest.id, {
      isUsed: true,
      updatedAt: new Date(),
    })

    return '비밀번호가 성공적으로 재설정되었습니다.'
  }

  // 비밀번호 해싱
  async #hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10)
  }

  // 비밀번호 비교를 위한 메소드
  async #comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}
