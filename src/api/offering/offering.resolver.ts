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
import { OfferingService } from './offering.service';
import { BankService } from '../bank/bank.service';
import { Offering } from '../../models/offering.model';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { LoggerService } from '../../common/loggers/logger.service';
import {
  Response,
  ResponseData,
  ResponseArray,
} from '../../types/response.type';

@ObjectType()
class OfferingQueries {
  @Field(() => [Offering])
  getAll!: () => Promise<Offering[]>;

  @Field(() => [ResponseData])
  getSummaryAll!: (
    mes: number,
    anio: number,
    churchId?: number,
  ) => Promise<ResponseData[]>;
}

@ObjectType()
class OfferingMutations {
  @Field(() => Response)
  create!: (offering: any) => Promise<Response>;

  @Field(() => Response)
  update!: (offering: any) => Promise<Response>;

  @Field(() => Response)
  delete!: (id: number) => Promise<Response>;
}

@Resolver(() => OfferingQueries)
export class OfferingQueriesResolver {
  constructor(
    private offeringService: OfferingService,
    private bankService: BankService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => ResponseArray)
  async getAll(@Args() args: any) {
    this.logger.log('Offering - getAll - Start');
    try {
      const offerings = await this.offeringService.getAllOfferings(
        args.user,
        args.churchId,
        args.mes,
        args.anio,
      );
      this.logger.log('Offering - getAll - Success');
      return {
        code: 200,
        message: 'Offerings retrieved successfully',
        data: offerings,
      };
    } catch (error) {
      this.logger.error('Offering - getAll - Error');
      throw new Error('Error retrieving offerings');
    } finally {
      this.logger.log('Offering - getAll - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => [ResponseData])
  async getSummaryAll(
    @Args('mes') mes: number,
    @Args('anio') anio: number,
    @Args('churchId', { nullable: true }) churchId?: number,
  ): Promise<ResponseData> {
    this.logger.log('Offering - getSummaryAll - Start');
    try {
      let summary = await this.offeringService.getSummaryAll(
        mes,
        anio,
        churchId,
      );
      this.logger.log('Offering - getSummaryAll - Success');

      if (!Array.isArray(summary)) {
        console.error(
          'Expected summary to be an array but got',
          typeof summary,
        );
        summary = [];
      }

      const { data, code } = await this.bankService.getSummaryBank(mes, anio);
      this.logger.log('Offering - getSummaryBank - Success');

      const result = summary?.map((item: any) => ({
        churchId: item?.dataValues?.churchId,
        name: item?.dataValues?.name,
        total: item?.dataValues?.total,
        count: item?.dataValues?.count,
      }));

      if (code !== 404) {
        result.push({
          churchId: 1,
          name: 'Banco',
          total: data.total,
          count: data.count,
        });
      }

      return {
        code: 200,
        message: 'Summary retrieved successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Offering - getSummaryAll - Error');
      throw new Error('Error retrieving summary');
    } finally {
      this.logger.log('Offering - getSummaryAll - End');
    }
  }
}

@Resolver(() => OfferingMutations)
export class OfferingMutationsResolver {
  constructor(
    private offeringService: OfferingService,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async create(@Args('offering') offering: any) {
    this.logger.log('Offering - create - Start');
    try {
      const offeringData = await this.offeringService.createOffering(offering);
      this.logger.log('Offering - create - Success');
      return {
        code: 201,
        message: 'Offering created successfully',
        data: offeringData,
      };
    } catch (error) {
      this.logger.error('Offering - create - Error');
      throw new Error('Error creating offering');
    } finally {
      this.logger.log('Offering - create - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async update(
    @Args('offering') offering: any,
    @Args('id') id: number,
  ): Promise<Response> {
    this.logger.log('Offering - update - Start');
    try {
      const offeringData = await this.offeringService.updateOffering(
        offering,
        id,
      );
      this.logger.log('Offering - update - Success');
      return offeringData;
    } catch (error) {
      this.logger.error('Offering - update - Error');
      throw new Error('Error updating offering');
    } finally {
      this.logger.log('Offering - update - End');
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField(() => Response)
  async delete(@Args('id') id: number) {
    this.logger.log('Offering - delete - Start');
    try {
      const offeringData = await this.offeringService.deleteOffering(id);
      this.logger.log('Offering - delete - Success');
      return {
        code: 200,
        message: 'Offering deleted successfully',
        data: offeringData,
      };
    } catch (error) {
      this.logger.error('Offering - delete - Error');
      throw new Error('Error deleting offering');
    } finally {
      this.logger.log('Offering - delete - End');
    }
  }
}

@Resolver()
export class OfferingResolver {
  @Query(() => OfferingQueries, { name: 'Offering' })
  getOfferingQueries() {
    return {};
  }

  @Mutation(() => OfferingMutations, { name: 'Offering' })
  getOfferingMutations() {
    return {};
  }
}
