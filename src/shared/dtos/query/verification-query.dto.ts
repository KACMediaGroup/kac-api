import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VerificationTypeEnum, VerificationMethodEnum } from '@prisma/client'; // Prisma에서 생성된 enum 가져오기

export class VerificationQueryDto {
  @ApiProperty({
    description: '인증 유형 (회원가입, 프로필 업데이트, 비밀번호 재설정 등)',
    enum: VerificationTypeEnum,
    example: VerificationTypeEnum.SIGNUP,
  })
  @IsEnum(VerificationTypeEnum, { message: '유효한 인증 유형을 선택해야 합니다.' })
  type: VerificationTypeEnum;

  @ApiProperty({
    description: '인증 방법 (전화번호, 이메일)',
    enum: VerificationMethodEnum,
    example: VerificationMethodEnum.PHONE,
  })
  @IsEnum(VerificationMethodEnum, { message: '유효한 인증 방법을 선택해야 합니다.' })
  method: VerificationMethodEnum;

  @ApiProperty({
    description: '사용자의 전화번호 또는 이메일 (인증에 사용할 식별자)',
    example: '01012345678',
  })
  @IsString({ message: '식별자는 문자열이어야 합니다.' })
  identifier: string;

  @ApiProperty({
    description: '인증 문자',
    example: '123456',
  })
  @IsString()
  verificationCode: string;

  @IsOptional()
  refDate?: Date;
}
