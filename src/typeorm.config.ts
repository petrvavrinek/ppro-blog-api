import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from 'src/database.module';

// Import module to include all entities in dist folder
import "src/app.module";

// Load env variables to process.env
ConfigModule.forRoot({
  isGlobal: true,
});
const configService = new ConfigService();
export default new DataSource(getDatabaseConfig(configService));


