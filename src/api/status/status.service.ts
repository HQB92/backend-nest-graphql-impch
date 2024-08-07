import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Status } from '../../models/status.model';
import { CustomGraphQLError } from '../../common/errors/custom-error';
import { LoggerService } from '../../common/loggers/logger.service';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Status)
    private statusModel: typeof Status,
    private readonly logger: LoggerService,
  ) {}

  async getAllStatuses() {
    this.logger.log('Status - getAll - Service - Start:');
    try {
      const statuses = await this.statusModel.findAll();
      return {
        code: 200,
        message: 'Statuses retrieved successfully',
        data: statuses,
      };
    } catch (error) {
      this.logger.error('Status - getAll - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async getStatusById(id: number) {
    this.logger.log('Status - getById - Service - Start:');
    try {
      const status = await this.statusModel.findByPk(id);
      if (!status) {
        this.logger.error('Status - getById - Service - Status not found');
        throw new CustomGraphQLError('Status not found', 404);
      }
      return {
        code: 200,
        message: 'Status retrieved successfully',
        data: status,
      };
    } catch (error) {
      this.logger.error('Status - getById - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async createStatus(statusData: any) {
    this.logger.log('Status - create - Service - Start:');
    const { name } = statusData;
    const existingStatus = await this.statusModel.findOne({
      where: { name },
    });
    if (existingStatus) {
      this.logger.error('Status - create - Service - Status already exists');
      throw new CustomGraphQLError('Status already exists', 400);
    }
    try {
      await this.statusModel.create(statusData);
      return {
        code: 200,
        message: 'Status created successfully',
      };
    } catch (error) {
      this.logger.error('Status - create - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async updateStatus(statusData: any) {
    this.logger.log('Status - update - Service - Start:');
    const { id } = statusData;
    try {
      await this.statusModel.update(statusData, { where: { id } });
      return {
        code: 200,
        message: 'Status updated successfully',
      };
    } catch (error) {
      this.logger.error('Status - update - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async deleteStatus(id: number) {
    this.logger.log('Status - delete - Service - Start:');
    try {
      const result = await this.statusModel.destroy({ where: { id } });
      if (result === 0) {
        this.logger.error('Status - delete - Service - Status not found');
        throw new CustomGraphQLError('Status not found', 404);
      }
      return {
        code: 200,
        message: 'Status deleted successfully',
      };
    } catch (error) {
      this.logger.error('Status - delete - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }
}
