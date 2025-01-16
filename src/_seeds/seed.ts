import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { UserSeed } from './user.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userSeed = app.get(UserSeed);

  console.log('Seeding users...');
  await userSeed.seed();

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
