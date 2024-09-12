import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '@/domains/user/user.module'
import { DatabaseModule } from '@/providers/database/database.module'
import { AligoModule } from '@/providers/external-api/aligo/aligo.module'
import { EmailModule } from '@/providers/email/email.module'
import { JwtStrategy } from '@/domains/auth/strategies/jwt.strategy'

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret'),
        signOptions: { expiresIn: configService.get<string>('auth.expiresIn') },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    DatabaseModule,
    AligoModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
