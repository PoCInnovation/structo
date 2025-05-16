import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser toutes les origines pour les tests
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
    `Tentative de démarrage du serveur sur port ${port} et hôte 0.0.0.0`,
  );

  await app.listen(port, '0.0.0.0');

  console.log(
    `L'application est en cours d'exécution sur: http://0.0.0.0:${port}`,
  );
}
bootstrap();
