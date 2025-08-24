import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // For now, allow all requests to admin endpoints
    // In production, you might want to check IP whitelist, API keys, etc.
    // This is a simple guard that allows access from specific origins
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];
    const origin = request.headers.origin;
    
    return allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development';
  }
}
