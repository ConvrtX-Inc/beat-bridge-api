import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthEmailLoginDto,
  AuthEmailLoginUsernameDto,
} from './dtos/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dtos/auth-confirm-email.dto';
import {
  AuthResetPasswordAdminDto,
  AuthResetPasswordDto,
  OtpVerifyDto
} from './dtos/auth-reset-password.dto';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';
import { AuthMobileDto } from './dtos/auth-mobile-login.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) { }

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto);
  }

  //Login using Mobile Number
  @Post('mobile/login')
  @HttpCode(HttpStatus.OK)
  public async login_mobile(@Body() loginDto: AuthMobileDto) {
    return this.service.validateMobielLogin(loginDto);
  }


  @Post('username/login')
  @HttpCode(HttpStatus.OK)
  public async login_username(@Body() loginDto: AuthEmailLoginUsernameDto) {
    return this.service.validateUsernameLogin(loginDto);
  }

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
    return this.service.forgotPassword(forgotPasswordDto);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
    return this.service.resetPassword(resetPasswordDto);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async otpVerify(@Body() dto: OtpVerifyDto) {
    return this.service.otpVerify(dto);
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

  @Get('confirm-changes/:hash')
  @HttpCode(HttpStatus.OK)
  public async confirmChanges(@Param('hash') hash: string) {
    return this.service.confirmChanges(hash);
  }
}

