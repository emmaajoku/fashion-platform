import { OrderService } from './order.service';
import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { ItemNotFoundException } from 'app/exceptions';
import { BadRequestException } from '@nestjs/common';

describe('OrderService', () => {
  let orderService: OrderService;
  let prismaDatabaseService: PrismaDatabaseService;

  beforeEach(() => {
    prismaDatabaseService = new PrismaDatabaseService();
    orderService = new OrderService(prismaDatabaseService);
  });

  describe('createOrder', () => {
    it('should create a new order when the item exists and has sufficient quantity', async () => {
      // Mocking the PrismaDatabaseService methods
      const findUniqueMock = jest
        .spyOn(prismaDatabaseService.item, 'findUnique')
        .mockResolvedValue({ id: 1, quantity: 10 });
      const updateMock = jest
        .spyOn(prismaDatabaseService.item, 'update')
        .mockResolvedValue({ id: 1, quantity: 5 });
      const createMock = jest
        .spyOn(prismaDatabaseService.order, 'create')
        .mockResolvedValue({
          id: 1,
          quantity: 2,
          item: { id: 1 },
          show: { id: 1 },
        });

      const order = await orderService.createOrder(2, 1, 1);

      expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(updateMock).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 8 },
      });
      expect(createMock).toHaveBeenCalledWith({
        data: {
          quantity: 2,
          item: { connect: { id: 1 } },
          show: { connectOrCreate: { where: { id: 1 }, create: { id: 1 } } },
        },
        include: { item: true, show: true },
      });
      expect(order).toEqual({
        id: 1,
        quantity: 2,
        item: { id: 1 },
        show: { id: 1 },
      });
    });

    it('should throw ItemNotFoundException when the item does not exist', async () => {
      const findUniqueMock = jest
        .spyOn(prismaDatabaseService.item, 'findUnique')
        .mockResolvedValue(null);

      await expect(orderService.createOrder(2, 1, 1)).rejects.toThrow(
        ItemNotFoundException,
      );
      expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw BadRequestException when the item is out of stock', async () => {
      const findUniqueMock = jest
        .spyOn(prismaDatabaseService.item, 'findUnique')
        .mockResolvedValue({ id: 1, quantity: 0 });

      await expect(orderService.createOrder(2, 1, 1)).rejects.toThrow(
        BadRequestException,
      );
      expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw BadRequestException when the quantity is greater than the item quantity', async () => {
      const findUniqueMock = jest
        .spyOn(prismaDatabaseService.item, 'findUnique')
        .mockResolvedValue({ id: 1, quantity: 5 });

      await expect(orderService.createOrder(10, 1, 1)).rejects.toThrow(
        BadRequestException,
      );
      expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('getOrdersByShow', () => {
    it('should return an array of orders for the given showId', async () => {
      const findManyMock = jest
        .spyOn(prismaDatabaseService.order, 'findMany')
        .mockResolvedValue([
          {
            id: 1,
            quantity: 2,
            itemId: 1,
            showId: 1,
          },
        ]);

      const orders = await orderService.getOrdersByShow(1);

      expect(findManyMock).toHaveBeenCalledWith({
        where: { showId: 1 },
        include: { item: true, show: true },
      });
      expect(orders).toEqual([
        {
          id: 1,
          quantity: 2,
          itemId: 1,
          showId: 1,
          item: { id: 1, itemName: 'Item 1' },
          show: { id: 1 },
        },
      ]);
    });
  });

  describe('getSoldItemsByShow', () => {
    it('should return an array of sold items for the given showId', async () => {
      const findManyMock = jest
        .spyOn(prismaDatabaseService.order, 'findMany')
        .mockResolvedValue([{ id: 1, quantity: 2, itemId: 1, showId: 1 }]);

      const findFirstMock = jest
        .spyOn(prismaDatabaseService.item, 'findFirst')
        .mockResolvedValue({ id: 1, itemName: 'Item 1', quantity: 10 });

      const soldItems = await orderService.getSoldItemsByShow(1);

      expect(findManyMock).toHaveBeenCalledWith({
        where: { showId: 1 },
        include: { item: true },
      });
      expect(findFirstMock).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(soldItems).toEqual([
        { itemID: 1, itemName: 'Item 1', quantity_sold: 2 },
      ]);
    });

    it('should return an array of sold items for the given showId and itemId', async () => {
      const findManyMock = jest
        .spyOn(prismaDatabaseService.order, 'findMany')
        .mockResolvedValue([{ id: 1, quantity: 2, itemId: 1, showId: 1 }]);

      const findFirstMock = jest
        .spyOn(prismaDatabaseService.item, 'findFirst')
        .mockResolvedValue({ id: 1, itemName: 'Item 1', quantity: 10 });

      const soldItems = await orderService.getSoldItemsByShow(1, 1);

      expect(findManyMock).toHaveBeenCalledWith({
        where: { showId: 1, itemId: 1 },
        include: { item: true },
      });
      expect(findFirstMock).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(soldItems).toEqual([
        { itemID: 1, itemName: 'Item 1', quantity_sold: 2 },
      ]);
    });

    it('should throw an error if an error occurs while retrieving sold items', async () => {
      const findManyMock = jest
        .spyOn(prismaDatabaseService.order, 'findMany')
        .mockRejectedValue(new Error('Database error'));

      await expect(orderService.getSoldItemsByShow(1)).rejects.toThrowError(
        'An error occurred while retrieving sold items',
      );
      expect(findManyMock).toHaveBeenCalledWith({
        where: { showId: 1 },
        include: { item: true },
      });
    });
  });
});
