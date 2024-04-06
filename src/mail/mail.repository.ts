import { Access } from './access.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Includeable, Op, WhereOptions } from 'sequelize';

@Injectable()
export class MailRepository {
  constructor(@Inject('SEQUELIZE') private database) {}

  async getForwardableDetails(id: any) {
    try {
      const data = await this.database.models.Forwardable.findOne({
        where: { mid: id },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getMailById(mid: any) {
    try {
      const data = await this.database.models.Mail.findOne({
        where: { id: mid },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(model: string, payload, where: WhereOptions) {
    try {
      await this.database.models[model].update(payload, {
        where: { ...where },
      });
    } catch (error) {
      throw error;
    }
  }
  async getForwardableDetailsById(fid: any) {
    try {
      const data = await this.database.models.Forwardable.findOne({
        where: { id: fid },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async get(messageId: string, options = {}, joinOptions: Includeable[] = []) {
    try {
      const data = await this.database.models.Mail.findOne({
        where: {
          messageId,
          [Op.or]: [
            {
              validTill: {
                [Op.is]: null,
              },
            },
            {
              validTill: {
                [Op.gt]: new Date(Date.now()),
              },
            },
          ],
        },
        ...options,
        include: [...joinOptions],
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAccessDetailsOf(token: any) {
    try {
      const data = await this.database.models.Access.findOne({
        where: { token },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async store(model: string, payload: any) {
    try {
      const data = await this.database.models[model].create(payload);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
