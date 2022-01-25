import { Controller, UseGuards, Post, HttpCode, 
         HttpStatus, Body, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { UserSubscription } from './user-subscription.entity';
import { UserSubscriptionService } from './user-subscription.service';
import { RenewSubscriptionDto } from './dtos/renew-subscription.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('User Subscription')
@Crud({
  model: {
    type: UserSubscription,
  },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    maxLimit: 50,
    alwaysPaginate: false
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@Controller({
  path: 'user-subscription',
  version: '1',
})
export class UserSubscriptionController implements CrudController<UserSubscription> {
  constructor(public service: UserSubscriptionService) {}

  get base(): CrudController<UserSubscription> {
    return this;
  }

  @ApiOperation({ summary: 'Renew subscription' })
  @Post('renew')
  @HttpCode(HttpStatus.OK)
  async setDefaultCard(@Body() dto: RenewSubscriptionDto) {
    return this.service.renewSubscription(dto);
  }

  @ApiOperation({ summary: 'Return value if user subscription is expiring' })
  @Get('/is-expiring/:user_id/:code')
  @HttpCode(HttpStatus.OK)
  async listRequest(@Param('user_id') user_id: string, @Param('code') code: string) {
    return this.service.isExpiring(user_id, code);
  }
}
