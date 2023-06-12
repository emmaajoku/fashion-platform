import { NotFoundException } from '@nestjs/common';

export class ItemNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('Item not found!', error);
  }
}
