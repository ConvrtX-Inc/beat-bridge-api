import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SmsDto } from './dto/sms.dto';
import { SmsService } from './sms.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sms')
@Controller({
  path: 'sms',
  version: '1',
})
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async send(@Body() dto: SmsDto) {
    return await this.smsService.send(dto);
  }
}
