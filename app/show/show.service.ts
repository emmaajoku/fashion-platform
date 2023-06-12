import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { Injectable } from '@nestjs/common';
import { Show, Item } from '@prisma/client';

@Injectable()
export class ShowService {
  constructor(private readonly prismaDatabaseService: PrismaDatabaseService) {}

  async getShowById(showId: number): Promise<Show> {
    const show: Show = await this.prismaDatabaseService.show.findUnique({
      where: { id: showId },
    });

    return show;
  }

  async getShowOrders(showId: number): Promise<Item[]> {
    const orders = await this.prismaDatabaseService.show
      .findUnique({
        where: { id: showId },
      })
      .showItems();
    return orders ?? [];
  }

  async getShowItems(showId: number): Promise<Item[]> {
    const showItems = await this.prismaDatabaseService.show
      .findUnique({
        where: { id: showId },
      })
      .showItems();
    return showItems ?? [];
  }
}
