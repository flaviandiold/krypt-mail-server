import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { v4 as uuidv4 } from 'uuid';
const nodemailer = require('nodemailer');

@Controller('mail')
export class MailController {
  constructor(private service: MailService) {}

  @Get(':messageId')
  async getMail(@Param('messageId') messageId: string) {
    try {
      const data = await this.service.get(messageId);
      if (data.forwardable) return data;
      else return { forwardable: false };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Post()
  async storeMail(
    @Body()
    payload: {
      messageId: string;
      to: string;
      from: string;
      content: string;
      depth: number;
      forwardable: boolean;
      timecode: number;
      timeframe: number;
    },
  ) {
    try {
      await this.service.store(payload);
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }

  @Post('/get-token')
  async getToken(@Body() params) {
    try {
      console.log(params);
      const token = uuidv4();
      await this.service.storeToken(params.messageId, token);
      const payload = {
        token: token,
      };
      return token;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('/request-access')
  async requestAccess(
    @Body() payload: { fromAddress: string; token: any; DKIM: string },
  ) {
    try {
      const mailData = await this.service.authenticate(payload);
      if (!payload.DKIM) {
        const transporter = nodemailer.createTransport({
          auth: {
            user: 'admin@kryptmail.com',
            pass: 'admin',
          },
          tls: {
            rejectUnauthorized: false,
          },
          host: '192.168.43.212',
          port: 465,
          secure: true,
        });
        const mailOptions = {
          from: 'admin@kryptmail.com',
          to: mailData.from,
          subject: 'Security Alert',
          text: `The recent mail you sent to ${mailData.to}, belongs to ${mailData.to.split('@')[1]} server, which is not as secure as it needs to be, there is a small possibility that users may impersonate ${mailData.to} to read your non-forwardable mail`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            transporter.close();
          } else {
            console.log('message sent successfully', info);
            transporter.close();
          }
        });
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('/token/:token')
  async getMailData(@Param('token') token: any) {
    try {
      console.log(token);
      const data = await this.service.getMailData(token);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
