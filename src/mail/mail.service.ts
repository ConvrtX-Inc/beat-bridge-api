import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';

@Injectable()
export class MailService {
  constructor(
    private i18n: I18nService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject:
        (await this.i18n.t('common.welcome_to')) +
        ' ' +
        this.configService.get('app.name') +
        ' ' +
        mailData.name +
        '! ' +
        (await this.i18n.t('common.confirm_your_email')),
      text: `${this.configService.get('app.frontendDomain')}/confirm-email/${
        mailData.data.hash
      } ${await this.i18n.t('common.confirmEmail')}`,
      template: './activation',
      context: {
        title: await this.i18n.t('common.confirmEmail'),
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/${
          mailData.data.hash
        }`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        client_name: mailData.name,
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
      },
    });
  }

  async forgotPassword(mailData: MailData<{ hash: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      from: {
        name: this.configService.get('app.name'),
        address: 'mailtrap@beatbridge.app',
      },
      subject: await this.i18n.t('common.resetPassword'),
      text: `${this.configService.get('app.frontendDomain')}/password-change/${
        mailData.data.hash
      } ${await this.i18n.t('common.resetPassword')}`,
      template: './reset-password',
      context: {
        title: await this.i18n.t('common.resetPassword'),
        url: `${this.configService.get('app.frontendDomain')}/password-change/${
          mailData.data.hash
        }`,
        actionTitle: await this.i18n.t('common.resetPassword'),
        app_name: this.configService.get('app.name'),
        text1: 'Hello ' + mailData.name,
        text2:
          'You have requested reset password on Beat Bridge App. Please use this code to reset password:' +
          mailData.data.hash,
        text3: '',
        text4: await this.i18n.t('reset-password.text4'),
      },
    });
  }

  async updateProfile(mailData: MailData<{ hash: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      from: {
        name: this.configService.get('app.name'),
        // Domain Changed
        address: 'mailtrap@beatbridge.app',
      },
      subject: 'Update profile confirmation',
      text: `${this.configService.get(
        'app.backendDomain',
      )}api/v1/auth/confirm-changes/${mailData.data.hash} Confirm`,
      template: './update-profile',
      context: {
        title: await this.i18n.t('common.confirmEmail'),
        url: `${this.configService.get(
          'app.backendDomain',
        )}api/v1/auth/confirm-changes/${mailData.data.hash}`,
        actionTitle: 'Confirm Update',
        app_name: this.configService.get('app.name'),
        client_name: mailData.name,
        text1: 'Hi, ',
        text2: 'We received a request to update your information on',
        text3: 'Click to confirm update',
      },
    });
  }

  async reisterMail(mailData) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject:
        (await this.i18n.t('common.welcome_to')) +
        ' ' +
        this.configService.get('app.name') +
        ' ' +
        mailData.name +
        '! ' +
        (await this.i18n.t('common.confirm_your_email')),
      text: `${this.configService.get('app.frontendDomain')}/confirm-email/${
        mailData.to
      } ${await this.i18n.t('common.confirmEmail')}`,
      template: './activation',
      context: {
        title: await this.i18n.t('common.confirmEmail'),
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/${
          mailData.to
        }`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        client_name: mailData.name,
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
      },
    });
  }
}
