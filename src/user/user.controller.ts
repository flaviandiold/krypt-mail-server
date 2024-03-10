import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}
  @Post('/register')
  async login(@Body() user: { email: string; password: string }) {
    const key = await this.service.register(user);
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
}
