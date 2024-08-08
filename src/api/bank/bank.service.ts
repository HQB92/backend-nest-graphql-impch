import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bank } from '../../models/bank.model';
import { Sequelize } from 'sequelize-typescript';
import { LoggerService } from '../../common/loggers/logger.service';
import { CustomGraphQLError } from '../../common/errors/custom-error';
import { fn, col, Op, literal } from 'sequelize';
import { OfferingService } from '../offering/offering.service';

@Injectable()
export class BankService {
  constructor(
    @InjectModel(Bank)
    private bankModel: typeof Bank,
    private sequelize: Sequelize,
    private readonly logger: LoggerService,
    @Inject(forwardRef(() => OfferingService))
    private offeringService: OfferingService,
  ) {}

  async getSummaryBank(month: number, year: number) {
    console.log('month', month);
    console.log('year', year);
    this.logger.log('Bank - getSummaryBank - Service - Start:');
    this.logger.info('Bank - getSummaryBank - Service', { month, year });
    if (!month || !year) {
      this.logger.error(
        'Bank - getSummaryBank - Service - Month and year are required',
      );
      throw new CustomGraphQLError('Month and year are required',
        400);
    }

    try {
      const results: any = await this.bankModel.findAll({
        attributes: [
          'churchId',
          [fn('sum', col('amount')), 'total'],
          [fn('count', col('amount')), 'count'],
        ],
        where: {
          [Op.and]: [
            literal(
              `EXTRACT(MONTH FROM "date") = ${month < 10 ? `0${month}` : month}`,
            ),
            literal(`EXTRACT(YEAR FROM "date") = ${year}`),
          ],
        },
        group: ['churchId'],
      });

      if (!results.length) {
        return {
          code: 404,
          message: 'No data found',
        };
      }
      return {
        code: 200,
        message: 'Summary retrieved successfully',
        data: results,
      };
    } catch (error) {
      this.logger.error(
        'Bank - getSummaryBank - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }
}
