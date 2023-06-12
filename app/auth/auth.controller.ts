import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInUserArgs } from 'app/users/models/login.args';
import { SignUpArgs } from 'app/users/models/signup.args';
import { UserModel } from 'app/users/models/user.model';
import { JwtUserResponse } from './models/jwt-response.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() authCredentials: LogInUserArgs,
  ): Promise<JwtUserResponse> {
    return await this.authService.login(authCredentials);
  }

  @Post('register')
  async register(@Body() authCredentials: SignUpArgs): Promise<UserModel> {
    return await this.authService.signup(authCredentials);
  }
}
