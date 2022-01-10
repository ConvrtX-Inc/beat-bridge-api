import { Module } from '@nestjs/common';
import ChargeController from './charge.controller';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  controllers: [ChargeController],
  imports: [StripeModule],
})
export class ChargeModule {}
