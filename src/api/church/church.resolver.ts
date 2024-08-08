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
import { ChurchService } from './church.service';
import { Church } from '../../models/church.model';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { LoggerService } from '../../common/loggers/logger.service';
import {
  Response,
  ResponseData,
  ResponseArray,
} from '../../types/response.type';

@ObjectType()
class ChurchQuery {
  @Field(() => [Church])
  getAll!: () => Promise<Church[]>;

  @Field(() => Church, { nullable: true })
  getById!: (id: number) => Promise<Church | null>;
}

@ObjectType()
class ChurchMutation {
  @Field(() => Response)
  create!: (church: any) => Promise<Response>;

  @Field(() => Response)
  update!: (church: any) => Promise<Response>;

  @Field(() => Response)
  delete!: (id: number) => Promise<Response>;
}

@Resolver(() => ChurchQuery)
export class ChurchQueriesResolver {
  constructor(
    private churchService: ChurchService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseArray)
  async getAll() {
    return await this.churchService.getAllChurches();
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseData)
  async getById(@Args('id') id: number): Promise<object> {
    return await this.churchService.getChurchById(id);
  }
}

@Resolver(() => ChurchMutation)
export class ChurchMutationsResolver {
  constructor(
    private churchService: ChurchService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async create(@Args('church') church: any) {
    this.logger.log('Church - create - Start');
    try {
      const response = await this.churchService.createChurch(church);
      this.logger.log('Church - create - Success');
      return response;
    } catch (error) {
      this.logger.error('Church - create - Error');
      throw new Error('Error creating church');
    } finally {
      this.logger.log('Church - create - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async update(@Args('church') church: any) {
    this.logger.log('Church - update - Start');
    try {
      const response = await this.churchService.updateChurch(church);
      this.logger.log('Church - update - Success');
      return response;
    } catch (error) {
      this.logger.error('Church - update - Error');
      throw new Error('Error updating church');
    } finally {
      this.logger.log('Church - update - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async delete(@Args('id') id: number) {
    this.logger.log('Church - delete - Start');
    try {
      const response = await this.churchService.deleteChurch(id);
      this.logger.log('Church - delete - Success');
      return response;
    } catch (error) {
      this.logger.error('Church - delete - Error');
      throw new Error('Error deleting church');
    } finally {
      this.logger.log('Church - delete - End');
    }
  }
}

@Resolver()
export class ChurchResolver {
  @Query(() => ChurchQuery, { name: 'Church' })
  getChurchQueries() {
    return {};
  }

  @Mutation(() => ChurchMutation, { name: 'Church' })
  getChurchMutations() {
    return {};
  }
}
