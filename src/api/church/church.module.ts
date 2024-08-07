import { Module } from '@nestjs/common';
import { ChurchService } from './church.service';
import {
  ChurchMutationsResolver,
  ChurchQueriesResolver,
  ChurchResolver,
} from './church.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Church } from '../../models/church.model';
import { LoggerService } from '../../common/loggers/logger.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [SequelizeModule.forFeature([Church]), DatabaseModule],
  providers: [
    ChurchService,
    ChurchResolver,
    ChurchQueriesResolver,
    ChurchMutationsResolver,
    LoggerService,
  ],
})
export class ChurchModule {}
