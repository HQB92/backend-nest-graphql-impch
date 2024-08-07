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
import { MemberService } from './member.service';
import { Member } from '../../models/member.model';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { LoggerService } from '../../common/loggers/logger.service';
import {
  Response,
  ResponseData,
  ResponseArray,
} from '../../types/response.type';

@ObjectType()
class MemberQueries {
  @Field(() => [Member])
  getAll!: () => Promise<Member[]>;

  @Field(() => Member, { nullable: true })
  getByRut!: (rut: string) => Promise<Member | null>;

  @Field(() => Number)
  count!: () => Promise<number>;
}

@ObjectType()
class MemberMutations {
  @Field(() => Response)
  create!: (member: any) => Promise<Response>;

  @Field(() => Response)
  update!: (member: any) => Promise<Response>;

  @Field(() => Response)
  delete!: (id: number) => Promise<Response>;
}

@Resolver(() => MemberQueries)
export class MemberQueriesResolver {
  constructor(
    private memberService: MemberService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseArray)
  async getAll(@Args() args: any) {
    this.logger.log('Member - getAll - Start');
    try {
      const members = await this.memberService.getAllMembers(args);
      this.logger.log('Member - getAll - Success');
      return {
        code: 200,
        message: 'Members retrieved successfully',
        data: members,
      };
    } catch (error) {
      this.logger.error('Member - getAll - Error');
      throw new Error('Error retrieving members');
    } finally {
      this.logger.log('Member - getAll - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseData)
  async getByRut(@Args('rut') rut: string): Promise<ResponseData> {
    this.logger.log('Member - getByRut - Start');
    try {
      const member = await this.memberService.getMemberByRut(rut);
      this.logger.log('Member - getByRut - Success');
      return {
        code: 200,
        message: 'Member retrieved successfully',
        data: member,
      };
    } catch (error) {
      this.logger.error('Member - getByRut - Error');
      throw new Error('Error retrieving member');
    } finally {
      this.logger.log('Member - getByRut - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseData)
  async count(): Promise<ResponseData> {
    this.logger.log('Member - count - Start');
    try {
      const count = await this.memberService.countMembers();
      this.logger.log('Member - count - Success');
      return {
        code: 200,
        message: 'Members counted successfully',
        data: count,
      };
    } catch (error) {
      this.logger.error('Member - count - Error');
      throw new Error('Error counting members');
    } finally {
      this.logger.log('Member - count - End');
    }
  }
}

@Resolver(() => MemberMutations)
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
  @Query(() => MemberQueries, { name: 'Member' })
  getMemberQueries() {
    return {};
  }

  @Mutation(() => MemberMutations, { name: 'Member' })
  getMemberMutations() {
    return {};
  }
}
