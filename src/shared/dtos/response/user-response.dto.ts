import { SnsType } from '@/shared/enums/sns-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderTypeEnum, RoleEnum } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: '사용자 ID' })
  id: number;

  @ApiProperty({ example: 'example@example.com', description: '사용자 이메일 주소' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: '사용자 전체 이름', nullable: true })
  name?: string;

  @ApiProperty({ example: '010-1234-5678', description: '사용자 전화번호', nullable: true })
  phoneNumber?: string;

  @ApiProperty({ example: 'ACTIVE', description: '사용자 상태' })
  status: string;

  @ApiProperty({ description: 'provider 정보', nullable: true })
  providers?: ProviderDto[];

  @ApiProperty({ example: '2023-09-02T12:34:56Z', description: '사용자 생성 날짜' })
  createdAt: Date;

  @ApiProperty({ example: 'USER', description: '사용자 역할', nullable: true })
  roles?: RoleEnum[];

  @ApiProperty({ example: '1990-01-01', description: '사용자 생년월일', nullable: true })
  birthday?: Date;

  @ApiProperty({
    example: '서울특별시 강남구 테헤란로',
    description: '사용자 주소',
    nullable: true,
  })
  address?: string;

  @ApiProperty({ example: '101호', description: '사용자 상세 주소', nullable: true })
  addressDetail?: string;

  userAgree: UserAgreeResponseDto;

  password?: string;
}

class ProviderDto {
  @ApiProperty({ example: SnsType.GOOGLE, description: 'SNS 제공자 유형', nullable: true })
  providerType?: ProviderTypeEnum;

  @ApiProperty({ example: '1234567890', description: 'SNS 제공자 ID', nullable: true })
  providerId?: string;
}

export class UserAgreeResponseDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  userId: number;

  @ApiProperty({
    example: '2023-09-06T12:34:56Z',
    description: '동의가 생성된 날짜',
  })
  createdAt: Date;

  @ApiProperty({
    example: true,
    description: '연령 동의 여부',
  })
  @IsBoolean()
  isAgeAgree: boolean;

  @ApiProperty({
    example: true,
    description: '서비스 이용 동의 여부',
  })
  @IsBoolean()
  isServiceAgree: boolean;

  @ApiProperty({
    example: true,
    description: '개인정보 처리 방침 동의 여부',
  })
  @IsBoolean()
  isPrivateAgree: boolean;

  @ApiPropertyOptional({
    example: true,
    description: '마케팅 수신 동의 여부',
  })
  @IsOptional()
  @IsBoolean()
  isMarketingAgree?: boolean;

  @ApiPropertyOptional({
    example: '2023-09-06T12:34:56Z',
    description: '마케팅 수신 동의 변경 날짜',
  })
  @IsOptional()
  @IsDate()
  marketingAgreeUpdatedAt?: Date;
}
