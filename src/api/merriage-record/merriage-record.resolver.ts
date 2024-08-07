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
import { MerriageRecordService } from './merriage-record.service';
import { MerriageRecord } from '../../models/merriageRecord.model';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { LoggerService } from '../../common/loggers/logger.service';
import { Response, ResponseArray } from '../../types/response.type';

@ObjectType()
class MerriageRecordQueries {
  @Field(() => [MerriageRecord])
  getAll!: () => Promise<MerriageRecord[]>;

  @Field(() => Number)
  count!: () => Promise<number>;
}

@ObjectType()
class MerriageRecordMutations {
  @Field(() => Response)
  create!: (merriageRecord: any) => Promise<Response>;

  // Uncomment these fields if update and delete methods are implemented
  // @Field(() => Response)
  // update!: (merriageRecord: any) => Promise<Response>;

  // @Field(() => Response)
  // delete!: (id: number) => Promise<Response>;
}

@Resolver(() => MerriageRecordQueries)
export class MerriageRecordQueriesResolver {
  constructor(
    private merriageRecordService: MerriageRecordService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseArray)
  async getAll() {
    this.logger.log('MerriageRecord - getAll - Start');
    try {
      const merriageRecords =
        await this.merriageRecordService.getAllMerriageRecords();
      this.logger.log('MerriageRecord - getAll - Success');
      return {
        code: 200,
        message: 'Merriage records retrieved successfully',
        data: merriageRecords,
      };
    } catch (error) {
      this.logger.error('MerriageRecord - getAll - Error');
      throw new Error('Error retrieving merriage records');
    } finally {
      this.logger.log('MerriageRecord - getAll - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Number)
  async count() {
    this.logger.log('MerriageRecord - count - Start');
    try {
      const countMerriageRecords = await this.merriageRecordService.count();
      this.logger.log('MerriageRecord - count - Success');
      return countMerriageRecords;
    } catch (error) {
      this.logger.error('MerriageRecord - count - Error');
      throw new Error('Error counting merriage records');
    } finally {
      this.logger.log('MerriageRecord - count - End');
    }
  }
}

@Resolver(() => MerriageRecordMutations)
export class MerriageRecordMutationsResolver {
  constructor(
    private merriageRecordService: MerriageRecordService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async create(@Args('merriageRecord') merriageRecord: any) {
    this.logger.log('MerriageRecord - create - Start');
    try {
      const response =
        await this.merriageRecordService.createMerriageRecord(merriageRecord);
      this.logger.log('MerriageRecord - create - Success');
      return {
        code: 201,
        message: 'MerriageRecord created successfully',
        data: response,
      };
    } catch (error) {
      this.logger.error('MerriageRecord - create - Error');
      throw new Error('Error creating merriage record');
    } finally {
      this.logger.log('MerriageRecord - create - End');
    }
  }

  // Uncomment these methods if update and delete methods are implemented
  // @UseGuards(GqlAuthGuard)
  // @ResolveField(() => Response)
  // async update(@Args('merriageRecord') merriageRecord: any) {
  //   this.logger.log('MerriageRecord - update - Start');
  //   try {
  //     const response = await this.merriageRecordService.updateMerriageRecord(merriageRecord);
  //     this.logger.log('MerriageRecord - update - Success');
  //     return response;
  //   } catch (error) {
  //     this.logger.error('MerriageRecord - update - Error');
  //     throw new Error('Error updating merriage record');
  //   } finally {
  //     this.logger.log('MerriageRecord - update - End');
  //   }
  // }

  // @UseGuards(GqlAuthGuard)
  // @ResolveField(() => Response)
  // async delete(@Args('id') id: number) {
  //   this.logger.log('MerriageRecord - delete - Start');
  //   try {
  //     const response = await this.merriageRecordService.deleteMerriageRecord(id);
  //     this.logger.log('MerriageRecord - delete - Success');
  //     return response;
  //   } catch (error) {
  //     this.logger.error('MerriageRecord - delete - Error');
  //     throw new Error('Error deleting merriage record');
  //   } finally {
  //     this.logger.log('MerriageRecord - delete - End');
  //   }
  // }
}

@Resolver()
export class MerriageRecordResolver {
  @Query(() => MerriageRecordQueries, { name: 'MerriageRecord' })
  getMerriageRecordQueries() {
    return {};
  }

  @Mutation(() => MerriageRecordMutations, { name: 'MerriageRecord' })
  getMerriageRecordMutations() {
    return {};
  }
}
