import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';

async function bootstrap() {
  const API_PATH = 'api/v1';
  const PORT = process.env.PORT || 8000;

  const app = await NestFactory.create(AppModule);

  // prefix path
  app.setGlobalPrefix(API_PATH);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new HttpExceptionFilter());

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Grocery Tracker API')
    .setDescription('This API is for grocery tracker')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'apiKey',
      scheme: 'Bearer',
      bearerFormat: 'Bearer',
      name: 'Authorization',
      in: 'header',
      description: 'Please enter token in following format: Bearer [JWT]',
    })
    .setBasePath(API_PATH)
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, swaggerDoc, {
    swaggerOptions: {
      operationsSorter: 'alpha', //alpha, metod
    },
  });

  // port
  await app.listen(PORT);
}
bootstrap();
