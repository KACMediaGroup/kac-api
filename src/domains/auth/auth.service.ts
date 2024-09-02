import { UserDbService } from '@/providers/database/services/user-db.service';
import { SignInRequestDto } from '@/shared/dtos/request/user-request.dto';
import { AuthResponseDto } from '@/shared/dtos/response/auth-response.dto';
import ApplicationException from '@/shared/exceptions/application.exception';
import { ErrorCode } from '@/shared/exceptions/error-code';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userDbService: UserDbService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInRequestDto): Promise<AuthResponseDto> {
    const { isSns, providerType, providerId, email, password } = dto;

    if (isSns) {
      if (!providerType || !providerId) {
        throw new ApplicationException(
          new BadRequestException('잘못된 파라미터로 요청하였습니다.'),
          ErrorCode.WRONG_PARAMETER,
        );
      }

      const snsUser = await this.userDbService.readSnsUser(providerType, providerId);
      if (!snsUser) {
        // 이미 가입되었는지 확인
        const registeredUser = await this.userDbService.readUserByEmail(email ?? '');
        if (registeredUser) {
          throw new ApplicationException(
            new BadRequestException('이미 가입된 회원입니다.'),
            ErrorCode.ALREADY_EXISTS,
          );
        }
        throw new ApplicationException(
          new BadRequestException('계정이 존재하지 않습니다.'),
          ErrorCode.NOT_FOUND_ACCOUNT,
        );
      }

      const jwt = await this.jwtService.signAsync({
        id: snsUser.id,
        email: snsUser.email,
        roles: snsUser.roles,
      });

      return { accessToken: jwt };
    }

    // 이메일 로그인
    const user = await this.userDbService.readUserByEmail(email, true);

    if (!user) {
      throw new ApplicationException(
        new BadRequestException('계정이 존재하지 않습니다.'),
        ErrorCode.NOT_FOUND_ACCOUNT,
      );
    }

    // 소셜 가입 확인
    if (!user.password && user.providers.length > 0) {
    }

    // 비밀번호 체크
    const isSamePassword = this.#comparePassword(password, user.password || '');
    if (!isSamePassword) {
      throw new ApplicationException(
        new BadRequestException('이메일 혹은 비밀번호가 올바르지 않습니다.'),
        ErrorCode.WRONG_PARAMETER,
      );
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });

    return { accessToken: jwt };
  }

  // 비밀번호 비교를 위한 메소드
  async #comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
