import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ObjectType,
  Field,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../models/user.model';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';

@ObjectType()
class UserQueries {
  @Field(() => [User])
  getAllUsers!: () => Promise<User[]>;

  @Field(() => User, { nullable: true })
  getUserById!: (id: number) => Promise<User | null>;
}

@ObjectType()
class UserMutations {
  @Field(() => User)
  createUser!: (username: string, password: string, rut: string) => Promise<User>;

  @Field(() => User, { nullable: true })
  updateUser!: (id: number, username: string, password: string, rut: string) => Promise<User | null>;

  @Field(() => Boolean)
  deleteUser!: (id: number) => Promise<boolean>;
}

@Resolver(() => UserQueries)
export class UserQueriesResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => [User])
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => User)
  async getUserById(@Args('id') id: number) {
    return this.usersService.findUserById(id);
  }
}

@Resolver(() => UserMutations)
export class UserMutationsResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => User)
  async createUser(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('rut') rut: string,
  ) {
    return this.usersService.createUser({ username, password, rut });
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => User)
  async updateUser(
    @Args('id') id: number,
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('rut') rut: string,
  ) {
    return this.usersService.updateUser({ id, username, password, rut });
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Boolean)
  async deleteUser(@Args('id') id: number) {
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
