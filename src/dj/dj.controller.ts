import { Controller, HttpCode, HttpStatus, Post,Request } from '@nestjs/common';

@Controller('dj')
export class DjController {

        @Post()
        @HttpCode(HttpStatus.OK)
        public async test(
          @Request() request,
        ) {
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
