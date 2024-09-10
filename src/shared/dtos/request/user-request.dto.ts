import { SnsType } from '@/shared/enums/sns-type.enum'
import { IsBoolean, IsEmail, IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SignUpDto {
  @ApiProperty({
    description: '사용자의 이름',
    example: '홍길동',
  })
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 사항입니다.' })
  name: string

  @ApiPropertyOptional({
    description: '비밀번호 (소셜 로그인을 사용하는 경우 필수 아님)',
    example: 'strong_password_123',
  })
  @IsOptional()
  @IsString()
  password?: string

  @ApiProperty({
    description: '사용자의 이메일 주소',
    example: 'hong.gildong@example.com',
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력하세요.' })
  email: string

  @ApiPropertyOptional({
    description: '사용하는 소셜 로그인 제공자의 종류 (예: GOOGLE, FACEBOOK)',
    enum: SnsType,
  })
  @IsOptional()
  @IsEnum(SnsType, { message: '유효한 SNS 제공자 유형이어야 합니다.' })
  providerType?: SnsType

  @ApiProperty({
    description: '소셜 로그인 제공자에서 받은 고유 ID',
    example: '1234567890',
  })
  @IsNotEmpty({ message: '소셜 로그인 제공자 ID는 필수 입력 사항입니다.' })
  @IsString()
  providerId: string

  @ApiProperty({
    description: '사용자의 전화번호',
    example: '01012345678',
  })
  @IsString()
  @IsNotEmpty({ message: '전화번호는 필수 입력 사항입니다.' })
  phoneNumber: string

  @ApiPropertyOptional({
    description: '마케팅 수신 동의 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isMarketingAgree?: boolean
}

export class SignUpRequestDto extends SignUpDto {
  constructor() {
    super()
  }

  @ApiProperty({
    description: '전화번호로 발송된 인증 번호',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: '인증 번호는 필수 입력 사항입니다.' })
  verificationCode: string
}

export class SignInRequestDto {
  @ApiProperty({
    example: true,
    description: 'SNS 로그인을 사용하는지 여부',
  })
  @IsBoolean()
  isSns: boolean

  @ApiPropertyOptional({
    example: SnsType.GOOGLE,
    description: 'SNS 제공자 유형 (isSns가 true인 경우 필수)',
    enum: SnsType,
  })
  @IsOptional()
  @IsEnum(SnsType)
  providerType?: SnsType

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'SNS 제공자의 ID (isSns가 true인 경우 필수)',
  })
  @IsOptional()
  @IsString()
  providerId?: string

  @ApiPropertyOptional({
    example: 'example@example.com',
    description: '이메일 주소',
  })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({
    example: 'yourpassword123',
    description: '비밀번호',
  })
  @IsOptional()
  @IsString()
  password?: string
}
