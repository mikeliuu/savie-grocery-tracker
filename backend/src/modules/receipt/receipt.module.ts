import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule {}
