import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MerriageRecord } from '../../models/merriageRecord.model';
import { CustomGraphQLError } from '../../common/errors/custom-error';
import { LoggerService } from '../../common/loggers/logger.service';

@Injectable()
export class MerriageRecordService {
  constructor(
    @InjectModel(MerriageRecord)
    private merriageRecordModel: typeof MerriageRecord,
    private readonly logger: LoggerService,
  ) {}

  async getAllMerriageRecords() {
    this.logger.log('MerriageRecord - getAll - Service - Start:');
    try {
      const records = await this.merriageRecordModel.findAll();
      return {
        code: 200,
        message: 'Merriage records retrieved successfully',
        data: records,
      };
    } catch (error) {
      console.log('error', error);
      this.logger.error(
        'MerriageRecord - getAll - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async count() {
    this.logger.log('MerriageRecord - count - Service - Start:');
    try {
      const count = await this.merriageRecordModel.count();
      return {
        code: 200,
        message: 'Merriage record count retrieved successfully',
        data: count,
      };
    } catch (error) {
      this.logger.error(
        'MerriageRecord - count - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async createMerriageRecord(merriageRecordData: any) {
    this.logger.log('MerriageRecord - create - Service - Start:');
    try {
      const record = await this.merriageRecordModel.create(merriageRecordData);
      return {
        code: 200,
        message: 'Merriage record created successfully',
        data: record,
      };
    } catch (error) {
      this.logger.error(
        'MerriageRecord - create - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }
}
