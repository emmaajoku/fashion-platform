import { InternalErrorException } from './../exceptions/internal-error-exception';
import {
  BadRequestException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { PrismaDatabaseService } from '../databases/prisma-database.service';
import { User } from '@prisma/client';
import { UserNotFoundException } from 'app/exceptions/user-notfound-exception';
import { IncorrectCredentialsException } from 'app/exceptions';
import { LogInUserArgs } from './models/login.args';
import { matchPasswordHash } from 'app/utils/password-hash';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateUserDto } from './models/create-user.args';

@Injectable()
export class UsersService {
  constructor(
    private databaseService: PrismaDatabaseService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findUser(login: LogInUserArgs): Promise<User> {
    try {
      const singleUser = await this.databaseService.user.findMany({
        where: {
          emailAddress: login.emailAddress,
        },
      });

      if (!singleUser.length) {
        throw new UserNotFoundException();
      }
      const matchPasswordHashPassword = singleUser[0].password;

      const validPassword: boolean = await matchPasswordHash(
        login.password,
        matchPasswordHashPassword,
      );

      if (!!singleUser.length || !validPassword) {
        throw new IncorrectCredentialsException(`Your password is incorrect`);
      }

      return singleUser[0];
    } catch (err) {
      throw new BadRequestException('incorrect credentials!');
    }
  }

  async findUserById(userId: number): Promise<User> {
    try {
      const singleUser = await this.databaseService.user.findFirst({
        where: { userId },
      });
      if (!singleUser) throw new UserNotFoundException();
      return singleUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findUserByEmail(emailAddress: string): Promise<User> {
    try {
      const singleUser = await this.databaseService.user.findFirst({
        where: { emailAddress: emailAddress },
      });

      if (!singleUser) throw new UserNotFoundException();
      return singleUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   *
   * @param createUserArgs
   * @returns
   */
  async createUser(createUserArgs: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.databaseService.user.findFirst({
        where: {
          emailAddress: createUserArgs.emailAddress,
        },
      });

      if (existingUser) {
        throw new ConflictException(
          'User with this email address already exists',
        );
      }

      const newUser = await this.databaseService.user.create({
        data: { ...createUserArgs },
      });

      return newUser;
    } catch (err) {
      throw new InternalErrorException('Failed to create user');
    }
  }
}
