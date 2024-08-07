import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../models/user.model';
import { Member } from '../models/member.model';


ObjectType();
class ResponseArray {
  @Field()
  code: number;

  @Field()
  message: string;

  @Field(() => [Object], { nullable: true })
  data?: User[] | null | Member[];
}

ObjectType();
class ResponseData {
  @Field()
  code: number;

  @Field()
  message: string;

  @Field(() => Object, { nullable: true })
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
