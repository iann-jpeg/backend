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
exports.StaticFilesController = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const fs_1 = require("fs");
const public_decorator_1 = require("../middleware/public.decorator");
let StaticFilesController = class StaticFilesController {
    async downloadFile(filename, res) {
        try {
            // Sanitize filename to prevent directory traversal attacks
            const sanitizedFilename = filename.replace(/\.\./g, '').replace(/\//g, '');
            // Get the path to the frontend Downloads folder from backend
            const downloadsPath = (0, path_1.join)(process.cwd(), '..', 'frontend', 'public', 'Downloads');
            const filePath = (0, path_1.join)(downloadsPath, sanitizedFilename);
            // Check if file exists
            if (!(0, fs_1.existsSync)(filePath)) {
                throw new common_1.NotFoundException(`File ${sanitizedFilename} not found`);
            }
            // Verify it's a PDF file (for security)
            if (!sanitizedFilename.toLowerCase().endsWith('.pdf')) {
                throw new common_1.BadRequestException('Only PDF files are allowed for download');
            }
            // Set appropriate headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);
            res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
            // Send file
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    throw new common_1.NotFoundException('File could not be served');
                }
            });
        }
        catch (error) {
            console.error('Download error:', error);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to process download request');
        }
    }
    async listDownloadableFiles() {
        try {
            // List of available PDF files in the Downloads folder
            const availableFiles = [
                {
                    filename: 'Claim_Form_Motor_-_Ammended.pdf',
                    displayName: 'Motor Claim Form (Amended)',
                    description: 'Updated motor vehicle claim form',
                    category: 'Motor Insurance'
                },
                {
                    filename: 'Claim_Forms_-_Damage_or_Loss-amended.pdf',
                    displayName: 'General Damage/Loss Claim Form',
                    description: 'General claim form for damage or loss',
                    category: 'General Insurance'
                },
                {
                    filename: 'Fidelity_Guarantee_Claim_Forms.pdf',
                    displayName: 'Fidelity Guarantee Claim Form',
                    description: 'Claim form for fidelity guarantee insurance',
                    category: 'Commercial Insurance'
                },
                {
                    filename: 'Livestock Vetenary.pdf',
                    displayName: 'Livestock Veterinary Form',
                    description: 'Veterinary examination form for livestock insurance',
                    category: 'Livestock Insurance'
                },
                {
                    filename: 'Livestock_Insurance_Proposal_Form.pdf',
                    displayName: 'Livestock Insurance Proposal',
                    description: 'Proposal form for livestock insurance coverage',
                    category: 'Livestock Insurance'
                },
                {
                    filename: 'Machinery_Breakdown_Extr_Damage-Claim_Form.pdf',
                    displayName: 'Machinery Breakdown Claim Form',
                    description: 'Claim form for machinery breakdown and external damage',
                    category: 'Commercial Insurance'
                },
                {
                    filename: 'Medical Insurance - individual.pdf',
                    displayName: 'Individual Medical Insurance',
                    description: 'Individual medical insurance application form',
                    category: 'Medical Insurance'
                },
                {
                    filename: 'Motor Theft Claim Form.pdf',
                    displayName: 'Motor Theft Claim Form',
                    description: 'Specialized claim form for motor vehicle theft',
                    category: 'Motor Insurance'
                },
                {
                    filename: 'Motor_Entertainment_System_Claim_Form.pdf',
                    displayName: 'Motor Entertainment System Claim',
                    description: 'Claim form for in-vehicle entertainment systems',
                    category: 'Motor Insurance'
                },
                {
                    filename: 'Personal_Accident_Claim_Form.pdf',
                    displayName: 'Personal Accident Claim Form',
                    description: 'Claim form for personal accident insurance',
                    category: 'Personal Insurance'
                },
                {
                    filename: 'Public_Liability_(THIRDPARTY)_Claim_Form.pdf',
                    displayName: 'Public Liability Claim Form',
                    description: 'Third party public liability claim form',
                    category: 'Liability Insurance'
                },
                {
                    filename: 'Windscreen & window damage claim form.pdf',
                    displayName: 'Windscreen & Window Damage Claim',
                    description: 'Claim form for windscreen and window damage',
                    category: 'Motor Insurance'
                },
                {
                    filename: 'Workmen\'s_Compenstion_Accident_Claim_Form_-_ammended.pdf',
                    displayName: 'Workmen\'s Compensation Claim Form',
                    description: 'Workers compensation accident claim form (amended)',
                    category: 'Workers Compensation'
                },
                {
                    filename: 'claim_documentation_guide.pdf',
                    displayName: 'Claim Documentation Guide',
                    description: 'Comprehensive guide for claim documentation requirements',
                    category: 'Documentation'
                },
                {
                    filename: 'group_medical_insurance.pdf',
                    displayName: 'Group Medical Insurance',
                    description: 'Group medical insurance application and information',
                    category: 'Medical Insurance'
                }
            ];
            return {
                success: true,
                data: availableFiles,
                message: 'Available download files retrieved successfully'
            };
        }
        catch (error) {
            console.error('Error listing downloadable files:', error);
            return {
                success: false,
                data: [],
                message: 'Failed to retrieve downloadable files'
            };
        }
    }
};
exports.StaticFilesController = StaticFilesController;
__decorate([
    (0, common_1.Get)('downloads/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StaticFilesController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Get)('downloads'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaticFilesController.prototype, "listDownloadableFiles", null);
exports.StaticFilesController = StaticFilesController = __decorate([
    (0, common_1.Controller)('static'),
    (0, public_decorator_1.Public)()
], StaticFilesController);
