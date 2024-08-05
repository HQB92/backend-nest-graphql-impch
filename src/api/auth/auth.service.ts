import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from '../../models/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userService: typeof User,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ where: { username } });
    if (user && bcrypt.compareSync(password, user.password)) {
      return await this.login(user);
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      rut: user.rut,
      roles: user.roles,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
