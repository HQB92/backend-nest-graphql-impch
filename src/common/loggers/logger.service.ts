import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as moment from 'moment-timezone';
import * as console from 'node:console';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: string) {
    console.log(`[LOG] - ${message}`, dateFormatted()); // Default log
  }

  info(message: string, args: any) {
    console.info(`[INFO] - ${message} - Args ${args}`); // Info log
  }

  error(message: string) {
    console.error(`[ERROR] - ${message}`); // Error log
  }

  warn(message: string) {
    console.warn(`[WARN] - ${message}`); // Warn log
  }

  debug(message: string, response: any) {
    console.debug(
      `[DEBUG] - ${message} Response: ${JSON.stringify(response, null, 2)}`,
    ); // Debug log
  }
}

const dateFormatted = () => {
  return moment().tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
};
