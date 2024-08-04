import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../models/user.model';
import validarTokenContext from '../utils/ValidarTokenContext';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [User])
  async users(@Context() context) {
    const user = context.req.user;
    validarTokenContext(user);
    return this.usersService.findAllUsers();
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => User)
  async user(@Args('id') id: number, @Context() context) {
    // Puedes acceder al usuario autenticado a través del contexto
    const user = context.req.user;
    validarTokenContext(user);
    return this.usersService.findUserById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => User)
  async createUser(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('rut') rut: string,
    @Context() context,
  ) {
    const user = context.req.user;
    validarTokenContext(user);
    return this.usersService.createUser({ username, password, rut });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => User)
  async updateUser(
    @Args('id') id: number,
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('rut') rut: string,
    @Context() context,
  ) {
    const user = context.req.user;
    validarTokenContext(user);
    await this.usersService.updateUser({ id, username, password, rut });
    return this.usersService.findUserById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: number, @Context() context) {
    const user = context.req.user;
    validarTokenContext(user);
    await this.usersService.deleteUser(id);
    return true;
  }
}
