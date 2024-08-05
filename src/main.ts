import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import 'dotenv/config';
import { UsersService } from './users/users.service';
import { GqlCustomExceptionFilter } from './common/filters/graphql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const usersService = app.get(UsersService);

  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    usersService
      .findUserById(user.id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });
  app.useGlobalFilters(new GqlCustomExceptionFilter());
  await app.listen(4000);
}
bootstrap().then(() =>
  console.log('🚀 El Servidor Esta Corriendo en el puerto:4000 🚀'),
);
