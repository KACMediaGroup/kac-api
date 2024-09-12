import { AuthService } from '@/domains/auth/auth.service'
import { VerificationQueryDto } from '@/shared/dtos/query/verification-query.dto'
import {
  CreateResetCodeRequestDto,
  ResetPasswordRequestDto,
} from '@/shared/dtos/request/reset-password-request.dto'
import { SignInRequestDto, SignUpRequestDto } from '@/shared/dtos/request/user-request.dto'
import { SendVerificationRequestDto } from '@/shared/dtos/request/verification-request.dto'
import { UserResponseDto } from '@/shared/dtos/response/user-response.dto'
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { AuthResponseDto } from '@/shared/dtos/response/auth-response.dto'
import { CodeGeneratorUtil } from '@/shared/utils/code-generator.util'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('callback/kakao')
  async kakaoAuthRedirect(@Query('code') code: string): Promise<AuthResponseDto> {
    // 카카오 로그인 성공 후 리다이렉트되는 페이지
    return await this.authService.kakaoLogin(code)
  }

  // 테스트용 (네이버 로그인 진입점)
  @Get('naver')
  async naverSignIn(@Res() res: Response) {
    const clientId = this.configService.get('auth.naver.clientId')
    const state = CodeGeneratorUtil.generateRandomString(10)
    const redirectURI = encodeURIComponent(this.configService.get('auth.naver.redirectUrl'))

    const api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectURI}&state=${state}`

    // 네이버 로그인 페이지로 리다이렉트
    return res.redirect(api_url)
  }

  @Get('callback/naver')
  async naverAuthRedirect(
    @Query('code') code: string,
    @Query('state') state: string,
  ): Promise<AuthResponseDto> {
    console.log(`state: ${state}`)
    // AuthService를 통해 네이버 API 호출 및 토큰 검증
    return await this.authService.naverLogin(code, state)
  }

  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({ type: UserResponseDto })
  @Post('sign-up')
  async signUp(@Body() dto: SignUpRequestDto) {
    return await this.authService.signUp(dto)
  }

  @ApiOperation({ summary: '회원 로그인' })
  @ApiResponse({ type: UserResponseDto })
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInRequestDto) {
    return await this.authService.signIn(signInDto)
  }

  @ApiOperation({ summary: '인증 코드 발송 요청' })
  @ApiBody({ type: SendVerificationRequestDto })
  @ApiResponse({ type: String, example: '알림톡이 발송되었습니다.' })
  @Post('send-verification')
  async sendVerification(@Body() dto: SendVerificationRequestDto) {
    return await this.authService.sendVerification(dto)
  }

  @ApiOperation({ summary: '인증 코드 확인' })
  @ApiBody({ type: VerificationQueryDto })
  @ApiResponse({ type: String, example: '인증이 성공하였습니다.' })
  @Post('verify-code')
  async verifyCode(@Body() dto: VerificationQueryDto) {
    return await this.authService.checkVerifyCode(dto)
  }

  @Post('reset-password/send')
  async requestResetPassword(@Body() { email }: CreateResetCodeRequestDto) {
    return await this.authService.requestPasswordReset(email)
  }

  @Post('reset-password')
  async modifyPassword(@Body() dto: ResetPasswordRequestDto) {
    return await this.authService.resetPassword(dto)
  }
}
