import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../models/user.model';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseData, Response, ResponseArray } from '../types/response.type';
import { LoggerService } from '../common/loggers/logger.service';

@ObjectType()
class UserQueries {
  @Field(() => [User])
  getAll!: () => Promise<User[]>;

  @Field(() => User, { nullable: true })
  getById!: (id: number) => Promise<User | null>;
}

@ObjectType()
class UserMutations {
  @Field(() => Response)
  create!: (
    username: string,
    password: string,
    rut: string,
  ) => Promise<Response>;

  @Field(() => Response, { nullable: true })
  update!: (
    id: number,
    username: string,
    password: string,
    rut: string,
  ) => Promise<Response>;

  @Field(() => Response)
  delete!: (id: number) => Promise<Response>;
}

@Resolver(() => UserQueries)
export class UserQueriesResolver {
  constructor(
    private usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseArray)
  async getAll() {
    const data = await this.usersService.findAllUsers();
    this.logger.debug('User - findAll - Service - Response:', data);
    this.logger.log('User - findAll - Service - End');
    return data;
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseData)
  async getById(@Args('id') id: number): Promise<ResponseData> {
    return this.usersService.findUserById(id);
  }
}

@Resolver(() => UserMutations)
export class UserMutationsResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => User)
  async create(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('rut') rut: string,
    @Args('roles') roles: string[],
    @Args('email') email: string,
  ) {
    return this.usersService.createUser({
      username,
      password,
      rut,
      roles,
      email,
    });
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => User)
  async update(
    @Args('id') id: number,
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('rut') rut: string,
  ) {
    return this.usersService.updateUser({ id, username, password, rut });
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Boolean)
  async delete(@Args('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}

@Resolver()
export class UserResolver {
  @Query(() => UserQueries, { name: 'User' })
  getUserQueries() {
    return {};
  }

  @Mutation(() => UserMutations, { name: 'User' })
  getUserMutations() {
    return {};
  }
}
