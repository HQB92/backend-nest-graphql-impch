import { forwardRef, Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '../../database/database.module';
import { Bank } from '../../models/bank.model';
import { LoggerService } from '../../common/loggers/logger.service';
import { Church } from '../../models/church.model';
import { OfferingModule } from '../offering/offering.module';
import { BankResolver } from './bank.resolver';

@Module({
  imports: [
    SequelizeModule.forFeature([Bank, Church]),
    DatabaseModule,
    forwardRef(() => OfferingModule),
  ],
  providers: [BankService, LoggerService, BankResolver],
  exports: [BankService],
})
export class BankModule {}
