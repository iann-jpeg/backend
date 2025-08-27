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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutsourcingController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const outsourcing_service_1 = require("../services/outsourcing.service");
const outsourcing_dto_1 = require("../config/outsourcing.dto");
const jwt_auth_guard_1 = require("../middleware/jwt-auth.guard");
const roles_guard_1 = require("../middleware/roles.guard");
const roles_decorator_1 = require("../middleware/roles.decorator");
const public_decorator_1 = require("../middleware/public.decorator");
let OutsourcingController = class OutsourcingController {
    constructor(outsourcingService) {
        this.outsourcingService = outsourcingService;
    }
    async findAll(page = 1, limit = 10, status) {
        return this.outsourcingService.findAll(+page, +limit, status);
    }
    async findOne(id) {
        return this.outsourcingService.findOne(+id);
    }
    async create(createOutsourcingRequestDto, document) {
        return this.outsourcingService.create(createOutsourcingRequestDto, document);
    }
    async update(id, updateOutsourcingRequestDto) {
        return this.outsourcingService.update(+id, updateOutsourcingRequestDto);
    }
    async remove(id) {
        return this.outsourcingService.remove(+id);
    }
    async updateStatus(id, body) {
        return this.outsourcingService.updateStatus(+id, body.status);
    }
};
exports.OutsourcingController = OutsourcingController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], OutsourcingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OutsourcingController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('document', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/outsourcing',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `outsourcing-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            const allowedTypes = /\.(pdf|jpg|jpeg|png|doc|docx)$/;
            if (allowedTypes.test(file.originalname.toLowerCase())) {
                callback(null, true);
            }
            else {
                callback(new common_1.BadRequestException('Invalid file type'), false);
            }
        },
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [outsourcing_dto_1.CreateOutsourcingRequestDto, Object]),
    __metadata("design:returntype", Promise)
], OutsourcingController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, outsourcing_dto_1.UpdateOutsourcingRequestDto]),
    __metadata("design:returntype", Promise)
], OutsourcingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OutsourcingController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OutsourcingController.prototype, "updateStatus", null);
exports.OutsourcingController = OutsourcingController = __decorate([
    (0, common_1.Controller)('outsourcing'),
    __metadata("design:paramtypes", [outsourcing_service_1.OutsourcingService])
], OutsourcingController);
//# sourceMappingURL=outsourcing.controller.js.map