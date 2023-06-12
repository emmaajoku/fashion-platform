import { ItemNotFoundException } from 'app/exceptions';
import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prismaDatabaseService: PrismaDatabaseService) {}

  async createOrder(
    quantity: number,
    itemId: number,
    showId: number,
  ): Promise<Order> {
    const item = await this.prismaDatabaseService.item.findUnique({
      where: { id: +itemId },
    });

    if (!item) {
      throw new ItemNotFoundException('Item not found');
    }

    if (item?.quantity === 0) {
      throw new BadRequestException('Item is out stock');
    }

    if (item?.quantity < quantity) {
      throw new BadRequestException('Insufficient quantity');
    }

    const updatedItem = await this.prismaDatabaseService.item.update({
      where: { id: +itemId },
      data: { quantity: item.quantity - quantity },
    });

    const order = await this.prismaDatabaseService.order.create({
      data: {
        quantity,
        item: {
          connect: { id: +itemId }, // Connect to an existing item using its ID
        },
        show: {
          connectOrCreate: {
            where: { id: +showId }, // Assume 1 as the ID for the show
            create: { id: +showId }, // Set the ID as 1 when creating a new show
          },
        },
      },
      include: {
        item: true,
        show: true,
      },
    });

    return order;
  }

  async getOrdersByShow(showId: number): Promise<Order[]> {
    const orders = await this.prismaDatabaseService.order.findMany({
      where: { showId: +showId },
      include: {
        item: true,
        show: true,
      },
    });

    return orders;
  }

  async getSoldItemsByShow(showId: number, itemId?: number): Promise<any[]> {
    try {
      let query;

      if (itemId) {
        // Fetch information for a specific item sold by the show
        query = {
          where: {
            showId: showId,
            itemId: itemId,
          },
        };
      } else {
        // Fetch information for all items sold by the show
        query = {
          where: {
            showId: showId,
          },
        };
      }

      const soldItems: Order[] =
        await this.prismaDatabaseService.order.findMany({
          ...query,
          include: {
            item: true,
          },
        });

      const response = await Promise.all(
        soldItems.map(async (order) => {
          const item = await this.prismaDatabaseService.item.findFirst({
            where: { id: order.itemId },
          });

          return {
            itemID: order.itemId,
            itemName: item.itemName,
            quantity_sold: order.quantity,
          };
        }),
      );

      return response;
    } catch (error) {
      throw new Error('An error occurred while retrieving sold items');
    }
  }
}
