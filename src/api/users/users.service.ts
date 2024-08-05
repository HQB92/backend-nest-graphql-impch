import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import * as bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize-typescript';
import { Response, ResponseArray, ResponseData } from '../../types/response.type';
import { CustomGraphQLError } from '../../common/errors/custom-error';
import { LoggerService } from '../../common/loggers/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
    private readonly logger: LoggerService,
  ) {}

  async findUserById(id: number): Promise<ResponseData> {
    this.logger.log('User - findById - Service - Start:');
    this.logger.info('User - findById - Service', id);
    try {
      const user = await this.userModel.findByPk(id, {
        attributes: ['id', 'username', 'rut', 'email', 'roles'],
      });
      if (!user) {
        this.logger.error('User - findById - Service - User not found');
        throw new CustomGraphQLError('User not found', 404);
      }
      return {
        code: 200,
        message: 'User found',
        data: user,
      };
    } catch (error) {
      if (error instanceof CustomGraphQLError) {
        this.logger.error('User - findById - Service - Internal server error');
        throw error;
      }
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async createUser(args: any): Promise<Response> {
    this.logger.log('User - create - Service - Start:');
    this.logger.info('User - create - Service', args);
    const { username, password, rut, email, roles } = args.user;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await this.userModel.findOne({ where: { username } });
    if (user) {
      this.logger.error('User - create - Service - User already exists');
      throw new CustomGraphQLError('User already exists', 400);
    }
    const transaction = await this.sequelize.transaction();
    try {
      await this.userModel.create(
        {
          username,
          password: hashedPassword,
          rut,
          email,
          roles,
        },
        { transaction },
      );
      await transaction.commit();
      return {
        code: 201,
        message: 'User created successfully',
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error('User - create - Service - Error creating user');
      throw new CustomGraphQLError('Error creating user', 500);
    }
  }

  async findUserByUsername(username: string): Promise<ResponseData> {
    this.logger.log('User - findByUsername - Service - Start:');
    this.logger.info('User - findByUsername - Service', username);
    const user = await this.userModel.findOne({
      where: { username },
      attributes: ['id', 'username', 'rut', 'email', 'roles'],
    });
    if (!user) {
      this.logger.error('User - findByUsername - Service - User not found');
      throw new CustomGraphQLError('User not found', 404);
    }
    try {
      return {
        code: 200,
        message: 'User found',
        data: user,
      };
    } catch (error) {
      if (error instanceof CustomGraphQLError) {
        throw error;
      }
      this.logger.error(
        'User - findByUsername - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async findAllUsers(): Promise<ResponseArray> {
    this.logger.log('User - findAll - Service - Start:');
    this.logger.info('User - findAll - Service', 'Not Args');
    try {
      const users: any = await this.userModel.findAll({
        attributes: ['id', 'username', 'rut', 'email', 'roles'],
        order: [['id', 'ASC']],
      });
      if (!users) {
        this.logger.error('User - findAll - Service - Users not found');
        throw new CustomGraphQLError('Users not found', 404);
      } else {
        return {
          code: 200,
          message: 'Users found',
          data: users,
        };
      }
    } catch (error) {
      if (error instanceof CustomGraphQLError) {
        this.logger.error('User - findAll - Service - Internal server error');
      }
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async updateUser(args: any): Promise<void> {
    this.logger.log('User - update - Service - Start:');
    this.logger.info('User - update - Service', args);
    const { id, username, password, rut } = args;
    const user = await this.userModel.findByPk(id);
    if (!user) {
      this.logger.error('User - update - Service - User not found');
      throw new CustomGraphQLError('User not found', 404);
    }
    const transaction = await this.sequelize.transaction();
    try {
      await this.userModel.update(
        { username, password, rut },
        { where: { id }, transaction },
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      this.logger.error('User - update - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async deleteUser(id: number): Promise<Response> {
    this.logger.log('User - delete - Service - Start:');
    this.logger.info('User - delete - Service', id);
    const user = await this.userModel.findByPk(id);
    if (!user) {
      this.logger.error('User - delete - Service - User not found');
      throw new CustomGraphQLError('User not found', 404);
    }
    const transaction = await this.sequelize.transaction();
    try {
      await this.userModel.destroy({ where: { id }, transaction });
      await transaction.commit();
      return {
        code: 200,
        message: 'User deleted successfully',
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error('User - delete - Service - Internal server error');
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async changePassword(id: number, password: string): Promise<Response> {
    this.logger.log('User - changePassword - Service - Start:');
    this.logger.info('User - changePassword - Service', { id, password });
    const hashedPassword = bcrypt.hashSync(password, 10);
    const transaction = await this.sequelize.transaction();
    const user = await this.userModel.findByPk(id);
    if (!user) {
      this.logger.error('User - changePassword - Service - User not found');
      throw new CustomGraphQLError('User not found', 404);
    }
    try {
      await this.userModel.update(
        { password: hashedPassword },
        { where: { id }, transaction },
      );
      await transaction.commit();
      return {
        code: 200,
        message: 'Password changed successfully',
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        'User - changePassword - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }

  async resetPassword(id: number): Promise<{ code: number; message: string }> {
    this.logger.log('User - resetPassword - Service - Start:');
    this.logger.info('User - resetPassword - Service - ', id);
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const transaction = await this.sequelize.transaction();
    const user = await this.userModel.findByPk(id);
    if (!user) {
      this.logger.error('User - resetPassword - Service - User not found');
      throw new CustomGraphQLError('User not found', 404);
    }
    try {
      await this.userModel.update(
        { password: hashedPassword },
        { where: { id }, transaction },
      );
      await transaction.commit();
      return {
        code: 200,
        message: 'Password reset successfully',
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(
        'User - resetPassword - Service - Internal server error',
      );
      throw new CustomGraphQLError('Internal server error', 500);
    }
  }
}
