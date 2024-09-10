import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-kakao'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      callbackURL: configService.get<string>('KAKAO_REDIRECT_URL'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET'),
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, username, _json } = profile
    const user = {
      id,
      username,
      email: _json.kakao_account.email,
      profileImage: _json.properties.profile_image,
      accessToken,
      refreshToken,
    }
    done(null, user)
  }
}
