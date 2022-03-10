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
import { getRepository } from 'typeorm';
import { UserUpdateRequest } from '../user_update_request/user_update_request.entity';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { SmsService } from '../sms/sms.service';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private forgotService: ForgotService,
    private mailService: MailService,
    private stripeService: StripeService,
    private smsService: SmsService,
  ) {}

  async validateMobielLogin(
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

  async forgotPassword(dto: AuthForgotPasswordDto) {
    let user = null;
    if (dto.email) {
      user = await this.usersService.findOneEntity({
        where: {
          email: dto.email,
        },
      });
    }
    if (!user && dto.phone_no) {
      user = await this.usersService.findOneEntity({
        where: {
          phone_no: dto.phone_no,
        },
      });
    }

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'user does not exists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      let hash = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
      hash = await this.checkIfExistHashOrGenerate(hash);
      const forgot = await this.forgotService.findOneEntity({
        where: {
          user: user,
        },
      });
      if (forgot) {
        forgot.hash = hash;
        await forgot.save();
      } else {
        await this.forgotService.saveEntity({
          hash,
          user,
        });
      }
      if (dto.email) {
        return await this.mailService.forgotPassword({
          to: dto.email,
          name: user.username,
          data: {
            hash,
          },
        });
      } else {
        return await this.smsService.send({
          phone_number: user.phone_no.toString(),
          message:
            'You have requested reset password on Beat Bridge App. Please use this code to reset password:' +
            hash,
        });
      }
    }
  }
  async checkIfExistHashOrGenerate(hash) {
    const forgot = await this.forgotService.findOneEntity({
      where: {
        hash: hash,
      },
    });
    if (forgot) {
      hash = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
    }
    return hash;
  }
  async resetPassword(dto: AuthResetPasswordDto) {
    try {
      let user = null;
      const forgot = await this.forgotService.findOneEntity({
        where: {
          hash: dto.hash,
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

      user = forgot.user;
      user.password = dto.password;
      await user.save();
      await this.forgotService.softDelete(forgot.id);
      return {
        status: HttpStatus.OK,
        sent_data: dto,
        response: {
          data: {
            details: 'Successfully updated',
          },
        },
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        sent_data: dto,
        response: {
          data: {
            details: 'Something went wrong: ' + error.message,
          },
        },
      };
    }
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

  async confirmChanges(hash: string) {
    try {
      const userUpdateRequest = await getRepository(UserUpdateRequest)
        .createQueryBuilder('user_update_request')
        .where('user_update_request.hash = :hash', { hash: hash })
        .getOne();
      if (!userUpdateRequest) {
        return {
          status: HttpStatus.BAD_REQUEST,
          sent_data: hash,
          response: {
            message: 'Hash not found',
          },
        };
      }
      const user = await this.usersService.findOne({
        where: {
          id: userUpdateRequest.user_id,
        },
      });
      if (!user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          sent_data: hash,
          response: {
            message: 'No User to update:' + userUpdateRequest.user_id,
          },
        };
      }
      user.password = userUpdateRequest.password;
      user.username = userUpdateRequest.username;
      user.email = userUpdateRequest.email;
      user.phone_no = userUpdateRequest.phone_no;
      user.password = userUpdateRequest.password;
      await user.save();

      await getRepository(UserUpdateRequest)
        .createQueryBuilder('user_update_request')
        .delete()
        .where('user_update_request.user_id = :user_id', {
          user_id: userUpdateRequest.user_id,
        })
        .execute();
      return {
        status: HttpStatus.OK,
        sent_data: hash,
        response: {
          data: user,
          message: 'Successfully Updated',
        },
      };
    } catch (e) {
      return {
        status: HttpStatus.BAD_REQUEST,
        sent_data: hash,
        response: {
          message: 'error:' + e.getMessage(),
        },
      };
    }
  }
}
