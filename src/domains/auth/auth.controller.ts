import { AuthService } from '@/domains/auth/auth.service';
import { VerificationQueryDto } from '@/shared/dtos/query/verification-query.dto';
import { SignInRequestDto, SignUpRequestDto } from '@/shared/dtos/request/user-request.dto';
import { SendVerificationRequestDto } from '@/shared/dtos/request/verification-request.dto';
import { UserResponseDto } from '@/shared/dtos/response/user-response.dto';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {
    // 카카오 로그인 페이지로 리다이렉트합니다.
  }

  @Get('kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  kakaoAuthRedirect(@Req() req) {
    // 카카오 로그인 성공 후 리다이렉트되는 페이지
    return {
      message: 'Kakao 로그인 성공',
      user: req.user,
    };
  }

  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({ type: UserResponseDto })
  @Post('sign-up')
  async signUp(@Body() dto: SignUpRequestDto) {
    return await this.authService.signUp(dto);
  }

  @ApiOperation({ summary: '회원 로그인' })
  @ApiResponse({ type: UserResponseDto })
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInRequestDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: '인증 코드 발송 요청' })
  @ApiBody({ type: SendVerificationRequestDto })
  @ApiResponse({ type: String, example: '알림톡이 발송되었습니다.' })
  @Post('send-verification')
  async sendVerification(@Body() dto: SendVerificationRequestDto) {
    return await this.authService.sendVerification(dto);
  }

  @ApiOperation({ summary: '인증 코드 확인' })
  @ApiBody({ type: VerificationQueryDto })
  @ApiResponse({ type: String, example: '인증이 성공하였습니다.' })
  @Post('verify-code')
  async verifyCode(@Body() dto: VerificationQueryDto) {
    return await this.authService.checkVerifyCode(dto);
  }
}
