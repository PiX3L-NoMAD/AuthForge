// auth.service.ts
// Purpose: Handles all authentication logic — user validation, token creation, refresh handling.
// References: https://docs.nestjs.com/security/authentication, https://docs.nestjs.com/techniques/security#jwt-token

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import { hashPassword, verifyPassword } from './hash.util';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  // --- Register a new user ---
    async register(username: string, email: string, password: string) {
      console.log(`Register attempt for: ${email}`);
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new Error('Email already registered');

    const passwordHash = await hashPassword(password);
    return this.usersService.createUser(username, email, passwordHash);
  }

  // --- Validate credentials ---
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  // --- Login and issue both tokens ---
  async login(user: any) {
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Payload = what will be embedded inside the token
    const payload = { sub: user.id, username: user.username, email: user.email };

    // Create short-lived access token
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '900s',
    } as any);

    // Create long-lived refresh token
    const refreshToken = this.jwtService.sign({ sub: user.id }, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    } as any);

    // Store hashed refresh token in DB
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);

    // Return both tokens (this is what the client expects)
    return { accessToken, refreshToken };
  }

  // --- Verify and refresh tokens ---
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const userId = payload.sub;
      const user = await this.usersService.findById(userId);
      if (!user) throw new UnauthorizedException('User not found');

      // Hash provided token and compare to stored hash
      const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      if (!user.refreshTokenHash || user.refreshTokenHash !== refreshHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Issue new access token
      const newAccess = this.jwtService.sign(
        { sub: user.id, username: user.username, email: user.email },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '900s',
        } as any,
      );

      return { accessToken: newAccess };
    } catch (err) {
      throw new UnauthorizedException('Token refresh failed');
    }
  }
}
