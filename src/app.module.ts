import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { TransformResponseMiddleware } from './common/middleware/transform-response.middleware';
import { GqlAuthGuard } from './auth/jwt-auth.guard';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { LoggerService } from './common/loggers/logger.service';

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
  ],
  providers: [GqlAuthGuard, LoggerService],
  exports: [LoggerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TransformResponseMiddleware, AuthMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }
}
