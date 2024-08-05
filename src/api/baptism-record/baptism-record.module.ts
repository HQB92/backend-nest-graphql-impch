import { Module } from '@nestjs/common';
import { BaptismRecordService } from './baptism-record.service';
import { BaptismRecordResolver } from './baptism-record.resolver';

@Module({
  providers: [BaptismRecordService, BaptismRecordResolver]
})
export class BaptismRecordModule {}
