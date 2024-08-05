import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (authHeader) {
      const token: string = authHeader.split(' ')[1];
      try {
        const decoded: any = this.verifyToken(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          return next(new Error('Token expired'));
        }
        req['user'] = decoded;
        next();
      } catch (err) {
        return next(new Error('Invalid token'));
      }
    } else {
      return next(new Error('Authorization header must be provided'));
    }
  }

  private verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      console.error(error);
      throw new Error('Invalid/Expired token');
    }
  }
}
