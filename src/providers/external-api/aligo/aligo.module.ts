import { Module } from '@nestjs/common';
import { AligoService } from './aligo.service';

@Module({
  providers: [AligoService],
  exports: [AligoService],
})
export class AligoModule {}
