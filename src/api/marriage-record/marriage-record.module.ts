import { Module } from '@nestjs/common';
import { MarriageRecordService } from './marriage-record.service';
import { MarriageRecordResolver } from './marriage-record.resolver';

@Module({
  providers: [MarriageRecordService, MarriageRecordResolver]
})
export class MarriageRecordModule {}
