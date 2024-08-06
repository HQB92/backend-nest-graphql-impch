import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaptismRecord } from '../../models/baptismRecord.model';
import { CustomGraphQLError } from '../../common/errors/custom-error';
import { LoggerService } from '../../common/loggers/logger.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class BaptismRecordService {
  constructor(
    @InjectModel(BaptismRecord)
    private baptismRecordModel: typeof BaptismRecord,
    private sequelize: Sequelize,
    private readonly logger: LoggerService,
  ) {}

  async getAllBaptismRecords() {
    this.logger.log('BaptismRecord - getAll - Service - Start:');
    try {
      const records = await this.baptismRecordModel.findAll({
        order: [['baptismDate', 'DESC']],
      });
      return {
        code: 200,
        message: 'Baptism records retrieved successfully',
        data: records,
      };
    } catch (error) {
      this.logger.error(
        'BaptismRecord - getAll - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async getBaptismRecordById(id: number) {
    this.logger.log('BaptismRecord - getById - Service - Start:');
    try {
      const record = await this.baptismRecordModel.findByPk(id);
      if (!record) {
        this.logger.error(
          'BaptismRecord - getById - Service - Record not found',
        );
        throw new CustomGraphQLError('Record not found', 404);
      }
      return {
        code: 200,
        message: 'Baptism record retrieved successfully',
        data: record,
      };
    } catch (error) {
      this.logger.error(
        'BaptismRecord - getById - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async createBaptismRecord(baptismRecordData: any) {
    this.logger.log('BaptismRecord - create - Service - Start:');
    const { childRUT } = baptismRecordData;
    try {
      const existingRecord = await this.baptismRecordModel.findOne({
        where: { childRUT },
      });
      if (existingRecord) {
        this.logger.error(
          'BaptismRecord - create - Service - Record already exists',
        );
        throw new CustomGraphQLError('Registro de bautizo ya existe', 400);
      }
      await this.baptismRecordModel.create(baptismRecordData);
      return {
        code: 200,
        message: 'Registro de bautizo creado Exitosamente',
      };
    } catch (error) {
      this.logger.error(
        'BaptismRecord - create - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async updateBaptismRecord(baptismRecordData: any) {
    this.logger.log('BaptismRecord - update - Service - Start:');
    const { id } = baptismRecordData;
    try {
      await this.baptismRecordModel.update(baptismRecordData, {
        where: { id },
      });
      return {
        code: 200,
        message: 'Registro de bautizo actualizado Exitosamente',
      };
    } catch (error) {
      this.logger.error(
        'BaptismRecord - update - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async deleteBaptismRecord(id: number) {
    this.logger.log('BaptismRecord - delete - Service - Start:');
    try {
      const result = await this.baptismRecordModel.destroy({ where: { id } });
      if (result === 0) {
        this.logger.error(
          'BaptismRecord - delete - Service - Record not found',
        );
        throw new CustomGraphQLError('Registro de bautizo no existe', 404);
      }
      return {
        code: 200,
        message: 'Registro de bautizo eliminado Exitosamente',
      };
    } catch (error) {
      this.logger.error(
        'BaptismRecord - delete - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }
}
