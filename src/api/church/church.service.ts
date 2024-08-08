import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Church } from '../../models/church.model';
import { CustomGraphQLError } from '../../common/errors/custom-error';
import { LoggerService } from '../../common/loggers/logger.service';

@Injectable()
export class ChurchService {
  constructor(
    @InjectModel(Church)
    private churchModel: typeof Church,
    private readonly logger: LoggerService,
  ) {}

  async getAllChurches() {
    this.logger.log('Church - getAll - Service - Start:');
    try {
      const churches = await this.churchModel.findAll();
      console.log(churches);
      return {
        code: 200,
        message: 'Churches retrieved successfully',
        data: churches,
      };
    } catch (error) {
      this.logger.error('Church - getAll - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async getChurchById(id: number) {
    this.logger.log('Church - getById - Service - Start:');
    const church = await this.churchModel.findByPk(id);
    if (!church) {
      this.logger.error('Church - getById - Service - Church not found');
      throw new CustomGraphQLError('Church not found', 404);
    }
    try {
      return {
        code: 200,
        message: 'Church retrieved successfully',
        data: church,
      };
    } catch (error) {
      this.logger.error('Church - getById - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async createChurch(churchData: any) {
    this.logger.log('Church - create - Service - Start:');
    const { name } = churchData;
    try {
      const existingChurch = await this.churchModel.findOne({
        where: { name },
      });
      if (existingChurch) {
        this.logger.error('Church - create - Service - Church already exists');
        throw new CustomGraphQLError('Church already exists', 400);
      }
      await this.churchModel.create(churchData);
      return {
        code: 200,
        message: 'Church created successfully',
      };
    } catch (error) {
      this.logger.error('Church - create - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async updateChurch(churchData: any) {
    this.logger.log('Church - update - Service - Start:');
    const { id } = churchData;
    try {
      await this.churchModel.update(churchData, { where: { id } });
      return {
        code: 200,
        message: 'Church updated successfully',
      };
    } catch (error) {
      this.logger.error('Church - update - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async deleteChurch(id: number) {
    this.logger.log('Church - delete - Service - Start:');
    try {
      const result = await this.churchModel.destroy({ where: { id } });
      if (result === 0) {
        this.logger.error('Church - delete - Service - Church not found');
        throw new CustomGraphQLError('Church not found', 404);
      }
      return {
        code: 200,
        message: 'Church deleted successfully',
      };
    } catch (error) {
      this.logger.error('Church - delete - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }
}
