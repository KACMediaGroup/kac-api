import { SnsType } from '@/shared/enums/sns-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderTypeEnum, RoleEnum } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'example@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name', nullable: true })
  name?: string;

  @ApiProperty({ example: '010-1234-5678', description: 'User phone number', nullable: true })
  phoneNumber?: string;

  @ApiProperty({ example: 'ACTIVE', description: 'User status' })
  status: string;

  @ApiProperty({ description: 'provider 정보', nullable: true })
  providers?: ProviderDto[];

  @ApiProperty({ example: '2023-09-02T12:34:56Z', description: 'User created date' })
  createdAt: Date;

  @ApiProperty({ example: 'USER', description: 'User role', nullable: true })
  roles?: RoleEnum[];

  password?: string;
}

class ProviderDto {
  @ApiProperty({ example: SnsType.GOOGLE, description: 'SNS provider type', nullable: true })
  providerType?: ProviderTypeEnum;

  @ApiProperty({ example: '1234567890', description: 'SNS provider ID', nullable: true })
  providerId?: string;
}
