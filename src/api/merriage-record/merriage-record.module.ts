import { Module } from '@nestjs/common';
import { MerriageRecordService } from './merriage-record.service';
import {
  MerriageRecordMutationsResolver,
  MerriageRecordQueriesResolver,
  MerriageRecordResolver,
} from './merriage-record.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { MerriageRecord } from '../../models/merriageRecord.model';
import { DatabaseModule } from '../../database/database.module';
import { LoggerService } from '../../common/loggers/logger.service';

@Module({
  imports: [SequelizeModule.forFeature([MerriageRecord]), DatabaseModule],
  providers: [
    MerriageRecordService,
    MerriageRecordResolver,
    MerriageRecordMutationsResolver,
    MerriageRecordQueriesResolver,
    LoggerService,
  ],
})
export class MerriageRecordModule {}
