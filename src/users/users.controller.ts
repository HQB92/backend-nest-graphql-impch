import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() args: any) {
    try {
      const user = await this.usersService.createUser(args);
      return { code: 200, message: 'Usuario creado Exitosamente', user };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al crear usuario',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':username')
  async findUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Usuario no encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  @Get('id/:id')
  async findUserById(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Usuario no encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Put()
  async updateUser(@Body() args: any) {
    try {
      await this.usersService.updateUser(args);
      return { code: 200, message: 'Usuario Actualizado Exitosamente' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al actualizar usuario',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    try {
      await this.usersService.deleteUser(id);
      return { code: 200, message: 'Usuario Eliminado Exitosamente' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al eliminar usuario',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('change-password/:id')
  async changePassword(
    @Param('id') id: number,
    @Body('password') password: string,
  ) {
    try {
      await this.usersService.changePassword(id, password);
      return { code: 200, message: 'Contraseña Cambiada Exitosamente' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al cambiar contraseña',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('reset-password/:id')
  async resetPassword(@Param('id') id: number) {
    try {
      await this.usersService.resetPassword(id);
      return { code: 200, message: 'Contraseña Reseteada Exitosamente' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al resetear contraseña',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
