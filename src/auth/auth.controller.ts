// Purpose: Exposes API endpoints for registration, login, and token refresh.
// References: https://docs.nestjs.com/controllers, https://docs.nestjs.com/security/authentication
import { Controller, Post, Body, UnauthorizedException, Logger, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

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

    const tokens = await this.authService.login(user);
    return {
      message: 'Login successful',
      ...tokens,
    };
  }

  // POST /auth/refresh
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const result = await this.authService.refreshTokens(body.refreshToken);
    return {
      message: 'Access token refreshed',
      ...result,
    };
  }
  
  // GET /auth/hello
    @UseGuards(JwtAuthGuard
    )
    @Get('hello')
  getHello(@Req() req: Request) {
      return {
          message: `Hello from AuthController. You have accessed a protected route. Yay!`,
      };
    }
}