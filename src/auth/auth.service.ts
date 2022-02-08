import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';
import {
  AuthEmailLoginDto,
  AuthEmailLoginUsernameDto,
} from './dtos/auth-email-login.dto';
import { AuthUpdateDto } from './dtos/auth-update.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';
import { UsersService } from 'src/users/users.service';
import { ForgotService } from 'src/forgot/forgot.service';
import { MailService } from 'src/mail/mail.service';
import StripeService from '../stripe/stripe.service';
import {AuthResetPasswordAdminDto} from "./dtos/auth-reset-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private forgotService: ForgotService,
    private mailService: MailService,
    private stripeService: StripeService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
  ): Promise<{ token: string; user: User }> {
    const user = await this.usersService.findOneEntity({
      where: {
        email: loginDto.email,
      },
    });

    if (!user.stripe_customer_id) {
      const stripeCustomer = await this.stripeService.createCustomer(
        user.username,
        user.email,
      );
      user.stripe_customer_id = stripeCustomer.id;
    }

    user.latitude = loginDto.latitude;
    user.longitude = loginDto.longitude;
    await user.save();
    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (isValidPassword) {
      const token = await this.jwtService.sign({
        id: user.id,
      });

      return { token, user: user };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async validateUsernameLogin(
    loginDto: AuthEmailLoginUsernameDto,
  ): Promise<{ token: string; user: User }> {
    const user = await this.usersService.findOneEntity({
      where: {
        username: loginDto.username,
      },
    });

    if (!user.stripe_customer_id) {
      const stripeCustomer = await this.stripeService.createCustomer(
        user.username,
        user.email,
      );
      user.stripe_customer_id = stripeCustomer.id;
    }

    user.latitude = loginDto.latitude;
    user.longitude = loginDto.longitude;
    await user.save();

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (isValidPassword) {
      const token = await this.jwtService.sign({
        id: user.id,
      });

      return { token, user: user };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<{ token: string; user: User }> {
    let user: User;
    const socialEmail = socialData.email?.toLowerCase();

    const userByEmail = await this.usersService.findOneEntity({
      where: {
        email: socialEmail,
      },
    });

    user = await this.usersService.findOneEntity({
      where: {
        socialId: socialData.id,
        provider: authProvider,
      },
    });

    if (!user.stripe_customer_id) {
      const stripeCustomer = await this.stripeService.createCustomer(
        user.username,
        user.email,
      );
      user.stripe_customer_id = stripeCustomer.id;
      await user.save();
    }

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.usersService.saveEntity(user);
    } else if (userByEmail) {
      user = userByEmail;
    } else {
      user = await this.usersService.saveEntity({
        email: socialEmail,
        username: socialEmail,
        socialId: socialData.id,
        provider: authProvider,
      });

      user = await this.usersService.findOneEntity({
        where: {
          id: user.id,
        },
      });
    }

    const jwtToken = await this.jwtService.sign({
      id: user.id,
      // role: user.role,
    });

    return {
      token: jwtToken,
      user,
    };
  }

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const stripeCustomer = await this.stripeService.createCustomer(
      dto.username,
      dto.email,
    );
    await this.usersService.saveEntity({
      ...dto,
      email: dto.email,
      phone_no: dto.phone_number,
      username: dto.username,
      stripe_customer_id: stripeCustomer.id,
      hash,
    });

    // await this.mailService.userSignUp({
    //   to: user.email,
    //   name: user.username,
    //   data: {
    //     hash,
    //   },
    // });
  }

  async confirmEmail(hash: string): Promise<void> {
    const user = await this.usersService.findOneEntity({
      where: {
        hash,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.stripe_customer_id) {
      const stripeCustomer = await this.stripeService.createCustomer(
        user.username,
        user.email,
      );
      user.stripe_customer_id = stripeCustomer.id;
    }

    user.hash = null;
    // user.status = plainToClass(Status, {
    //   id: StatusEnum.active,
    // });
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOneEntity({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');
      await this.forgotService.saveEntity({
        hash,
        user,
      });

      await this.mailService.forgotPassword({
        to: email,
        name: user.username,
        data: {
          hash,
        },
      });
    }
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    const forgot = await this.forgotService.findOneEntity({
      where: {
        hash,
      },
    });

    if (!forgot) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = forgot.user;
    user.password = password;
    await user.save();
    await this.forgotService.softDelete(forgot.id);
  }

  async me(user: User): Promise<User> {
    return this.usersService.findOneEntity({
      where: {
        id: user.id,
      },
    });
  }

  async update(user: User, userDto: AuthUpdateDto): Promise<User> {
    if (userDto.password) {
      if (userDto.oldPassword) {
        const currentUser = await this.usersService.findOneEntity({
          where: {
            id: user.id,
          },
        });

        const isValidOldPassword = await bcrypt.compare(
          userDto.oldPassword,
          currentUser.password,
        );

        if (!isValidOldPassword) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                oldPassword: 'incorrectOldPassword',
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              oldPassword: 'missingOldPassword',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    await this.usersService.saveEntity({
      id: user.id,
      ...userDto,
    });

    return this.usersService.findOneEntity({
      where: {
        id: user.id,
      },
    });
  }

  async softDelete(user: User): Promise<void> {
    await this.usersService.softDelete(user.id);
  }

  async resetAdminPassword(dto) {
    const user = await this.usersService.findOneEntity({
      where: {
        email: 'admin@convrtx.com',
      },
    });
    if (!user) {
      return await this.usersService.saveEntity({
        username: 'admin',
        email: 'admin@convrtx.com',
        password: dto.password ?? 'qwerty123',
      });
    } else {
      user.password = dto.password ?? 'qwerty123';
      await user.save();
    }
    return user;
  }

  async generateAdmin() {
    const user = await this.usersService.findOneEntity({
      where: {
        email: 'admin@convrtx.com',
      },
    });
    if (!user) {
      return await this.usersService.saveEntity({
        username: 'admin',
        email: 'admin@convrtx.com',
        password: 'qwerty123',
      });
    }
    return user;
  }
}
