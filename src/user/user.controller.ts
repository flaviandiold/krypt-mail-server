import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}
  @Post('/register')
  async register(
    @Body() user: { email: string; password: string; passphrase: string },
  ) {
    const key = await this.service.register(user);
    return key;
  }

  @Post('/login')
  async login(@Body() user: { email: string; password: string }) {
    const key = await this.service.login(user);
    return key;
  }

  @Post('/private-key/:token')
  async privateKey(@Param('token') token: string) {
    // console.log(token);
    const key = await this.service.getPrivateKey(token);
    return key;
  }

  @Get('/public-key/:email')
  async publicKey(@Param('email') email: string) {
    const key = await this.service.getPublicKey(email);
    return key;
  }

  @Post('/public-key/:email')
  async setPublicKey(
    @Param('email') email: string,
    @Body('publicKey') publicKey: string,
  ) {
    try {
      const success = await this.service.setPublicKey(email, publicKey);
      return { success: success };
    } catch (error) {
      throw error;
    }
  }

  @Post('ip')
  async generateJwt(@Req() req: Request) {
    const token = await this.service.generateJwtToken(
      { ip: req.ip },
      'JSDVLNSFDVNKDFVKNKJDSLCNSD',
      '5m',
    );
  }
}
