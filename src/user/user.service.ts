import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as NodeRSA from 'node-rsa';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const algorithm = 'aes-256-cbc';
const aes_key = Buffer.from('jnvksdbvdvfdvdfvdfvc23r44dfvdfvn');
const iv = Buffer.from('jnvkscsdvsdvdfvn');

@Injectable()
export class UserService {
  constructor(private repo: UserRepository) {}
  async getPublicKey(email: string) {
    const keyDB = await this.repo.getPublicKeyFor(email);
    return { publicKey: keyDB?.key?.publicKey };
  }

  async getPrivateKey(token: string) {
    const keyDB = await this.repo.getPrivateKeyFor(token as uuidv4);
    return { privateKey: keyDB?.key?.privateKey };
  }

  async register(user: { email: string; password: string; token?: string }) {
    let userDB;
    if ((userDB = await this.repo.findByEmail(user.email))) {
      const keyDB = await this.repo.getPrivateKey({ userId: userDB.id });
      return { privateKey: keyDB.privateKey, token: userDB.token };
    }
    user.token = uuidv4();
    console.log(user.token);
    userDB = await this.repo.save('User', user);
    const keyDB = await this.generateKey(userDB.id);
    return { privateKey: keyDB.privateKey, token: userDB.token };
  }

  async generateKey(userId: number) {
    const cipher = crypto.createCipheriv(algorithm, aes_key, iv);
    const key = new NodeRSA();
    key.generateKeyPair();
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
    let encrypted = cipher.update(privateKey, 'utf-8', 'base64url');
    encrypted += cipher.update(
      '92o3ryno2uu0[.rg2l[rgkp02.f,jp9u23yho8fg237n',
      'utf-8',
      'base64url',
    );
    encrypted += cipher.final('base64url');
    const keysDB = await this.repo.save('Keys', {
      userId,
      privateKey: encrypted,
      publicKey,
    });
    return keysDB;
  }
}
