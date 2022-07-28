import { Body, Controller, HttpCode, HttpStatus, Post,Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import { DjDto } from './dto/dj.dto';

@ApiTags('DJ')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'dj',
  version: '1',
})
export class DjController {

        @Post()
        @HttpCode(HttpStatus.OK)
        public async test(
          @Request() request,
          @Body() djDto:DjDto
        ) {

            const message = {
                data:{
                  queue:djDto.queue,
                  track:djDto.track
                },
              };
              await admin.messaging().sendToTopic("test",message);
            return "Test"
        }
    
    
    
}
const firebaseConfig = {
    apiKey: "AIzaSyCTAID2sZFlyv0YlkTUehDUOP6MJ2UrGgU",
    authDomain: "beatbridge-convrtx.firebaseapp.com",
    projectId: "beatbridge-convrtx",
    storageBucket: "beatbridge-convrtx.appspot.com",
    messagingSenderId: "270937801505",
    appId: "1:270937801505:web:f907fc42a1f34c49e07460",
    measurementId: "G-100NE8P34S"
  };
