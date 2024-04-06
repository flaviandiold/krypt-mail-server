import { Inject, Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';

@Injectable()
export class UserRepository {
  constructor(@Inject('SEQUELIZE') private database) {}
  async getPublicKeyFor(email: string) {
    try {
      const publicKey = await this.database.models.User.findOne({
        include: [
          { model: this.database.models.Keys, attributes: ['publicKey'] },
        ],
        where: {
          email,
        },
      });
      return publicKey;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getPrivateKeyFor(token) {
    try {
      const privateKey = await this.database.models.User.findOne({
        attributes: ['email'],
        include: [
          { model: this.database.models.Keys, attributes: ['privateKey'] },
        ],
        where: {
          token,
        },
      });
      return privateKey;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async setPublicKey(id: number, publicKey: string) {
    try {
      const success = await this.database.models.Keys.create({
        id,
        publicKey,
      });
      if (success) return true;
      else return false;
    } catch (error) {
      throw error;
    }
  }

  async getPrivateKey(where: WhereOptions) {
    try {
      const privateKey = await this.database.models.Keys.findOne({
        where: {
          ...where,
        },
        attributes: ['privateKey'],
      });
      return privateKey;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.database.models.User.findOne({
        where: {
          email,
        },
      });
      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async save(model: string, payload: any) {
    try {
      const result = await this.database.models[model].create(payload);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
