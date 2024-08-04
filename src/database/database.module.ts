import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Member } from '../models/member.model';
import { Church } from '../models/church.model';
import { Status } from '../models/status.model';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: PGHOST,
      port: 5432,
      database: PGDATABASE,
      username: PGUSER,
      password: PGPASSWORD,
      models: [User, Member, Church, Status],
      autoLoadModels: true,
    }),
    SequelizeModule.forFeature([User, Member, Church, Status]),
  ],
})
export class DatabaseModule {}
