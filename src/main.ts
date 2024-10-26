import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { NestFactory, Reflector } from '@nestjs/core';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from '@/app.module';
import EnvConfig from '@/config/envConfig';
import { GlobalJwtGuard } from '@/auth/guards/global-jwt.guard';
import { runSeeds } from '@/database';
import { FormatResponseInterceptor } from '@/interceptors/transform.interceptors';

function initializeSwaggerDocumentation(app: INestApplication) {
  const PATH = '/api/docs';
  const swaggerDocs = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocs);
  SwaggerModule.setup(PATH, app, document);

  if (!existsSync('./public')) {
    mkdirSync('./public');
  }

  writeFileSync('./public/swagger-spec.json', JSON.stringify(document));
}

async function bootstrap(port: number) {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      enableDebugMessages: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(morgan(':date[iso] :method :url :status - :response-time ms'));
  app.use(cookieParser());
  app.useGlobalGuards(new GlobalJwtGuard(reflector));
  app.useGlobalInterceptors(new FormatResponseInterceptor());

  initializeSwaggerDocumentation(app);

  await app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server start on port: ${port}`);
    runSeeds('launch');
  });
}

bootstrap(EnvConfig.app.port);
