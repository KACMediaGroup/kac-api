import { PrismaService } from '@/providers/database/prisma.service';
import { UserDbService } from '@/providers/database/services/user-db.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [PrismaService, UserDbService],
  exports: [UserDbService],
})
export class DatabaseModule {}
