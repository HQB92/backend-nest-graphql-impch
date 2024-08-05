import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../models/user.model';

ObjectType();
class ResponseArray {
  @Field()
  code: number;

  @Field()
  message: string;

  @Field(() => [User], { nullable: true })
  data?: [] | null;
}

ObjectType();
class ResponseData {
  @Field()
  code: number;

  @Field()
  message: string;

  @Field(() => User, { nullable: true })
  data?: object | null;
}
ObjectType();
class Response {
  @Field()
  code: number;

  @Field()
  message: string;
}

export { ResponseArray, ResponseData, Response };
