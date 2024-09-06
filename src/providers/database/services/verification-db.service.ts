import { PrismaService } from '@/providers/database/prisma.service';
import { VerificationQueryDto } from '@/shared/dtos/query/verification-query.dto';
import { CreateVerificationDto } from '@/shared/dtos/request/verification-request.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationDbService {
  constructor(private prisma: PrismaService) {}

  async createVerification(dto: CreateVerificationDto) {
    const result = await this.prisma.verification.create({
      data: dto,
    });
    return result;
  }

  async verification(queryDto: VerificationQueryDto) {
    const { laterThan, ...rest } = queryDto;
    return await this.prisma.verification.count({
      where: { ...rest, createdAt: laterThan ? { gte: laterThan } : undefined },
    });
  }
}
