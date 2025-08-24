import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto } from '../config/auth.dto';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
  private readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret';

  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({ 
        where: { email: dto.email } 
      });
      
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 12);
      
      // Check if this is the first user (make them admin)
      const userCount = await this.prisma.user.count();
      const role = userCount === 0 ? Role.ADMIN : Role.USER;
      
      // Create user
      const user = await this.prisma.user.create({
        data: { 
          name: dto.name,
          email: dto.email.toLowerCase(),
          password: hashedPassword, 
          role 
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });
      
      return { 
        success: true,
        message: `Account created successfully${role === Role.ADMIN ? ' with admin privileges' : ''}`,
        user
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof ConflictException) {
        throw error;
      }
      
      throw new Error('Registration failed');
    }
  }

  async registerAdmin(dto: RegisterDto) {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({ 
        where: { email: dto.email } 
      });
      
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 12);
      
      // Create admin user
      const user = await this.prisma.user.create({
        data: { 
          name: dto.name,
          email: dto.email.toLowerCase(),
          password: hashedPassword, 
          role: Role.ADMIN 
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });
      
      return { 
        success: true,
        message: 'Admin account created successfully',
        user
      };
    } catch (error) {
      console.error('Admin registration error:', error);
      
      if (error instanceof ConflictException) {
        throw error;
      }
      
      throw new Error('Admin registration failed');
    }
  }

  async login(dto: LoginDto) {
    try {
      console.log('🔍 Login attempt for:', dto.email.toLowerCase());
      
      // Find user with case-insensitive email
      const user = await this.prisma.user.findUnique({ 
        where: { email: dto.email.toLowerCase() },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          createdAt: true
        }
      });

      if (!user) {
        console.log('❌ User not found:', dto.email.toLowerCase());
        throw new UnauthorizedException('Invalid email or password');
      }
      
      console.log('✅ User found:', { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        hasPassword: !!user.password 
      });

      // Verify password
      const passwordValid = await bcrypt.compare(dto.password, user.password);
      console.log('🔑 Password validation result:', passwordValid);
      
      if (!passwordValid) {
        console.log('❌ Password invalid for user:', user.email);
        throw new UnauthorizedException('Invalid email or password');
      }
      
      // Generate tokens
      const tokenPayload = { 
        userId: user.id, 
        sub: user.id, 
        role: user.role,
        email: user.email 
      };
      
      const accessToken = jwt.sign(
        tokenPayload, 
        this.JWT_SECRET, 
        { expiresIn: '24h' } // Extended for admin convenience
      );
      
      const refreshToken = jwt.sign(
        { sub: user.id, role: user.role }, 
        this.REFRESH_TOKEN_SECRET, 
        { expiresIn: '7d' }
      );
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
          user: userWithoutPassword,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('Login failed');
    }
  }

  async logout(user: any) {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success
    return { 
      success: true,
      message: 'Logged out successfully' 
    };
  }

  async refresh(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token required');
      }

      const payload = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET) as any;
      
      const user = await this.prisma.user.findUnique({ 
        where: { id: payload.sub },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      const tokenPayload = { 
        userId: user.id, 
        sub: user.id, 
        role: user.role,
        email: user.email 
      };
      
      const accessToken = jwt.sign(
        tokenPayload, 
        this.JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      return { 
        success: true,
        data: {
          access_token: accessToken,
          user
        }
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        },
      });
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error('Get profile error:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new Error('Failed to get profile');
    }
  }

  async verifyToken(token: string) {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET) as any;
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async createInitialAdmin(dto: RegisterDto, setupKey?: string) {
    try {
      // Verify setup key for security
      const expectedSetupKey = process.env.ADMIN_SETUP_KEY || 'galloways-admin-2025';
      if (setupKey !== expectedSetupKey) {
        throw new UnauthorizedException('Invalid setup key');
      }

      // Check if any admin already exists
      const adminCount = await this.prisma.user.count({
        where: { role: Role.ADMIN }
      });
      
      if (adminCount > 0) {
        throw new ConflictException('Admin user already exists. Use regular registration.');
      }

      // Check if user with email exists
      const existingUser = await this.prisma.user.findUnique({ 
        where: { email: dto.email.toLowerCase() } 
      });
      
      if (existingUser) {
        // Upgrade existing user to admin
        const updatedUser = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { role: Role.ADMIN },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
          }
        });
        
        return {
          success: true,
          message: 'Existing user upgraded to admin successfully',
          user: updatedUser
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 12);
      
      // Create new admin user
      const admin = await this.prisma.user.create({
        data: { 
          name: dto.name,
          email: dto.email.toLowerCase(),
          password: hashedPassword, 
          role: Role.ADMIN 
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });
      
      return { 
        success: true,
        message: 'Initial admin account created successfully',
        user: admin
      };
    } catch (error) {
      console.error('Initial admin creation error:', error);
      
      if (error instanceof ConflictException || error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new Error('Initial admin creation failed');
    }
  }

  async promoteUserToAdmin(userId: number, currentAdminId: number) {
    try {
      // Verify current user is admin
      const currentAdmin = await this.prisma.user.findUnique({
        where: { id: currentAdminId },
        select: { role: true }
      });
      
      if (currentAdmin?.role !== Role.ADMIN) {
        throw new UnauthorizedException('Only admins can promote users');
      }

      // Find target user
      const targetUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true }
      });
      
      if (!targetUser) {
        throw new NotFoundException('User not found');
      }
      
      if (targetUser.role === Role.ADMIN) {
        throw new ConflictException('User is already an admin');
      }

      // Promote to admin
      const promotedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { role: Role.ADMIN },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          updatedAt: true
        }
      });
      
      return {
        success: true,
        message: `User ${promotedUser.name} promoted to admin successfully`,
        user: promotedUser
      };
    } catch (error) {
      console.error('User promotion error:', error);
      
      if (error instanceof UnauthorizedException || 
          error instanceof NotFoundException || 
          error instanceof ConflictException) {
        throw error;
      }
      
      throw new Error('User promotion failed');
    }
  }

  async isAdmin(userId: number): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });
      
      return user?.role === Role.ADMIN;
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
  }
}
