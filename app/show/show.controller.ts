import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Order, Show } from '@prisma/client';
import { ItemService } from 'app/item/item.service';
import { OrderService } from 'app/order/order.service';
import { ShowService } from './show.service';

@Controller('show')
export class ShowController {
  constructor(
    private readonly showService: ShowService,
    private readonly itemService: ItemService,
    private readonly orderService: OrderService,
  ) {}

  @Post(':showId/buy_item/:itemId')
  async buyItem(
    @Param('showId') showId: number,
    @Param('itemId') itemId: number,
  ): Promise<Order> {
    return await this.orderService.createOrder(1, itemId, showId);
  }

  @Get(':showId/sold_items/:itemId?')
  async getSoldItemsByShow(
    @Param('showId') showId: number,
    @Param('itemId') itemId?: number,
  ): Promise<Order[]> {
    try {
      const soldItems = await this.orderService.getSoldItemsByShow(
        Number(showId),
        itemId ? Number(itemId) : undefined,
      );
      return soldItems;
    } catch (error) {
      throw new Error('An error occurred while retrieving sold items');
    }
  }

  @Get(':showId/show_orders')
  async showOrders(@Param('showId') showId: number): Promise<Order[]> {
    return this.orderService.getOrdersByShow(showId);
  }

  @Get(':showId/show')
  async show(@Param('showId') showId: number): Promise<Show> {
    const show: Show = await this.showService.getShowById(showId);
    if (!show) {
      throw new NotFoundException('Show not found');
    }

    show['showItems'] = await this.showService.getShowItems(showId);
    show['orders'] = await this.showService.getShowOrders(showId);

    return show;
  }
}
