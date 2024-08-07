import { Module } from '@nestjs/common';
import { BaptismRecordService } from './baptism-record.service';
import {
  BaptismRecordMutationsResolver,
  BaptismRecordQueriesResolver,
  BaptismRecordResolver,
} from './baptism-record.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { BaptismRecord } from '../../models/baptismRecord.model';
import { DatabaseModule } from '../../database/database.module';
import { LoggerService } from '../../common/loggers/logger.service';

@Module({
  imports: [SequelizeModule.forFeature([BaptismRecord]), DatabaseModule],
  providers: [
    BaptismRecordService,
    BaptismRecordResolver,
    LoggerService,
    BaptismRecordQueriesResolver,
    BaptismRecordMutationsResolver,
  ],
})
export class BaptismRecordModule {}
