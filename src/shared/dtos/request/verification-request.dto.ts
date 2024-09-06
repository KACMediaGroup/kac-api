import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationTypeEnum, VerificationMethodEnum } from '@prisma/client'; // Prisma에서 생성된 enum을 가져옴

export class CreateVerificationDto {
  @ApiProperty({
    description: '인증 유형 (회원가입, 프로필 업데이트, 비밀번호 재설정 등)',
    enum: VerificationTypeEnum,
    example: VerificationTypeEnum.SIGNUP,
  })
  @IsEnum(VerificationTypeEnum, { message: '유효한 인증 유형을 선택해야 합니다.' })
  @IsNotEmpty({ message: '인증 유형은 필수 입력 항목입니다.' })
  type: VerificationTypeEnum;

  @ApiProperty({
    description: '인증 수단 (폰, 이메일 등)',
    enum: VerificationMethodEnum,
    example: VerificationMethodEnum.PHONE,
  })
  @IsEnum(VerificationMethodEnum, { message: '유효한 인증 수단을 선택해야 합니다.' })
  method: VerificationMethodEnum;

  @ApiProperty({
    description: '사용자의 전화번호 또는 이메일 (인증에 사용할 식별자)',
    example: '01012345678',
  })
  @IsString()
  @IsNotEmpty({ message: '전화번호 또는 이메일은 필수 입력 항목입니다.' })
  identifier: string;

  @ApiProperty({
    description: '사용자에게 발송된 인증 번호',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: '인증 번호는 필수 입력 항목입니다.' })
  verifyString: string;

  @ApiProperty({
    description: '인증 번호의 만료 시간',
    example: '2024-01-01T12:00:00Z',
    required: false,
  })
  @IsOptional()
  expiresAt: Date;
}

export class SendVerificationRequestDto {
  @ApiPropertyOptional({
    description: '폰 번호, 이메일 등',
    example: '01012345678',
  })
  @IsOptional()
  identifier: string;

  @ApiProperty({
    description: '인증 수단',
    example: VerificationMethodEnum.EMAIL,
  })
  @IsEnum(VerificationMethodEnum, { message: '유효한 인증 수단을 선택해야 합니다.' })
  method: VerificationMethodEnum;

  @ApiProperty({
    description: '인증 유형 (회원가입, 프로필 업데이트, 비밀번호 재설정 등)',
    enum: VerificationTypeEnum,
    example: VerificationTypeEnum.SIGNUP,
  })
  @IsEnum(VerificationTypeEnum, { message: '유효한 인증 유형을 선택해야 합니다.' })
  @IsNotEmpty({ message: '인증 유형은 필수 입력 항목입니다.' })
  type: VerificationTypeEnum;
}
