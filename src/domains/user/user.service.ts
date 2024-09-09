import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDbService } from '@/providers/database/services/user-db.service';
import { SnsType } from '@/shared/enums/sns-type.enum';
import { UserQueryDto } from '@/shared/dtos/query/user-query.dto';
import { UserResponseDto } from '@/shared/dtos/response/user-response.dto';
import { SignUpRequestDto } from '@/shared/dtos/request/user-request.dto';
import ApplicationException from '@/shared/exceptions/application.exception';
import { ErrorCode } from '@/shared/exceptions/error-code';

@Injectable()
export class UserService {
  constructor(private userDbService: UserDbService) {}

  async profile(queryDto: UserQueryDto, includePw = false) {
    return await this.userDbService.readUser(queryDto, includePw);
  }

  async snsUser(snsType: SnsType, providerId: string): Promise<UserResponseDto | null> {
    return await this.userDbService.readSnsUser(snsType, providerId);
  }

  async signUp(dto: SignUpRequestDto) {
    const { verifyString, ...rest } = dto;

    // 이메일 체크
    const existingUser = await this.userDbService.readUser({ email: rest.email });
    if (existingUser) {
      throw new ApplicationException(
        new BadRequestException('이미 존재하는 회원입니다.'),
        ErrorCode.ALREADY_EXISTS,
      );
    }

    return await this.userDbService.createUser(rest);
  }
}
