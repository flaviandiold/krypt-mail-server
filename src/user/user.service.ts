import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as openpgp from 'openpgp';
// import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// const algorithm = 'aes-256-cbc';
// const aes_key = Buffer.from('jnvksdbvdvfdvdfvdfvc23r44dfvdfvn');
// const iv = Buffer.from('jnvkscsdvsdvdfvn');

@Injectable()
export class UserService {
  constructor(
    private repo: UserRepository,
    private jwtService: JwtService,
  ) {}
  async getPublicKey(email: string) {
    const keyDB = await this.repo.getPublicKeyFor(email);
    return { publicKey: keyDB?.key?.publicKey };
  }

  async getPrivateKey(token: string) {
    const keyDB = await this.repo.getPrivateKeyFor(token as uuidv4);
    return { privateKey: keyDB?.key?.privateKey };
  }

  async findUser(email: string) {
    try {
      const user = await this.repo.findByEmail(email);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(user: { email: string; password: string }) {
    try {
      const userDB = await this.findUser(user.email);
      if (!userDB) throw new NotFoundException('User not registered');
      const keyDB = await this.repo.getPrivateKey({ userId: userDB.id });
      return { privateKey: keyDB.privateKey, token: userDB.token };
    } catch (error) {
      throw error;
    }
  }

  async register(user: {
    email: string;
    password: string;
    passphrase: string;
    token?: string;
  }) {
    let userDB;
    if ((userDB = await this.findUser(user.email))) {
      const keyDB = await this.repo.getPrivateKey({ userId: userDB.id });
      return { privateKey: keyDB.privateKey, token: userDB.token };
    }
    user.token = uuidv4();
    userDB = await this.repo.save('User', user);
    const keyDB = await this.generateKey(
      userDB.id,
      user.email,
      user.passphrase,
    );
    return { privateKey: keyDB.privateKey, token: userDB.token };
  }

  async setPublicKey(email: string, publicKey: string) {
    try {
      const user = await this.repo.save('User', { email: email, password: '' });
      if (!user) {
        throw new Error('User was not created');
      }
      publicKey = publicKey.replace(
        /\s+(?=(?:[^-]*-----END PGP PUBLIC KEY BLOCK-----))/g,
        '\n',
      );
      const publicKeyBlocks = publicKey.split(
        '-----BEGIN PGP PUBLIC KEY BLOCK-----',
      );
      publicKey =
        '-----BEGIN PGP PUBLIC KEY BLOCK-----' + '\n\n' + publicKeyBlocks[1];
      console.log(publicKey);
      const success = await this.repo.save('Keys', {
        userId: user.id,
        publicKey: publicKey,
      });
      return success;
    } catch (error) {
      throw error;
    }
  }

  async generateJwtToken(
    payload: any,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    try {
      const jwt = await this.jwtService.signAsync(payload, {
        secret,
        expiresIn,
      });
      return jwt;
    } catch (error) {
      throw error;
    }
  }

  async verifyJwtToken(token: string, secret?: string): Promise<any> {
    try {
      const isVerified = await this.jwtService.verifyAsync(token, { secret });
      return isVerified;
    } catch (error) {
      throw error;
    }
  }

  async generateKey(userId: number, email: string, passphrase: string) {
    // const cipher = crypto.createCipheriv(algorithm, aes_key, iv);
    const { privateKey: privateKeyArmored, publicKey: publicKeyArmored } =
      await openpgp.generateKey({
        type: 'rsa', // Type of the key
        rsaBits: 4096, // RSA key size (defaults to 4096 bits)
        userIDs: [{ email: email }], // you can pass multiple user IDs
        passphrase: passphrase,
      });

    // let encrypted = cipher.update(privateKey, 'utf-8', 'base64url');
    // encrypted += cipher.update(
    //   '92o3ryno2uu0[.rg2l[rgkp02.f,jp9u23yho8fg237n',
    //   'utf-8',
    //   'base64url',
    // );
    // encrypted += cipher.final('base64url');
    const keysDB = await this.repo.save('Keys', {
      userId,
      privateKey: privateKeyArmored,
      publicKey: publicKeyArmored,
    });
    return keysDB;
  }
}
