import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  for (let i = 1; i <= 1000; i++) {
    const email = `user${i}@example.com`;
    const password = `password${i}`;
    await usersService.create(email, password);
  }

  console.log('Seed data created!');
  await app.close();
}

bootstrap();
