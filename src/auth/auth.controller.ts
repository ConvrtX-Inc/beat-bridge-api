import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {
  AuthEmailLoginDto,
  AuthEmailLoginUsernameDto,
} from './dtos/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dtos/auth-confirm-email.dto';
import {AuthResetPasswordAdminDto, AuthResetPasswordDto} from './dtos/auth-reset-password.dto';
import { AuthUpdateDto } from './dtos/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto);
  }

  @Post('username/login')
  @HttpCode(HttpStatus.OK)
  public async login_username(@Body() loginDto: AuthEmailLoginUsernameDto) {
    return this.service.validateUsernameLogin(loginDto);
  }

  // @Post('admin/email/login')
  // @HttpCode(HttpStatus.OK)
  // public async adminLogin(@Body() loginDTO: AuthEmailLoginDto) {
  //   return this.service.validateLogin(loginDTO, true);
  // }

  @Post('username/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: AuthRegisterLoginDto) {
    return this.service.register(createUserDto);
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto) {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @Get('generate-admin')
  @ApiOperation({ summary: 'Generates default admin' })
  @HttpCode(HttpStatus.OK)
  public async generateAdmin() {
    return this.service.generateAdmin();
  }

  @Post('reset-admin-password')
  @ApiOperation({ summary: 'Reset password for default admin' })
  public async resetAdminPassword(@Body() dto: AuthResetPasswordAdminDto) {
    return this.service.resetAdminPassword(dto);
  }
}
