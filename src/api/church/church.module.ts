import { Module } from '@nestjs/common';
import { ChurchService } from './church.service';
import { ChurchResolver } from './church.resolver';

@Module({
  providers: [ChurchService, ChurchResolver]
})
export class ChurchModule {}
