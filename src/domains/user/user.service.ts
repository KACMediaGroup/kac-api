import { BadRequestException, Injectable } from '@nestjs/common'
import { UserDbService } from '@/providers/database/services/user-db.service'
import { SnsType } from '@/shared/enums/sns-type.enum'
import { UserQueryDto } from '@/shared/dtos/query/user-query.dto'
import { UserResponseDto } from '@/shared/dtos/response/user-response.dto'
import { SignUpDto, UpdateUserRequestDto } from '@/shared/dtos/request/user-request.dto'
import ApplicationException from '@/shared/exceptions/application.exception'
import { ErrorCode } from '@/shared/exceptions/error-code'
import { BaseService } from '@/base.service'

@Injectable()
export class UserService extends BaseService {
  constructor(private userDbService: UserDbService) {
    super()
  }

  async profile(queryDto: UserQueryDto, includePw = false): Promise<UserResponseDto> {
    return await this.userDbService.readUser(queryDto, includePw)
  }

  async snsUser(snsType: SnsType, providerId: string): Promise<UserResponseDto | null> {
    return await this.userDbService.readSnsUser(snsType, providerId)
  }

  async signUp(dto: SignUpDto): Promise<UserResponseDto> {
    // 이메일 체크
    const existingUser = await this.userDbService.readUser({ email: dto.email })
    if (existingUser) {
      throw new ApplicationException(
        new BadRequestException('이미 존재하는 회원입니다.'),
        ErrorCode.ALREADY_EXISTS,
      )
    }

    return await this.userDbService.createUser(dto)
  }

  async updateUserInfo(userId: number, updateDto: UpdateUserRequestDto): Promise<UserResponseDto> {
    this.logger.debug(`[${this.updateUserInfo.name}] userId: ${userId}`)
    return await this.userDbService.updateUserInfo(userId, updateDto)
  }
}
