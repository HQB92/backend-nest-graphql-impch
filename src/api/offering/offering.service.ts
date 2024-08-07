import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Offering } from '../../models/offering.model';
import { Church } from '../../models/church.model';
import { Op, fn, col, literal } from 'sequelize';
import { CustomGraphQLError } from '../../common/errors/custom-error';
import { LoggerService } from '../../common/loggers/logger.service';
import { BankService } from '../bank/bank.service';

@Injectable()
export class OfferingService {
  constructor(
    @InjectModel(Offering)
    private offeringModel: typeof Offering,
    @InjectModel(Church)
    private churchModel: typeof Church,
    private readonly logger: LoggerService,
    @Inject(forwardRef(() => BankService))
    private bankService: BankService,
  ) {}

  async createOffering(offeringData: any) {
    this.logger.log('Offering - create - Service - Start:');
    try {
      const newOffering = await this.offeringModel.create(offeringData);
      if (newOffering) {
        return {
          code: 201,
          message: 'Offering registered successfully',
        };
      } else {
        this.logger.error(
          'Offering - create - Service - Error registering offering',
        );
        throw new CustomGraphQLError('Error registering offering', 400);
      }
    } catch (e) {
      this.logger.error('Offering - create - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async getSummaryAll(month: number, year: number, churchId?: number) {
    this.logger.log('Offering - getSummaryAll - Service - Start:');
    let filterChurch = {};
    if (!month || !year) {
      this.logger.error(
        'Offering - getSummaryAll - Service - Month and year are required',
      );
      throw new CustomGraphQLError('Month and year are required', 400);
    }
    let monthString: string;
    try {
      if (month < 10) {
        monthString = `0${month}`;
      }
      if (churchId) {
        filterChurch = { churchId };
      }

      const results = await this.offeringModel.findAll({
        attributes: [
          'churchId',
          [fn('sum', col('amount')), 'total'],
          [fn('count', col('amount')), 'count'],
          [literal(`"church"."name"`), 'name'],
        ],
        include: [
          {
            model: this.churchModel,
            as: 'church',
            attributes: ['name'],
            required: true,
          },
        ],
        where: {
          [Op.and]: [
            literal(`EXTRACT(MONTH FROM "date") = ${monthString}`),
            literal(`EXTRACT(YEAR FROM "date") = ${year}`),
            filterChurch,
          ],
        },
        group: ['churchId', 'church.id'],
      });

      if (!results.length) {
        this.logger.error(
          'Offering - getSummaryAll - Service - No results found',
        );
        throw new CustomGraphQLError(
          'No results found for the specified month and year',
          404,
        );
      }
      return results;
    } catch (e) {
      this.logger.error(
        'Offering - getSummaryAll - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async updateOffering(offeringData: any, id: number) {
    this.logger.log('Offering - update - Service - Start:');
    try {
      const offeringToUpdate = await this.offeringModel.findByPk(id);
      if (!offeringToUpdate) {
        this.logger.error('Offering - update - Service - Offering not found');
        throw new CustomGraphQLError('Offering not found', 404);
      }
      await this.offeringModel.update(offeringData, { where: { id } });
      return {
        code: 200,
        message: 'Offering updated successfully',
      };
    } catch (e) {
      this.logger.error('Offering - update - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async deleteOffering(id: number) {
    this.logger.log('Offering - delete - Service - Start:');
    try {
      const offeringToDelete = await this.offeringModel.findByPk(id);
      if (!offeringToDelete) {
        this.logger.error('Offering - delete - Service - Offering not found');
        throw new CustomGraphQLError('Offering not found', 404);
      }
      await this.offeringModel.destroy({ where: { id } });
      return {
        code: 200,
        message: 'Offering deleted successfully',
      };
    } catch (e) {
      this.logger.error('Offering - delete - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async getAllOfferings(
    user?: number,
    church?: number,
    month?: number,
    year?: number,
  ) {
    this.logger.log('Offering - getAll - Service - Start:');
    let filterUser = {};
    let filterChurch = {};
    if (user && user !== 0) {
      filterUser = { userId: user };
    }

    if (church && church !== 0) {
      filterChurch = { churchId: church };
    }
    let monthString: string;
    if (month && month < 10) {
      monthString = `0${month}`;
    }

    try {
      const offerings = await this.offeringModel.findAll({
        where: {
          [Op.and]: [
            filterUser,
            filterChurch,
            literal(`EXTRACT(MONTH FROM "date") = ${monthString}`),
            literal(`EXTRACT(YEAR FROM "date") = ${year}`),
          ],
        },
        order: [['id', 'ASC']],
      });
      return {
        code: 200,
        message: 'Offerings retrieved successfully',
        data: offerings,
      };
    } catch (e) {
      this.logger.error('Offering - getAll - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }
}
