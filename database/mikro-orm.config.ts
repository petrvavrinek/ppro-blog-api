import { defineConfig } from '@mikro-orm/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from 'src/database.module';

// Load env variables to process.env
ConfigModule.forRoot({
  isGlobal: true,
});
const configService = new ConfigService();

export default defineConfig(getDatabaseConfig(configService));
