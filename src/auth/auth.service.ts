/**
 * File: auth.service.ts
 * Purpose: Create and validate tokens. Add expiry metadata so clients can refresh before 401s.
 * Notes: We decode JWTs to read exp/iat. See Nest docs:
 * - Auth: https://docs.nestjs.com/security/authentication
 * - JWT:  https://docs.nestjs.com/security/authentication#jwt-functionality
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import { hashPassword, verifyPassword } from './hash.util';

type TokenMeta = {
  expiresAt: string; // ISO string
  ttlSeconds: number; // exp - iat
}

function extractMeta(token: string, jwt: JwtService): TokenMeta {
  const payload = jwt.decode(token) as { exp: number; iat: number };
  if (!payload?.exp || !payload.iat) {
    return { expiresAt: new Date(Date.now() + 60_000).toISOString(), ttlSeconds: 60 }; // default 1 min
  }
  return {
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    ttlSeconds: payload.exp - payload.iat,
  };
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  // register a new user
    async register(username: string, email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const passwordHash = await hashPassword(password);
    return this.usersService.createUser(username, email, passwordHash);
  }

  // validate credentials
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  // login and issue both tokens
  async login(user: any) {
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // payload = what will be embedded inside the token
    const payload = { sub: user.id, username: user.username, email: user.email };

    // create short-lived access token
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '60s',
    } as any);

    // create long-lived refresh token
    const refreshToken = this.jwtService.sign({ sub: user.id }, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    } as any);

    // store hashed refresh token in DB
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.usersService.setRefreshTokenHash(user.id, refreshTokenHash);

    // extract expiry metadata (optional)
    const accessMeta = extractMeta(accessToken, this.jwtService);
    const refreshMeta = extractMeta(refreshToken, this.jwtService);

    // return both tokens (this is what the client expects)
    return {
      accessToken,
      refreshToken,
      meta: {
        access: accessMeta,
        refresh: refreshMeta,
      },
    };
  }

  // verify and refresh tokens
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const userId = payload.sub;
      const user = await this.usersService.findById(userId);
      if (!user) throw new UnauthorizedException('User not found');

      // hash provided token and compare to stored hash
      const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      if (!user.refreshTokenHash || user.refreshTokenHash !== refreshHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // issue new access token
      const newAccess = this.jwtService.sign(
        { sub: user.id, username: user.username, email: user.email },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '60s',
        } as any,
      );

      // extract expiry metadata (optional)
      const accessMeta = extractMeta(newAccess, this.jwtService);

      return {
        accessToken: newAccess,
        meta: {
          access: accessMeta
        },
      };
    } catch {
      throw new UnauthorizedException('Token refresh failed');
    }
  }
}
