import { Injectable, UnauthorizedException } from '@nestjs/common';
import { prisma } from '../db/prisma';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { config } from '../config';
import { AuthUser } from '../types/api.types';

@Injectable()
export class AuthService {
  async ensureDefaultAdmin() {
    const email = 'admin@galloways.co.ke';
    const password = 'admin123';
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      const hash = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          name: 'Admin',
          email,
          password: hash,
          role: 'ADMIN',
        },
      });
    }
  }

  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== 'ADMIN') return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return { id: String(user.id), name: user.name, email: user.email, role: user.role };
  }

  async login(email: string, password: string) {
    await this.ensureDefaultAdmin();
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const token = sign({ sub: user.id, role: user.role }, config.jwtSecret!, { expiresIn: '1d' });
    return { token, user };
  }

  async adminLogin(email: string, password: string) {
    try {
      const admin = await prisma.user.findUnique({ where: { email } });
      if (!admin || admin.role !== 'ADMIN') {
        return { success: false, message: 'Invalid credentials' };
      }
      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) {
        return { success: false, message: 'Invalid credentials' };
      }
      const token = sign({ sub: admin.id, role: admin.role }, config.jwtSecret!, { expiresIn: '1d' });
      return {
        success: true,
        token,
        adminUser: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      };
    } catch (err) {
      return { success: false, message: 'Authentication error' };
    }
  }
}
