import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  // 클라이언트 확장 방식으로 미들웨어를 구현
  $extends = this.$extends({
    client: {
      $use: async (params, next) => {
        const before = Date.now();
        const result = await next(params);
        const after = Date.now();

        console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

        return result;
      },
    },
  });
}
