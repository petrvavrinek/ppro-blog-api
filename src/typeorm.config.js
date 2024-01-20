"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var config_1 = require("@nestjs/config");
var database_module_1 = require("src/database.module");
// Import module to include all entities in dist folder
require("src/app.module");
// Load env variables to process.env
config_1.ConfigModule.forRoot({
    isGlobal: true,
});
var configService = new config_1.ConfigService();
exports.default = new typeorm_1.DataSource((0, database_module_1.getDatabaseConfig)(configService));
