import { NotFoundException } from '@nestjs/common';

export class ShowNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('Show not found!', error);
  }
}
