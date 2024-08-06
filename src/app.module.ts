import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './api/users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { TransformResponseMiddleware } from './common/middleware/transform-response.middleware';
import { GqlAuthGuard } from './api/auth/jwt-auth.guard';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { LoggerService } from './common/loggers/logger.service';
import { StatusModule } from './api/status/status.module';
import { OfferingModule } from './api/offering/offering.module';
import { MarriageRecordModule } from './api/marriage-record/marriage-record.module';
import { MemberModule } from './api/member/member.module';
import { ChurchModule } from './api/church/church.module';
import { BaptismRecordModule } from './api/baptism-record/baptism-record.module';
import { BankModule } from './api/bank/bank.module';

interface GraphQLErrorExtensions {
  code?: number;
  exception?: {
    code?: number;
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      path: '/graphql',
      context: ({ req, res }) => ({ req, res }),
      playground: true,
      introspection: true,
      formatError: (error) => {
        const extensions = error.extensions as GraphQLErrorExtensions;
        const code = extensions.exception?.code || 500;
        return {
          message: error.message,
          code: code,
        };
      },
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    StatusModule,
    OfferingModule,
    MarriageRecordModule,
    MemberModule,
    ChurchModule,
    BaptismRecordModule,
    BankModule,
  ],
  providers: [GqlAuthGuard, LoggerService],
  exports: [LoggerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, TransformResponseMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }
}
