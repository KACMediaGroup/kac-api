import { PrismaService } from '@/providers/database/prisma.service';
import { UserDbService } from '@/providers/database/services/user-db.service';
import { VerificationDbService } from '@/providers/database/services/verification-db.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [PrismaService, UserDbService, VerificationDbService],
  exports: [UserDbService, VerificationDbService],
})
export class DatabaseModule {}
