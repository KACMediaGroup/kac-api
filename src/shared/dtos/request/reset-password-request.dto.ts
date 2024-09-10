import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class ResetPasswordRequestDto {
  @ApiProperty({
    description: '재설정을 위한 인증 번호 받을 주소',
  })
  @IsEmail()
  email: string
}
