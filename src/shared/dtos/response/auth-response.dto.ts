import { ApiProperty } from '@nestjs/swagger'

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJ...',
    description: 'JWT 액세스 토큰',
    nullable: true,
  })
  accessToken?: string

  @ApiProperty({
    example: true,
    description: '유저 존재하지 않음',
    nullable: true,
  })
  userNotFound?: boolean
}
