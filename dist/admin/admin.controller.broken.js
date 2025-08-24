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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("../services/admin.service");
const fs = require("fs");
const path = require("path");
const public_decorator_1 = require("../middleware/public.decorator");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getDashboard() {
        return this.adminService.getDashboardData();
    }
    async getDashboardStats() {
        return this.adminService.getDashboardData();
    }
    async getUsers(query) {
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 50;
        return this.adminService.getAllUsers(page, limit);
    }
    async getUserStats() {
        return this.adminService.getUserStats();
    }
    async updateUser(id, data) {
        const userId = parseInt(id, 10);
        return this.adminService.updateUserStatus(userId, data.status);
    }
    async deleteUser(id) {
        const userId = parseInt(id, 10);
        return this.adminService.deleteUser(userId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('users/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
return this.adminService.deleteUser(id);
getClaims(, query, any);
{
    return this.adminService.getClaims(query);
}
getClaimById(, id, string);
{
    return this.adminService.getClaimById(id);
}
updateClaimStatus(, id, string, , data, any);
{
    return this.adminService.updateClaimStatus(id, data.status);
}
getConsultations(, query, any);
{
    return this.adminService.getConsultations(query);
}
getConsultationById(, id, string);
{
    return this.adminService.getConsultationById(id);
}
updateConsultationStatus(, id, string, , data, any);
{
    return this.adminService.updateConsultationStatus(id, data.status);
}
downloadDocument(, id, string, , res, Response);
{
    const result = await this.adminService.downloadDocument(id);
    if (!result.success || !result.data) {
        return res.status(404).json({ error: 'Document not found' });
    }
    const document = result.data;
    const filePath = path.join(process.cwd(), document.path);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found on disk' });
    }
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Length', document.size);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}
getPayments(, query, any);
{
    return this.adminService.getPayments(query);
}
getPaymentStats();
{
    return this.adminService.getPaymentStats();
}
updatePaymentStatus(, id, string, , data, any);
{
    return this.adminService.updatePaymentStatus(id, data.status);
}
getNotifications(, query, any);
{
    return this.adminService.getNotifications(query);
}
createNotification(, data, any);
{
    return this.adminService.createNotification(data);
}
markNotificationRead(, id, string);
{
    return this.adminService.markNotificationRead(id);
}
getAnalytics(, query, any);
{
    return this.adminService.getAnalytics(query);
}
getChartData(, query, any);
{
    return this.adminService.getChartData(query);
}
getSettings();
{
    return this.adminService.getSettings();
}
updateSettings(, data, any);
{
    return this.adminService.updateSettings(data);
}
exportUsers(, query, any);
{
    return this.adminService.exportUsers(query);
}
exportPayments(, query, any);
{
    return this.adminService.exportPayments(query);
}
getSystemHealth();
{
    return this.adminService.getSystemHealth();
}
//# sourceMappingURL=admin.controller.broken.js.map