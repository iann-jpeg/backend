import { Controller, Post, Body } from '@nestjs/common';

@Controller('admin')
export class AdminAuthController {
  @Post('login')
  async login() {
    // Allow login without password or details
    return {
      success: true,
      token: 'dev-token',
      adminUser: {
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
    };
  }
}
