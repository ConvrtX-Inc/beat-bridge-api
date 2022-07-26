import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SerializerInterceptor } from './utils/serializer.interceptor';
import validationOptions from './utils/validation-options';
import {json,urlencoded} from 'body-parser';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import * as cookieParser from 'cookie-parser';
import * as admin from 'firebase-admin';

import { ServiceAccount } from "firebase-admin";


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(cookieParser());

  app.use(json({
    limit: '50mb'
  }));
  
  app.use(urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
  }));


  var firebaseApp = initializeApp(firebaseConfig);

  app.useGlobalInterceptors(new SerializerInterceptor());
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const options = new DocumentBuilder()
    .setTitle('BEAT BRIDGE API')
    .setDescription('BEAT BRIDGE API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);


  const adminConfig: ServiceAccount = {
    "projectId": configService.get<string>('FIREBASE_PROJECT_ID'),
    "privateKey": configService.get<string>('FIREBASE_PRIVATE_KEY')
                               .replace(/\\n/g, '\n'),
    "clientEmail": configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: "https://xxxxx.firebaseio.com",
  });

  console.log(process.env.PORT || 8000);
  await app.listen(process.env.PORT || 8000);
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

void bootstrap();



  