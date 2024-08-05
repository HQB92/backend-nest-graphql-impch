import { Module } from '@nestjs/common';
import { OfferingService } from './offering.service';
import { OfferingResolver } from './offering.resolver';

@Module({
  providers: [OfferingService, OfferingResolver]
})
export class OfferingModule {}
