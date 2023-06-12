import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { Item } from '@prisma/client';
import { ItemService } from './item.service';

@Controller('inventory')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async inventory(
    @Body('itemName') itemName: string,
    @Body('quantity') quantity: number,
  ): Promise<Item> {
    if (!itemName || !quantity) {
      throw new BadRequestException('itemName and quantity is require');
    }
    const item = await this.itemService.createOrUpdateItem(itemName, quantity);
    return item;
  }
}
