import {
  Body,
  Request,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import StripeService from '../stripe/stripe.service';
import CreateChargeDto from './dtos/create-charge.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Stripe')
@Controller({
  path: 'charge',
  version: '1',
})
export default class ChargeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async createCharge(@Request() request, @Body() charge: CreateChargeDto) {
    await this.stripeService.charge(
      charge.amount,
      charge.payment_method_id,
      request.user.stripe_customer_id,
    );
  }
}
