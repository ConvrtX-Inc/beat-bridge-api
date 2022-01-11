import { Module } from '@nestjs/common';
import StripeService from './stripe.service';

@Module({
  controllers: [],
  providers: [StripeService],
  imports: [],
  exports: [StripeService],
})
export class StripeModule {}
