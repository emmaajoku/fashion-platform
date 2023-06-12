import { NotFoundException } from '@nestjs/common';
import { ShowController } from './show.controller';
import { OrderService } from 'app/order/order.service';
import { ShowService } from './show.service';
import { ItemService } from 'app/item/item.service';
import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { Item, Order, Show } from '@prisma/client';

describe('ShowController', () => {
  let showController: ShowController;
  let orderService: OrderService;
  let showService: ShowService;
  let itemService: ItemService;
  let prismaDatabaseService: PrismaDatabaseService;

  beforeEach(() => {
    orderService = new OrderService(prismaDatabaseService);
    showService = new ShowService(prismaDatabaseService);
    itemService = new ItemService(prismaDatabaseService);
    showController = new ShowController(showService, itemService, orderService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('buyItem', () => {
    it('should create an order for the given showId and itemId', async () => {
      const createOrderMock = jest
        .spyOn(orderService, 'createOrder')
        .mockResolvedValue({
          id: 1,
          quantity: 1,
          itemId: 1,
          showId: 1,
        } as Order);

      const order = await showController.buyItem(1, 1);

      expect(createOrderMock).toHaveBeenCalledWith(1, 1, 1);
      expect(order).toEqual({ id: 1, quantity: 1, itemId: 1, showId: 1 });
    });
  });

  describe('getSoldItemsByShow', () => {
    it('should return an array of sold items for the given showId', async () => {
      const getSoldItemsByShowMock = jest
        .spyOn(orderService, 'getSoldItemsByShow')
        .mockResolvedValue([
          { id: 1, quantity: 1 },
          { id: 2, quantity: 2 },
        ]);

      const soldItems = await showController.getSoldItemsByShow(1);

      expect(getSoldItemsByShowMock).toHaveBeenCalledWith(1, undefined);
      expect(soldItems).toEqual([
        { id: 1, quantity: 1 },
        { id: 2, quantity: 2 },
      ]);
    });

    it('should return an array of sold items for the given showId and itemId', async () => {
      const getSoldItemsByShowMock = jest
        .spyOn(orderService, 'getSoldItemsByShow')
        .mockResolvedValue([{ id: 1, quantity: 1 }]);

      const soldItems = await showController.getSoldItemsByShow(1, 1);

      expect(getSoldItemsByShowMock).toHaveBeenCalledWith(1, 1);
      expect(soldItems).toEqual([{ id: 1, quantity: 1 }]);
    });

    it('should throw an error if an error occurs while retrieving sold items', async () => {
      const getSoldItemsByShowMock = jest
        .spyOn(orderService, 'getSoldItemsByShow')
        .mockRejectedValue(new Error('An error occurred'));

      await expect(showController.getSoldItemsByShow(1)).rejects.toThrowError(
        'An error occurred while retrieving sold items',
      );

      expect(getSoldItemsByShowMock).toHaveBeenCalledWith(1, undefined);
    });
  });

  describe('showOrders', () => {
    it('should return an array of orders for the given showId', async () => {
      const getOrdersByShowMock = jest
        .spyOn(orderService, 'getOrdersByShow')
        .mockResolvedValue([
          { id: 1, quantity: 1, itemId: 1, showId: 1 },
          { id: 2, quantity: 2, itemId: 2, showId: 1 },
        ] as Order[]);

      const orders = await showController.showOrders(1);

      expect(getOrdersByShowMock).toHaveBeenCalledWith(1);
      expect(orders).toEqual([
        { id: 1, quantity: 1, itemId: 1, showId: 1 },
        { id: 2, quantity: 2, itemId: 2, showId: 1 },
      ]);
    });
  });

  describe('show', () => {
    it('should return the show with showItems and orders for the given showId', async () => {
      const getShowByIdMock = jest
        .spyOn(showService, 'getShowById')
        .mockResolvedValue({ id: 1, name: 'Show 1' } as Show);
      const getShowItemsMock = jest
        .spyOn(showService, 'getShowItems')
        .mockResolvedValue([{ id: 1, itemName: 'Item 1' } as Item]);
      const getShowOrdersMock = jest
        .spyOn(showService, 'getShowOrders')
        .mockResolvedValue([{ id: 1 } as Item]);

      const show = await showController.show(1);

      expect(getShowByIdMock).toHaveBeenCalledWith(1);
      expect(getShowItemsMock).toHaveBeenCalledWith(1);
      expect(getShowOrdersMock).toHaveBeenCalledWith(1);
      expect(show).toEqual({
        id: 1,
        name: 'Show 1',
        showItems: [{ id: 1, name: 'Item 1' }],
        orders: [{ id: 1, quantity: 1 }],
      });
    });

    it('should throw a NotFoundException if the show is not found', async () => {
      jest.spyOn(showService, 'getShowById').mockResolvedValue(null);

      await expect(() => showController.show(1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
