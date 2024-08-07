import {
  Args,
  Field,
  Mutation,
  ObjectType,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from '../../models/member.model';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { LoggerService } from '../../common/loggers/logger.service';
import {
  Response,
  ResponseArray,
  ResponseData,
} from '../../types/response.type';

@ObjectType()
class MemberQuery {
  @Field(() => [Member])
  getAll!: () => Promise<Member[]>;

  @Field(() => Member, { nullable: true })
  getByRut!: (rut: string) => Promise<Member | null>;

  @Field(() => Number)
  count!: () => Promise<number>;
}

@ObjectType()
class MemberMutation {
  @Field(() => Response)
  create!: (member: any) => Promise<Response>;

  @Field(() => Response)
  update!: (member: any) => Promise<Response>;

  @Field(() => Response)
  delete!: (id: number) => Promise<Response>;
}

@Resolver(() => MemberQuery)
export class MemberQueriesResolver {
  constructor(
    private memberService: MemberService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseArray)
  async getAll(@Args() args: any): Promise<ResponseArray> {
    return await this.memberService.getAllMembers(args);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseData)
  async getByRut(@Args('rut') rut: string): Promise<ResponseData> {
    return await this.memberService.getMemberByRut(rut);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseData)
  async count(): Promise<ResponseData> {
    this.logger.log('Member - count - Start');
    return await this.memberService.countMembers();
  }
}

@Resolver(() => MemberMutation)
export class MemberMutationsResolver {
  constructor(
    private memberService: MemberService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async create(@Args('member') member: any) {
    this.logger.log('Member - create - Start');
    try {
      const response = await this.memberService.createMember(member);
      this.logger.log('Member - create - Success');
      return response;
    } catch (error) {
      this.logger.error('Member - create - Error');
      throw new Error('Error creating member');
    } finally {
      this.logger.log('Member - create - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async update(@Args('member') member: any) {
    this.logger.log('Member - update - Start');
    try {
      const response = await this.memberService.updateMember(member);
      this.logger.log('Member - update - Success');
      return response;
    } catch (error) {
      this.logger.error('Member - update - Error');
      throw new Error('Error updating member');
    } finally {
      this.logger.log('Member - update - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async delete(@Args('rut') rut: string) {
    this.logger.log('Member - delete - Start');
    try {
      const response = await this.memberService.deleteMember(rut);
      this.logger.log('Member - delete - Success');
      return response;
    } catch (error) {
      this.logger.error('Member - delete - Error');
      throw new Error('Error deleting member');
    } finally {
      this.logger.log('Member - delete - End');
    }
  }
}

@Resolver()
export class MemberResolver {
  @Query(() => MemberQuery, { name: 'Member' })
  getMemberQueries() {
    return {};
  }

  @Mutation(() => MemberMutation, { name: 'Member' })
  getMemberMutations() {
    return {};
  }
}
