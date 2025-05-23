import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = parseInt(process.env.PORT || '3000', 10);

  console.log(
    `Attempting to start server on port ${port} and host 0.0.0.0`,
  );

  await app.listen(port, '0.0.0.0');

  console.log(
    `Application is running at: http://0.0.0.0:${port}`,
  );
}
bootstrap();
