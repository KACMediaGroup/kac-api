import { PrismaService } from '@/providers/database/prisma.service'
import { UserQueryDto } from '@/shared/dtos/query/user-query.dto'
import { SignUpDto, UpdateUserRequestDto } from '@/shared/dtos/request/user-request.dto'
import { UserAgreeResponseDto, UserResponseDto } from '@/shared/dtos/response/user-response.dto'
import { SnsType } from '@/shared/enums/sns-type.enum'
import { Injectable } from '@nestjs/common'
import { Prisma, Provider, Role, User } from '@prisma/client'

type PartialUser = Partial<User> & {
  roles: Role[]
  providers: Provider[]
  userAgree?: UserAgreeResponseDto
}

@Injectable()
export class UserDbService {
  constructor(private prisma: PrismaService) {}

  async readUser(queryDto: UserQueryDto, includePw = false): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findFirst({
      where: queryDto,
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        status: true,
        createdAt: true,
        roles: true,
        providers: true,
        password: includePw, // 패스워드 포함 여부
      },
    })

    return user ? this.#mapToUserResponseDto(user) : null
  }

  async readSnsUser(providerType: SnsType, providerId: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        status: true,
        createdAt: true,
        roles: true,
        providers: true,
      },
      where: {
        providers: {
          some: {
            providerType,
            providerId,
          },
        },
      },
    })

    return user ? this.#mapToUserResponseDto(user) : null
  }

  async createUser(dto: SignUpDto): Promise<UserResponseDto> {
    const { providerType, providerId, isMarketingAgree, ...rest } = dto
    const user = await this.prisma.user.create({
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        status: true,
        createdAt: true,
        roles: true,
        providers: true,
        birthday: true,
        address: true,
        addressDetail: true,
        userAgree: true,
      },
      data: {
        ...rest,
        providers: {
          create: [
            {
              providerType, // providerType이 SignUpDto에 있다고 가정
              providerId, // providerId도 포함
            },
          ],
        },
        userAgree: {
          create: { isMarketingAgree },
        },
      },
    })
    return this.#mapToUserResponseDto(user)
  }

  // 사용자 정보 업데이트 메소드
  async updateUserInfo(userId: number, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    const {
      email,
      phoneNumber,
      password,
      name,
      birthday,
      address,
      addressDetail,
      isMarketingAgree,
    } = dto

    // 현재 유저 정보를 가져옴 (User와 UserAgree 정보를 함께 가져옴)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userAgree: true }, // UserAgree 정보 포함
    })

    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.')
    }

    // UserAgree 마케팅 동의 여부 변경 시에만 updatedAt 기록
    const marketingAgreeData: Prisma.UserAgreeUpdateInput | undefined =
      isMarketingAgree !== undefined
        ? {
            isMarketingAgree,
            marketingAgreeUpdatedAt: new Date(), // 변경 시 현재 시간 기록
          }
        : undefined // 동의 여부가 변경되지 않으면 undefined로 설정

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email,
        phoneNumber,
        password,
        name,
        birthday,
        address,
        addressDetail,
        updatedAt: new Date(), // 업데이트 시간 기록

        // UserAgree 정보가 변경된 경우에만 업데이트
        userAgree: marketingAgreeData
          ? {
              update: marketingAgreeData,
            }
          : undefined,
      },
      include: {
        roles: true,
        providers: true,
        userAgree: true,
      },
    })

    // 업데이트된 사용자 정보를 UserResponseDto로 매핑하여 반환
    return this.#mapToUserResponseDto(updatedUser)
  }

  /*
  기존 DB 설계 및 구조에서는 유저의 역할을 하나로 봅니다.
  USER: 5 -> ADMIN(관리자): 1 순서대로 권한이 높아지는 방식입니다.
  따라서 user의 역할 중에 가장 수를 리턴합니다.
  만약 유저가 5와 2의 권한을 가지고 있고, 3번 권한이 필요한 영역에는 권한을 부여하지 않아야할 경우,
  이 구조는 개선이 필요합니다.
  */
  // async readUserRole(userId: number): Promise<number> {
  //   const role = await this.prisma.role.findFirst({
  //     where: { userId },
  //   });
  // }

  #mapToUserResponseDto(user: PartialUser): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      status: user.status,
      createdAt: user.createdAt,
      providers: user.providers?.map((providerInfo: Provider) => ({
        providerId: providerInfo.providerId,
        providerType: providerInfo.providerType,
      })),
      roles: user.roles.map((role: Role) => role.role),
      birthday: user.birthday,
      address: user.address,
      addressDetail: user.addressDetail,
      userAgree: user.userAgree,
    }
  }
}
