import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { hash as sha256 } from 'crypto'; // actually use crypto below

import * as crypto from 'crypto';
import { hashPassword, verifyPassword } from './hash.util';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(username: string, email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const passwordHash = await hashPassword(password);
    return this.usersService.createUser(username, email, passwordHash);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.username, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '900s',
    });
    const refreshToken = this.jwtService.sign({ sub: user.id }, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    });

    // store hashed refresh token in DB (so raw token is not stored)
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const userId = payload.sub;
      const user = await this.usersService.findById(userId);
      if (!user) throw new Error('User not found');

      const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      if (!user.refreshTokenHash || user.refreshTokenHash !== refreshHash) {
        throw new Error('Invalid refresh token');
      }

      // issue new access token (and optionally new refresh token)
      const newAccess = this.jwtService.sign({ sub: user.id, username: user.username, email: user.email }, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '900s',
      });
      return { accessToken: newAccess };
    } catch (err) {
      throw err;
    }
  }
}
