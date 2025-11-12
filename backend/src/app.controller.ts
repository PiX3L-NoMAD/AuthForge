import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @UseGuards(AuthGuard('jwt'))
  @Get('hello')
  hello(@Req() req) {
    return `Hello, ${req.user.username}.`;
  }
}
