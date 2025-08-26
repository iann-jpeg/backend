"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiasporaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let DiasporaService = class DiasporaService {
    async findAll({ page = 1, limit = 10 }) {
        return prisma.diasporaRequest.findMany({ skip: (page - 1) * limit, take: limit });
    }
    findOne(id) {
        return prisma.diasporaRequest.findUnique({ where: { id } });
    }
    create(data) {
        return prisma.diasporaRequest.create({ data });
    }
    update(id, data) {
        return prisma.diasporaRequest.update({ where: { id }, data });
    }
    remove(id) {
        return prisma.diasporaRequest.delete({ where: { id } });
    }
};
exports.DiasporaService = DiasporaService;
exports.DiasporaService = DiasporaService = __decorate([
    (0, common_1.Injectable)()
], DiasporaService);
//# sourceMappingURL=diaspora.service.js.map