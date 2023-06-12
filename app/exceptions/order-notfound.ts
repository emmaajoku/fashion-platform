import { NotFoundException } from '@nestjs/common';

export class OrderNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('Order not found!', error);
  }
}
