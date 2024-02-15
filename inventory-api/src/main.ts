import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthTokenDecypherInterceptor } from './_helper/auth-token-decypher.interceptor';
import * as bodyParser from 'body-parser';
import { DataValidationInterceptor } from './interceptor/validation.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalInterceptors(new AuthTokenDecypherInterceptor());
  app.useGlobalInterceptors(new DataValidationInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Elton\'s Inventory')
    .setDescription('Reboot')
    .setVersion('1.0.11')
    .setTermsOfService('http://placeholder')
    .setContact('Elton', 'urlToAPex', 'nhlana.2@gmail.com')
    .setLicense('Apache 2.0', 'http://www.apache.org/licenses/LICENSE-2.0.html')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(8080, '0.0.0.0');
}
bootstrap();
