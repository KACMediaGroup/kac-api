import { PrismaService } from '@/providers/database/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ResetDbService {
  constructor(private prisma: PrismaService) {}

  async createResetPassword(userId: number, resetCode: string, expiresAt: Date) {
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
}
