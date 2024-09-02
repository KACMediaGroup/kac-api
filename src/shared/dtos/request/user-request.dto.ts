import { SnsType } from '@/shared/enums/sns-type.enum';
import { IsBoolean, IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignInRequestDto {
  @ApiProperty({
    example: true,
    description: 'SNS 로그인을 사용하는지 여부',
  })
  @IsBoolean()
  isSns: boolean;

  @ApiPropertyOptional({
    example: SnsType.GOOGLE,
    description: 'SNS 제공자 유형 (isSns가 true인 경우 필수)',
    enum: SnsType,
  })
  @IsOptional()
  @IsEnum(SnsType)
  providerType?: SnsType;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'SNS 제공자의 ID (isSns가 true인 경우 필수)',
  })
  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiPropertyOptional({
    example: 'example@example.com',
    description: '이메일 주소',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'yourpassword123',
    description: '비밀번호',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
