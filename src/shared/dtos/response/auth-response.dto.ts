import { ApiProperty } from '@nestjs/swagger'

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJ...',
    description: 'JWT 액세스 토큰',
    required: true,
  })
  accessToken: string
}
