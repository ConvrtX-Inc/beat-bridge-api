import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { SmsDto } from './dto/sms.dto';

@Injectable()
export class SmsService {
  constructor(@InjectTwilio() private readonly client: TwilioClient) {}

  async send(request: SmsDto) {
    try {
      const res = await this.client.messages
        .create({
          to: request.phone_number,
          body: request.message,
          from: process.env.TWILIO_PHONE_NUMBER,
        })
        .then((message) => message);

      return {
        status: HttpStatus.OK,
        sent_data: request,
        response: {
          data: {
            details: res,
          },
        },
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        sent_data: request,
        response: {
          data: {
            details: 'Something went wrong: ' + error.message,
          },
        },
      };
    }
  }
}
