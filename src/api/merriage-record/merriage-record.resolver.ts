import { Args, Field, Mutation, ObjectType, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MerriageRecordService } from './merriage-record.service';
import { MerriageRecord } from '../../models/merriageRecord.model';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { LoggerService } from '../../common/loggers/logger.service';
import { Response, ResponseArray } from '../../types/response.type';

@ObjectType()
class MerriageRecordQuery {
  @Field(() => [MerriageRecord])
  getAll!: () => Promise<MerriageRecord[]>;

  @Field(() => Number)
  count!: () => Promise<number>;
}

@ObjectType()
class MerriageRecordMutation {
  @Field(() => Response)
  create!: (merriageRecord: any) => Promise<Response>;

  // Uncomment these fields if update and delete methods are implemented
  // @Field(() => Response)
  // update!: (merriageRecord: any) => Promise<Response>;

  // @Field(() => Response)
  // delete!: (id: number) => Promise<Response>;
}

@Resolver(() => MerriageRecordQuery)
export class MerriageRecordQueriesResolver {
  constructor(
    private merriageRecordService: MerriageRecordService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseArray)
  async getAll() {
    return await this.merriageRecordService.getAllMerriageRecords();
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
      console.log('error', error);
      this.logger.error('MerriageRecord - count - Error');
      throw new Error('Error counting merriage records');
    } finally {
      this.logger.log('MerriageRecord - count - End');
    }
  }
}

@Resolver(() => MerriageRecordMutation)
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
  @Query(() => MerriageRecordQuery, { name: 'MerriageRecord' })
  getMerriageRecordQueries() {
    return {};
  }

  @Mutation(() => MerriageRecordMutation, { name: 'MerriageRecord' })
  getMerriageRecordMutations() {
    return {};
  }
}
