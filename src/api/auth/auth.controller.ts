import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { Request } from 'express';

import { JwtAuthGuard } from '@src/common';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ operationId: 'google', summary: 'auth google' })
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {}

  @ApiOperation({ operationId: 'google-redirect', summary: 'auth google redirect' })
  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }

  @ApiOperation({ operationId: 'google-scope', summary: 'auth google scope' })
  @Get('/google/scope')
  async getGoogleScope() {
    return this.authService.getAppScope || [];
  }

  @ApiOperation({ operationId: 'profile', summary: 'auth profile' })
  @ApiBearerAuth()
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    const id = req.user!.id;
    return this.authService.getProfile(id);
  }
}
