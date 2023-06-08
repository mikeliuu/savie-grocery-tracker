import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: () => {
        const { MAIL_HOST, MAIL_USER, MAIL_PASSWORD, MAIL_FROM } = process.env;

        return {
          transport: {
            host: MAIL_HOST,
            secure: false,
            auth: {
              user: MAIL_USER,
              pass: MAIL_PASSWORD,
            },
          },
          defaults: {
            from: `No Reply <${MAIL_FROM}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
