import { AuthService } from '@/domains/auth/auth.service';
import { SignInRequestDto } from '@/shared/dtos/request/user-request.dto';
import { SendVerificationRequestDto } from '@/shared/dtos/request/verification-request.dto';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

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

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInRequestDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: '인증 코드 발송 요청' })
  @ApiBody({ type: SendVerificationRequestDto })
  @Post('verification')
  async sendVerification(@Body() dto: SendVerificationRequestDto) {
    await this.authService.sendVerification(dto);
  }
}
