import { PrismaService } from '@/providers/database/prisma.service';
import { UserResponseDto } from '@/shared/dtos/response/user-response.dto';
import { SnsType } from '@/shared/enums/sns-type.enum';
import { Injectable } from '@nestjs/common';
import { Provider, Role, User } from '@prisma/client';

type PartialUser = Partial<User> & { roles: Role[]; providers: Provider[] };

@Injectable()
export class UserDbService {
  constructor(private readonly prisma: PrismaService) {}

  async readUser(userId: number): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
    });
    return user ? this.#mapToUserResponseDto(user) : null;
  }

  async readUserByEmail(email: string, includePw = false): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
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
    });

    return user ? this.#mapToUserResponseDto(user) : null;
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
    });

    return user ? this.#mapToUserResponseDto(user) : null;
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
    };
  }
}
