import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'path';

export const getDatabaseConfig = (configService: ConfigService) => ({
  extensions: [Migrator],
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  clientUrl: configService.getOrThrow('DATABASE_URI'),
  driver: PostgreSqlDriver,
  migrations: {
    path: path.join(__dirname, '..', 'database', 'migrations'),
  },
});

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),
  ],
})
export class DatabaseModule {}
