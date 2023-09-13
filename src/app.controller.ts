import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOauthGuard } from './google-auth.gaurd';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/auth/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    req.session.user = user;

    res.redirect(`http://localhost:5173/home?user=${JSON.stringify(user)}`);
  }
}
