import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import {
  StatusMutationsResolver,
  StatusQueriesResolver,
  StatusResolver,
} from './status.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '../../database/database.module';
import { Status } from '../../models/status.model';
import { LoggerService } from '../../common/loggers/logger.service';

@Module({
  imports: [SequelizeModule.forFeature([Status]), DatabaseModule],
  providers: [
    StatusService,
    StatusResolver,
    StatusQueriesResolver,
    StatusMutationsResolver,
    LoggerService,
  ],
})
export class StatusModule {}
