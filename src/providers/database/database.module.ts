import { PrismaService } from '@/providers/database/prisma.service'
import { ResetDbService } from '@/providers/database/services/reset-db.service'
import { UserDbService } from '@/providers/database/services/user-db.service'
import { VerificationDbService } from '@/providers/database/services/verification-db.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [PrismaService, UserDbService, VerificationDbService, ResetDbService],
  exports: [UserDbService, VerificationDbService, ResetDbService],
})
export class DatabaseModule {}
