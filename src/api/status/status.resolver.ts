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
import { StatusService } from './status.service';
import { Status } from '../../models/status.model';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { LoggerService } from '../../common/loggers/logger.service';
import {
  Response,
  ResponseData,
  ResponseArray,
} from '../../types/response.type';

@ObjectType()
class StatusQuery {
  @Field(() => [Status])
  getAll!: () => Promise<Status[]>;

  @Field(() => Status, { nullable: true })
  getById!: (id: number) => Promise<Status | null>;
}

@ObjectType()
class StatusMutation {
  @Field(() => Response)
  create!: (status: any) => Promise<Response>;

  @Field(() => Response)
  update!: (status: any) => Promise<Response>;

  @Field(() => Response)
  delete!: (id: number) => Promise<Response>;
}

@Resolver(() => StatusQuery)
export class StatusQueriesResolver {
  constructor(
    private statusService: StatusService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseArray)
  async getAll() {
    this.logger.log('Status - getAll - Start');
    try {
      const statuses = await this.statusService.getAllStatuses();
      this.logger.log('Status - getAll - Success');
      return {
        code: 200,
        message: 'Statuses retrieved successfully',
        data: statuses,
      };
    } catch (error) {
      this.logger.error('Status - getAll - Error');
      throw new Error('Error retrieving statuses');
    } finally {
      this.logger.log('Status - getAll - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseData)
  async getById(@Args('id') id: number): Promise<ResponseData> {
    this.logger.log('Status - getById - Start');
    try {
      const status = await this.statusService.getStatusById(id);
      this.logger.log('Status - getById - Success');
      return {
        code: 200,
        message: 'Status retrieved successfully',
        data: status,
      };
    } catch (error) {
      this.logger.error('Status - getById - Error');
      throw new Error('Error retrieving status');
    } finally {
      this.logger.log('Status - getById - End');
    }
  }
}

@Resolver(() => StatusMutation)
export class StatusMutationsResolver {
  constructor(
    private statusService: StatusService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async create(@Args('status') status: any) {
    this.logger.log('Status - create - Start');
    try {
      const response = await this.statusService.createStatus(status);
      this.logger.log('Status - create - Success');
      return {
        code: 200,
        message: 'Status created successfully',
        data: response,
      };
    } catch (error) {
      this.logger.error('Status - create - Error');
      throw new Error('Error creating status');
    } finally {
      this.logger.log('Status - create - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async update(@Args('status') status: any) {
    this.logger.log('Status - update - Start');
    try {
      const response = await this.statusService.updateStatus(status);
      this.logger.log('Status - update - Success');
      return {
        code: 200,
        message: 'Status updated successfully',
        data: response,
      };
    } catch (error) {
      this.logger.error('Status - update - Error');
      throw new Error('Error updating status');
    } finally {
      this.logger.log('Status - update - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async delete(@Args('id') id: number) {
    this.logger.log('Status - delete - Start');
    try {
      const response = await this.statusService.deleteStatus(id);
      this.logger.log('Status - delete - Success');
      return {
        code: 200,
        message: 'Status deleted successfully',
        data: response,
      };
    } catch (error) {
      this.logger.error('Status - delete - Error');
      throw new Error('Error deleting status');
    } finally {
      this.logger.log('Status - delete - End');
    }
  }
}

@Resolver()
export class StatusResolver {
  @Query(() => StatusQuery, { name: 'Status' })
  getStatusQueries() {
    return {};
  }

  @Mutation(() => StatusMutation, { name: 'Status' })
  getStatusMutations() {
    return {};
  }
}
