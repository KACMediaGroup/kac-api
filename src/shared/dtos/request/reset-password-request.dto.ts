import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class CreateResetCodeRequestDto {
  @ApiProperty({
    description: '재설정을 위한 인증 번호 받을 주소',
  })
  @IsEmail()
  email: string
}

export class ResetPasswordRequestDto {
  @ApiProperty({
    description: '유효성 체크할 비밀번호 재설정 코드',
  })
  @IsString()
  resetCode: string

  @IsString()
  @ApiProperty({
    description: '변경하려는 비밀번호',
  })
  newPassword: string
}
