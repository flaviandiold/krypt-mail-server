import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailRepository } from './mail.repository';
import { plainToInstance } from 'class-transformer';
import { MailSchema } from './mail.schema';
import { Includeable, WhereOptions } from 'sequelize';

@Injectable()
export class MailService {
  constructor(private repo: MailRepository) {}

  async get(messageId: string, options?, joinOptions?: Includeable[]) {
    try {
      const data = await this.repo.get(messageId, options, joinOptions);
      return this.convertToDto(data);
    } catch (error) {
      throw error;
    }
  }

  async getMailData(token: any) {
    console.log('comes here');
    try {
      const data = await this.repo.getAccessDetailsOf(token);
      if (data.verified === true) {
        console.log('verified');
        const forwardDetails = await this.repo.getForwardableDetailsById(
          data.fid,
        );
        const mailData = await this.repo.getMailById(forwardDetails.mid);
        return { ...this.convertToDto(mailData), verified: true };
      } else if (data.verified === false) {
        console.log('not verified');
        throw new HttpException(
          'You are not allowed to view this mail',
          HttpStatus.FORBIDDEN,
        );
      } else {
        console.log('not yet verified');
        return { verified: false };
      }
    } catch (error) {
      throw error;
    }
  }

  private convertToDto(data) {
    const dto = plainToInstance(MailSchema, data.toJSON() as MailSchema);
    return dto;
  }

  async store(payload: {
    messageId: string;
    to: string;
    content: string;
    depth: number;
    forwardable: boolean;
    timecode: number;
    timeframe: number;
  }) {
    try {
      const { ...data } = payload;
      const mail = await this.repo.store('Mail', data);
      if (!payload.forwardable)
        await this.repo.store('Forwardable', {
          mid: mail.id,
          to: payload.to,
        });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async storeToken(messageId: any, token: any) {
    try {
      const mail = await this.repo.get(messageId, {
        attributes: ['id', 'forwardable'],
      });
      console.log(mail);
      if (mail.forwardable) {
        throw new Error('This mail does not need access');
      }
      const fid = await this.repo.getForwardableDetails(mail.id);
      const data = await this.repo.store('Access', {
        token: token,
        fid: fid.id,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async authenticate(payload: {
    fromAddress: string;
    token: any;
    DKIM: string;
  }) {
    try {
      const accessDetails = await this.repo.getAccessDetailsOf(payload.token);
      const forwardDetails = await this.repo.getForwardableDetailsById(
        accessDetails.fid,
      );
      const mailData = await this.repo.getMailById(forwardDetails.mid);
      if (forwardDetails.to === payload.fromAddress) {
        await this.repo.update(
          'Access',
          { verified: true },
          { id: accessDetails.id },
        );
      } else {
        await this.repo.update(
          'Access',
          { verified: false },
          { id: accessDetails.id },
        );
      }
      return mailData;
    } catch (error) {
      throw error;
    }
  }
}
