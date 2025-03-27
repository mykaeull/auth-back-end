import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth-guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(data);

    res.cookie('jwt', result.access_token, {
      httpOnly: true,
      sameSite: 'lax', // ou 'none' se estiver em domínios diferentes
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    return result.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return {
      message: 'Usuário autenticado com sucesso',
      user: req.user, // ← contém { userId, email } do payload JWT
    };
  }
}
