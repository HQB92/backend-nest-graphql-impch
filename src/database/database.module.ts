import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Member } from '../models/member.model';
import { Church } from '../models/church.model';
import { Status } from '../models/status.model';
import 'dotenv/config';
import { Bank } from '../models/bank.model';
import { MarriageRecord } from '../models/merriageRecord.model';
import { BaptismRecord } from '../models/baptismRecord.model';
import { Offering } from '../models/offering.model';

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: PGHOST,
      port: 5432,
      username: PGUSER,
      password: PGPASSWORD,
      database: PGDATABASE,
      models: [
        User,
        Member,
        Church,
        Status,
        Bank,
        MarriageRecord,
        BaptismRecord,
        Offering,
      ],
      autoLoadModels: true,
      synchronize: false,
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
