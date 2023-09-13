import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  googleLogin(req) {
    if (!req.user) {
      return 'no user from google';
    }

    return {
      message: 'user info from google',
      user: req.user,
    };
  }
}
