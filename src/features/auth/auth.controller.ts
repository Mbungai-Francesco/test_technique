import { Controller, Post, Body, Get, UseGuards, Request, Response, HttpCode, HttpStatus } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAuthCookie(res: ExpressResponse, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 * 2, // 2 hours
    });
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.register(registerDto);
    this.setAuthCookie(res, result.accessToken);
    return { user: result.user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.login(loginDto);
    this.setAuthCookie(res, result.accessToken);
    return { user: result.user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Response({ passthrough: true }) res: ExpressResponse) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
