import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CustomerGuard extends AuthGuard('customer') {
  getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }
}
