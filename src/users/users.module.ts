import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import {
  UserResolver,
  UserMutationsResolver,
  UserQueriesResolver,
} from './users.resolver';
import { User } from '../models/user.model';
import { DatabaseModule } from '../database/database.module';
import { LoggerService } from '../common/loggers/logger.service';

@Module({
  imports: [SequelizeModule.forFeature([User]), DatabaseModule],
  providers: [
    UsersService,
    UserResolver,
    UserMutationsResolver,
    UserQueriesResolver,
    LoggerService,
  ],
})
export class UsersModule {}
