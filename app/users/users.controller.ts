import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from 'app/users/models/user.model';
import { LogInUserArgs } from './models/login.args';
import { CreateUserArgs } from './models/create-user.args';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('login/:login')
  async findUser(@Param('login') login: LogInUserArgs): Promise<UserModel> {
    return this.usersService.findUser(login);
  }

  @Get(':userId')
  async findUserById(@Param('userId') userId: number): Promise<UserModel> {
    return this.usersService.findUserById(userId);
  }

  @Get('email/:emailAddress')
  async findUserByEmail(
    @Param('emailAddress') emailAddress: string,
  ): Promise<UserModel> {
    return this.usersService.findUserByEmail(emailAddress);
  }

  @Post()
  async createUser(@Body() createUserArgs: CreateUserArgs): Promise<UserModel> {
    return this.usersService.createUser(createUserArgs);
  }
}
