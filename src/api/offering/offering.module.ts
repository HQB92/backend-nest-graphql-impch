import { forwardRef, Module } from '@nestjs/common';
import { OfferingService } from './offering.service';
import {
  OfferingMutationsResolver,
  OfferingQueriesResolver,
  OfferingResolver,
} from './offering.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '../../database/database.module';
import { Offering } from '../../models/offering.model';
import { LoggerService } from '../../common/loggers/logger.service';
import { ChurchModule } from '../church/church.module';
import { Church } from '../../models/church.model';
import { BankModule } from '../bank/bank.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Offering, Church]),
    DatabaseModule,
    BankModule,
    forwardRef(() => BankModule),
  ],
  providers: [
    OfferingService,
    OfferingResolver,
    OfferingQueriesResolver,
    OfferingMutationsResolver,
    LoggerService,
    ChurchModule,
  ],
})
export class OfferingModule {}
