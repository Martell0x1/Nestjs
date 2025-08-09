import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MessageModule } from './messages/messages.module';

async function bootstrap() {
  const app = await NestFactory.create(MessageModule);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
