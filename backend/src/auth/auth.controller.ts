/** 
File: auth.controller.ts
Purpose: Expose auth endpoints with clear responses including expiry metadata, for registration, login, token refresh, and "who am I" profile.
Docs: https://docs.nestjs.com/controllers, https://docs.nestjs.com/security/authentication
*/
import { Controller, Post, Body, UnauthorizedException, Logger, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Request } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { UsersService } from 'src/users/users.service';
import type { JwtPayload } from './types/jwt-payload.type';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  // inject UsersService so we can fetch the full user
  constructor(private authService: AuthService, private usersService: UsersService) { }

  // POST /auth/register
  @Post('register')
  async register(@Body() body: { username: string; email: string; password: string }) {
    this.logger.debug(`Login attempt for: ${body.email}`);
    const user = await this.authService.register(body.username, body.email, body.password);
    return {
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email },
    };
  }

  // POST /auth/login
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // tokens includes { accessToken, refreshToken, meta: { access, refresh } }
    const tokens = await this.authService.login(user);
    return {
      message: 'Login successful',
      ...tokens,
    };
  }

  // POST /auth/refresh
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    // result includes { accessToken, meta: { access } }
    const result = await this.authService.refreshTokens(body.refreshToken);
    return {
      message: 'Access token refreshed',
      ...result,
    };
  }
  
  //GET /auth/me
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() payload: JwtPayload) {
    // JwtStrategy.validate() returns { userId, username, email }
    const user = await this.usersService.findById(payload.userId);
    
    // safety: if table returns no user (null), though this should not happen
    if (!user) {
      throw new UnauthorizedException('User not found');
    };
    // return a trimmed user profile (never leak passwordHash, refreshTokenHash, etc)
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  // GET /auth/hello
  @UseGuards(JwtAuthGuard)
  @Get('hello')
  getHello(@Req() req: Request) {
    return {
      message: `Hello from AuthController. You have accessed a protected route. Yay!`,
    };
  }
}