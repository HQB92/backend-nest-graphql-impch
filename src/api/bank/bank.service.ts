import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bank } from '../../models/bank.model';
import { Sequelize } from 'sequelize-typescript';
import { LoggerService } from '../../common/loggers/logger.service';
import { CustomGraphQLError } from '../../common/errors/custom-error';
import { fn, col, Op, literal } from 'sequelize';

@Injectable()
export class BankService {
  constructor(
    @InjectModel(Bank)
    private bankModel: typeof Bank,
    private sequelize: Sequelize,
    private readonly logger: LoggerService,
  ) {}

  async getSummaryBank(month: number, year: number) {
    this.logger.log('Bank - getSummaryBank - Service - Start:');
    this.logger.info('Bank - getSummaryBank - Service', { month, year });
    try {
      const results = await this.bankModel.findAll({
        attributes: [
          'churchId',
          [fn('sum', col('amount')), 'total'],
          [fn('count', col('amount')), 'count'],
        ],
        where: {
          [Op.and]: [
            literal(`EXTRACT(MONTH FROM "date") = ${month}`),
            literal(`EXTRACT(YEAR FROM "date") = ${year}`),
          ],
        },
        group: ['churchId'],
      });

      if (!results.length) {
        this.logger.error('Bank - getSummaryBank - Service - No results found');
        throw new CustomGraphQLError('No results found', 404);
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
