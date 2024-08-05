import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TransformResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send.bind(res);
    console.log('TransformResponseMiddleware');
    console.log('req', req);

    res.send = (body: any) => {
      if (typeof body === 'string' && body.startsWith('{')) {
        const jsonBody = JSON.parse(body);
        console.log(jsonBody);
        const getLastLevelData = (obj) => {
          let current = obj;
          while (current && current.data) {
            current = current.data;
          }
          return current;
        };
        const dynamicUserKey = Object?.keys(jsonBody?.data)[0];
        const dynamicGetByIdKey = Object?.keys(
          jsonBody?.data[dynamicUserKey],
        )[0];
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
