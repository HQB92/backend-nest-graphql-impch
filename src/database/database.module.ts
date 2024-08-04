import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Member } from '../models/member.model';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('PGHOST'),
        port: 5432,
        username: configService.get<string>('PGUSER'),
        password: configService.get<string>('PGPASSWORD'),
        database: configService.get<string>('PGDATABASE'),
        autoLoadModels: false,
        synchronize: false,
        models: [User, Member],
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User, Member]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
