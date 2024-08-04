import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import * as bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async createUser(args: any): Promise<User> {
    args.password = bcrypt.hashSync('123456', 10);
    const transaction = await this.sequelize.transaction();
    try {
      delete args.id;
      const user = await this.userModel.create(args, { transaction });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw new Error('Error al crear usuario');
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ where: { username } });
  }

  async findUserById(id: number): Promise<User> {
    return await this.userModel.findByPk(id);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.findAll({ order: [['id', 'ASC']] });
  }

  async updateUser(args: any): Promise<void> {
    const { user } = args;
    const transaction = await this.sequelize.transaction();
    try {
      if (user.password) {
        user.password = bcrypt.hashSync(user.password, 10);
        await this.userModel.update(
          { password: user.password },
          { where: { id: user.id }, transaction },
        );
      }
      await this.userModel.update(
        { roles: user.roles, email: user.email },
        { where: { id: user.id }, transaction },
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new Error('Error al actualizar usuario');
    }
  }

  async deleteUser(id: number): Promise<void> {
    const transaction = await this.sequelize.transaction();
    try {
      const data = await this.userModel.destroy({
        where: { id },
        transaction,
      });
      await transaction.commit();
      if (data !== 1) {
        throw new Error('Error Usuario no existe');
      }
    } catch (error) {
      await transaction.rollback();
      throw new Error('Error al eliminar usuario');
    }
  }

  async changePassword(
    id: number,
    password: string,
  ): Promise<{ code: number; message: string }> {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const data = await this.userModel.update(
      { password: hashedPassword },
      { where: { id } },
    );
    if (data[0] !== 1) {
      throw new Error('Error al cambiar contraseña');
    }
    return { code: 200, message: 'Contraseña Cambiada Exitosamente' };
  }

  async resetPassword(id: number): Promise<{ code: number; message: string }> {
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const data = await this.userModel.update(
      { password: hashedPassword },
      { where: { id } },
    );
    if (data[0] !== 1) {
      throw new Error('Error al resetear contraseña');
    }
    return { code: 200, message: 'Contraseña Reseteada Exitosamente' };
  }


}
