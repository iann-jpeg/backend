"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
            errorFormat: 'minimal',
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
        this.logger = new common_1.Logger(PrismaService_1.name);
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('✅ Aplin PostgreSQL connected successfully');
            // Test connection with a simple query
            await this.$queryRaw `SELECT 1 as connection_test`;
            this.logger.log('✅ Database health check passed');
        }
        catch (error) {
            this.logger.error(`❌ Database connection failed: ${error.message}`);
            this.logger.warn('⚠️  Server will continue without database connection');
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('📤 Database connection closed');
    }
    async healthCheck() {
        try {
            await this.$queryRaw `SELECT 1 as health`;
            return true;
        }
        catch (error) {
            this.logger.error(`Database health check failed: ${error.message}`);
            return false;
        }
    }
    async getDatabaseInfo() {
        try {
            const result = await this.$queryRaw `
        SELECT 
          version() as version,
          current_database() as database,
          current_user as user,
          inet_server_addr() as host
      `;
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to get database info: ${error.message}`);
            return null;
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
