import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TransformResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
      if (typeof body === 'string' && body.startsWith('{')) {
        const jsonBody = JSON.parse(body);
        const getLastLevelData = (obj: any) => {
          let current = obj;
          while (current && current.data) {
            current = current.data;
          }
          return current;
        };
        const data = jsonBody.data;
        const dynamicUserKey = data && Object.keys(data)[0];
        const dynamicGetByIdKey =
          dynamicUserKey && Object.keys(data[dynamicUserKey])[0];

        if (jsonBody.data && !jsonBody.errors) {
          body = JSON.stringify({
            code: getLastLevelData(
              jsonBody?.data[dynamicUserKey][dynamicGetByIdKey]?.code,
            ),
            message: getLastLevelData(
              jsonBody?.data[dynamicUserKey][dynamicGetByIdKey]?.message,
            ),
            data: getLastLevelData(
              jsonBody?.data[dynamicUserKey][dynamicGetByIdKey]?.data,
            ),
          });
        }
      }
      return originalSend(body);
    };

    next();
  }
}
