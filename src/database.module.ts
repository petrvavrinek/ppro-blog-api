import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { DataSourceOptions } from 'typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  entities: ['dist/**/*.entity.js'],
  url: configService.getOrThrow('DATABASE_URI'),
  migrations: [
    path.join(__dirname, '..', 'database', 'migrations', '*.js'),
  ],
  type: 'postgres',
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...getDatabaseConfig(configService),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
