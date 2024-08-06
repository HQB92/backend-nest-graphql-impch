import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankResolver } from './bank.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '../../database/database.module';
import { Bank } from '../../models/bank.model';
import { LoggerService } from '../../common/loggers/logger.service';

@Module({
  imports: [SequelizeModule.forFeature([Bank]), DatabaseModule],
  providers: [BankService, BankResolver, LoggerService],
})
export class BankModule {}
