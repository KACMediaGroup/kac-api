import { Injectable } from '@nestjs/common';
import { UserDbService } from '@/providers/database/services/user-db.service';
import { SnsType } from '@/shared/enums/sns-type.enum';
import { UserQueryDto } from '@/shared/dtos/query/user-query.dto';
import { UserResponseDto } from '@/shared/dtos/response/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userDbService: UserDbService) {}

  async profile(queryDto: UserQueryDto, includePw = false) {
    return await this.userDbService.readUser(queryDto, includePw);
  }

  async snsUser(snsType: SnsType, providerId: string): Promise<UserResponseDto | null> {
    return await this.userDbService.readSnsUser(snsType, providerId);
  }

  // 인증한 휴대폰 번호와 가입하려는 휴대폰 번호가 다른 경우 방지
  async checkVerifiedPhoneNumber(phoneNumber: string): Promise<void> {
    // TODO: 베리파이한 넘버 불러오기
    console.log(phoneNumber);
  }
}
