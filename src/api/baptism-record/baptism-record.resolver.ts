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
import { BaptismRecordService } from './baptism-record.service';
import { BaptismRecord } from '../../models/baptismRecord.model';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { LoggerService } from '../../common/loggers/logger.service';
import {
  Response,
  ResponseArray,
  ResponseData,
} from '../../types/response.type';

@ObjectType()
class BaptismRecordQueries {
  @Field(() => [BaptismRecord])
  getAll!: () => Promise<BaptismRecord[]>;

  @Field(() => BaptismRecord, { nullable: true })
  getById!: (id: number) => Promise<BaptismRecord | null>;
}

@ObjectType()
class BaptismRecordMutations {
  @Field(() => Response)
  create!: (baptismRecord: any) => Promise<Response>;

  @Field(() => Response)
  update!: (baptismRecord: any) => Promise<Response>;

  @Field(() => Response)
  delete!: (id: number) => Promise<Response>;
}

@Resolver(() => BaptismRecordQueries)
export class BaptismRecordQueriesResolver {
  constructor(
    private baptismRecordService: BaptismRecordService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseArray)
  async getAll() {
    this.logger.log('BaptismRecord - getAll - Start');
    try {
      const baptismRecords =
        await this.baptismRecordService.getAllBaptismRecords();
      this.logger.log('BaptismRecord - getAll - Success');
      return {
        code: 200,
        message: 'Baptism records retrieved successfully',
        data: baptismRecords,
      };
    } catch (error) {
      this.logger.error('BaptismRecord - getAll - Error');
      throw new Error('Error retrieving baptism records');
    } finally {
      this.logger.log('BaptismRecord - getAll - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseData)
  async getById(@Args('id') id: number): Promise<ResponseData> {
    this.logger.log('BaptismRecord - getById - Start');
    try {
      const baptismRecord =
        await this.baptismRecordService.getBaptismRecordById(id);
      this.logger.log('BaptismRecord - getById - Success');
      return {
        code: 200,
        message: 'Baptism record retrieved successfully',
        data: baptismRecord,
      };
    } catch (error) {
      this.logger.error('BaptismRecord - getById - Error');
      throw new Error('Error retrieving baptism record');
    } finally {
      this.logger.log('BaptismRecord - getById - End');
    }
  }
}

@Resolver(() => BaptismRecordMutations)
export class BaptismRecordMutationsResolver {
  constructor(
    private baptismRecordService: BaptismRecordService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async create(@Args('baptismRecord') baptismRecord: any) {
    this.logger.log('BaptismRecord - create - Start');
    try {
      const response =
        await this.baptismRecordService.createBaptismRecord(baptismRecord);
      this.logger.log('BaptismRecord - create - Success');
      return response;
    } catch (error) {
      this.logger.error('BaptismRecord - create - Error');
      throw new Error('Error creating baptism record');
    } finally {
      this.logger.log('BaptismRecord - create - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async update(@Args('baptismRecord') baptismRecord: any) {
    this.logger.log('BaptismRecord - update - Start');
    try {
      const response =
        await this.baptismRecordService.updateBaptismRecord(baptismRecord);
      this.logger.log('BaptismRecord - update - Success');
      return response;
    } catch (error) {
      this.logger.error('BaptismRecord - update - Error');
      throw new Error('Error updating baptism record');
    } finally {
      this.logger.log('BaptismRecord - update - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async delete(@Args('id') id: number) {
    this.logger.log('BaptismRecord - delete - Start');
    try {
      const response = await this.baptismRecordService.deleteBaptismRecord(id);
      this.logger.log('BaptismRecord - delete - Success');
      return response;
    } catch (error) {
      this.logger.error('BaptismRecord - delete - Error');
      throw new Error('Error deleting baptism record');
    } finally {
      this.logger.log('BaptismRecord - delete - End');
    }
  }
}

@Resolver()
export class BaptismRecordResolver {
  @Query(() => BaptismRecordQueries, { name: 'BaptismRecord' })
  getBaptismRecordQueries() {
    return {};
  }

  @Mutation(() => BaptismRecordMutations, { name: 'BaptismRecord' })
  getBaptismRecordMutations() {
    return {};
  }
}
