import { BaseService } from '@/base.service'
import { UserService } from '@/domains/user/user.service'
import { ResetDbService } from '@/providers/database/services/reset-db.service'
import { VerificationDbService } from '@/providers/database/services/verification-db.service'
import { EmailService } from '@/providers/email/email.service'
import { AligoService } from '@/providers/external-api/aligo/aligo.service'
import { VerificationQueryDto } from '@/shared/dtos/query/verification-query.dto'
import { SendAligoRequestDto } from '@/shared/dtos/request/send-aligo-request.dto'
import { SignInRequestDto, SignUpRequestDto } from '@/shared/dtos/request/user-request.dto'
import { SendVerificationRequestDto } from '@/shared/dtos/request/verification-request.dto'
import { AuthResponseDto } from '@/shared/dtos/response/auth-response.dto'
import { TemplateCode } from '@/shared/enums/kakao-template-code.enum'
import ApplicationException from '@/shared/exceptions/application.exception'
import { ErrorCode } from '@/shared/exceptions/error-code'
import { CodeGeneratorUtil } from '@/shared/utils/code-generator.util'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import * as dayjs from 'dayjs'

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
    console.log(user.providers)
    // Oauth 유저면 애초에 비밀번호 없음
    if (user.providers && user.providers.length > 0) {
      throw new ApplicationException(
        new BadRequestException('비밀번호 재설정을 요청할 수 없습니다.'),
        ErrorCode.BAD_REQUEST_ERROR,
      )
    }

    const resetCode = CodeGeneratorUtil.generateRandomString(24)
    // 임시 비밀번호 기한 설정: 1시간
    const expiresAt = dayjs().add(1, 'hour').toDate()
    const result = await this.resetDbService.createResetPassword(user.id, resetCode, expiresAt)
    console.log(result)

    await this.emailService.sendEmailToResetPassword(email, resetCode, user.name)

    return '비밀번호 재설정 메일이 발송되었습니다.'
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
