import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { Injectable, Logger } from '@nestjs/common';
import { Item } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private readonly prismaDatabaseService: PrismaDatabaseService) {}

  async createOrUpdateItem(itemName: string, quantity: number): Promise<Item> {
    const itemNameObj = await this.getItemName(itemName);
    let qty: number;
    if (itemNameObj) {
      qty = itemNameObj.quantity + quantity;
    }

    const item = await this.prismaDatabaseService.item.upsert({
      where: { itemName: itemName }, // Use the correct unique identifier field
      update: { quantity: qty },
      create: { itemName, quantity },
    });

    return item;
  }

  async getItemById(itemId: number): Promise<Item | null> {
    const item = await this.prismaDatabaseService.item.findUnique({
      where: { id: itemId },
    });

    return item;
  }

  async getItemsByShow(showId: number): Promise<Item[]> {
    const items = await this.prismaDatabaseService.item.findMany({
      where: { id: showId },
    });

    return items;
  }

  async getItemName(itemName: string): Promise<Item | null> {
    const item = await this.prismaDatabaseService.item.findUnique({
      where: { itemName: itemName },
    });

    return item;
  }
}
