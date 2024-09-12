import { Controller, Get, UseGuards, Patch, Body, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from './user.service'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserId } from '@/shared/decorators/user-id.decorator'
import { UpdateUserRequestDto } from '@/shared/dtos/request/user-request.dto'
import { UserResponseDto } from '@/shared/dtos/response/user-response.dto'

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@UserId(ParseIntPipe) userId: number) {
    return this.userService.profile({ id: userId })
  }

  @Patch()
  @ApiResponse({ type: UserResponseDto })
  async modifyUserInfo(
    @UserId() userId: number,
    @Body() updateDto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    console.log(`userId: ${userId}`)
    return await this.userService.updateUserInfo(userId, updateDto)
  }
}
