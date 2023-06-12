import { OrderModel } from 'app/order/entities/order.entity';
import { ItemModel } from 'app/item/entities/item.entity';
import { ShowModel } from './entities/show.entity';
import { ItemNotFoundException } from './../exceptions/item-not-found-exception';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ItemService } from '../item/item.service';
import { OrderService } from '../order/order.service';
import { ShowService } from './show.service';
import { Item, Order, Show } from '@prisma/client';

@Resolver(() => ShowModel)
export class ShowResolver {
  constructor(
    private readonly showService: ShowService,
    private readonly itemService: ItemService,
    private readonly orderService: OrderService,
  ) {}

  @Mutation(() => Boolean)
  async buyItem(
    @Args('showId') showId: number,
    @Args('itemId') itemId: number,
  ): Promise<boolean> {
    const item = await this.itemService.getItemById(itemId);

    if (!item || item.quantity === 0) {
      throw new ItemNotFoundException();
    }

    await this.orderService.createOrder(1, itemId, showId);

    return true;
  }

  @Query(() => [ItemModel])
  async soldItems(
    @Args('showId') showId: number,
    @Args('itemId', { nullable: true }) itemId?: number,
  ): Promise<Item[]> {
    if (itemId) {
      const item = await this.itemService.getItemById(itemId);
      return item ? [item] : [];
    }

    return this.itemService.getItemsByShow(showId);
  }

  @Query(() => [OrderModel])
  async showOrders(@Args('showId') showId: number): Promise<Order[]> {
    return this.orderService.getOrdersByShow(showId);
  }

  @Query(() => ShowModel)
  async show(@Args('showId') showId: number): Promise<Show> {
    const show: Show = await this.showService.getShowById(showId);
    if (!show) {
      throw new Error('Show not found');
    }

    show['showItems'] = await this.showService.getShowItems(showId);
    show['orders'] = await this.showService.getShowOrders(showId);

    return show;
  }

  @Mutation(() => ItemModel)
  async inventory(
    @Args('itemName') itemName: string,
    @Args('quantity') quantity: number,
  ): Promise<Item> {
    const item = await this.itemService.createOrUpdateItem(itemName, quantity);
    return item;
  }
}
