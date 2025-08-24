import { Controller, Post, Body, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginRequest, AuthLoginResponse, AuthUser } from '../types/api.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: AuthLoginRequest): Promise<AuthLoginResponse> {
    try {
      const result = await this.authService.login(body.email, body.password);
      return result;
    } catch (err) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  @Get('profile')
  async getProfile(@Req() req: any): Promise<AuthUser> {
    // TODO: Extract user from token
    // Example: verify(req.headers.authorization)
    return {
      id: 'admin-id',
      name: 'Admin',
      email: 'admin@galloways.co.ke',
      role: 'ADMIN',
    };
  }
}
