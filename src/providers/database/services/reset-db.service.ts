import { PrismaService } from '@/providers/database/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ResetDbService {
  constructor(private prisma: PrismaService) {}

  async createResetCode(userId: number, resetCode: string, expiresAt: Date) {
    return await this.prisma.resetPassword.create({
      data: {
        resetCode,
        expiresAt,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: true,
      },
    })
  }

  async findByCode(resetCode: string) {
    return await this.prisma.resetPassword.findFirst({
      where: { resetCode },
    })
  }

  async updateResetCode(id: number, updateDto: { isUsed: boolean; updatedAt: Date }) {
    await this.prisma.resetPassword.update({
      where: { id },
      data: updateDto,
    })
  }
}
