import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { CustomGraphQLError } from '../errors/custom-error';

@Catch(CustomGraphQLError)
export class GqlCustomExceptionFilter implements GqlExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: CustomGraphQLError, host: ArgumentsHost) {
    return new ApolloError(exception.message, exception.code.toString());
  }
}
