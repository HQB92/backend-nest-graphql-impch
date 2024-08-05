import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Catch(HttpException, Error)
export class GqlHttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: unknown =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message;

    if (typeof message === 'object' && 'message' in message) {
      message = message['message'];
    }

    const data = {
      code: status,
      message: message,
    };

    const ctx = gqlHost.getContext();
    const operation = ctx.req.body.operationName;

    if (operation.includes('Query')) {
      return new ApolloError(
        JSON.stringify({ ...data, data: null }),
        status.toString(),
      );
    } else {
      return new ApolloError(JSON.stringify(data), status.toString());
    }
  }
}
