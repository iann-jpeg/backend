import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Allow access to public endpoints
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    
    // For protected endpoints, require authentication
    if (!authHeader) {
      throw new UnauthorizedException('Access token required');
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token malformed');
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      req.user = {
        userId: payload.userId,
        sub: payload.sub,
        role: payload.role,
        email: payload.email
      };
      return true;
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
