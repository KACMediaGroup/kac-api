import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { UserService } from '@/domains/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // JWT 만료 고려
      secretOrKey: configService.get('auth.jwtSecret'),
    })
  }

  async validate(payload: any) {
    // JWT 페이로드에서 유저 정보 추출 및 유저 인증 처리
    const user = await this.userService.user(payload.id)
    if (!user) {
      throw new UnauthorizedException('Invalid token')
    }
    return user // req.user에 저장
  }
}
