import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import {
  MemberMutationsResolver,
  MemberQueriesResolver,
  MemberResolver,
} from './member.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from '../../models/member.model';
import { DatabaseModule } from '../../database/database.module';
import { LoggerService } from '../../common/loggers/logger.service';

@Module({
  imports: [SequelizeModule.forFeature([Member]), DatabaseModule],
  providers: [
    MemberService,
    MemberResolver,
    MemberQueriesResolver,
    MemberMutationsResolver,
    LoggerService,
  ],
})
export class MemberModule {}
