import { NotFoundException } from '@nestjs/common';
import { Order, Show } from '@prisma/client';
import { ItemService } from 'app/item/item.service';
import { OrderService } from 'app/order/order.service';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';

describe('ShowController', () => {
  let showController: ShowController;
  let showService: ShowService;
  let itemService: ItemService;
  let orderService: OrderService;

  beforeEach(() => {
    showService = new ShowService(/* mock dependencies if needed */);
    itemService = new ItemService(/* mock dependencies if needed */);
    orderService = new OrderService(/* mock dependencies if needed */);

    showController = new ShowController(showService, itemService, orderService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('buyItem', () => {
    it('should create an order for the given showId and itemId', async () => {
      const createOrderMock = jest
        .spyOn(orderService, 'createOrder')
        .mockResolvedValue({ id: 1, quantity: 1, itemId: 1, showId: 1 });

      const result = await showController.buyItem(1, 1);

      expect(createOrderMock).toHaveBeenCalledWith(1, 1, 1);
      expect(result).toEqual({ id: 1, quantity: 1, itemId: 1, showId: 1 });
    });
  });

  describe('getSoldItemsByShow', () => {
    it('should return an array of sold items for the given showId', async () => {
      const getSoldItemsByShowMock = jest
        .spyOn(orderService, 'getSoldItemsByShow')
        .mockResolvedValue([{ id: 1, quantity: 1, itemId: 1, showId: 1 }]);

      const result = await showController.getSoldItemsByShow(1);

      expect(getSoldItemsByShowMock).toHaveBeenCalledWith(1, undefined);
      expect(result).toEqual([{ id: 1, quantity: 1, itemId: 1, showId: 1 }]);
    });

    it('should return an array of sold items for the given showId and itemId', async () => {
      const getSoldItemsByShowMock = jest
        .spyOn(orderService, 'getSoldItemsByShow')
        .mockResolvedValue([{ id: 1, quantity: 1, itemId: 1, showId: 1 }]);

      const result = await showController.getSoldItemsByShow(1, 1);

      expect(getSoldItemsByShowMock).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual([{ id: 1, quantity: 1, itemId: 1, showId: 1 }]);
    });
  });

  describe('showOrders', () => {
    it('should return an array of orders for the given showId', async () => {
      const getOrdersByShowMock = jest
        .spyOn(orderService, 'getOrdersByShow')
        .mockResolvedValue([{ id: 1, quantity: 1, itemId: 1, showId: 1 }]);

      const result = await showController.showOrders(1);

      expect(getOrdersByShowMock).toHaveBeenCalledWith(1);
      expect(result).toEqual([{ id: 1, quantity: 1, itemId: 1, showId: 1 }]);
    });
  });

  describe('show', () => {
    it('should return a show with showItems and orders for the given showId', async () => {
      const getShowByIdMock = jest
        .spyOn(showService, 'getShowById')
        .mockResolvedValue({ id: 1, name: 'Show 1' });

      const getShowItemsMock = jest
        .spyOn(showService, 'getShowItems')
        .mockResolvedValue([{ id: 1, name: 'Item 1' }]);


      const result = await showController.show(1);

      expect(getShowByIdMock).toHaveBeenCalledWith(1);
      expect(getShowItemsMock).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        id: 1,
        name: 'Show 1',
        showItems: [{ id: 1, name: 'Item 1' }],
        orders: [{ id: 1, quantity: 1, itemId: 1, showId: 1 }],
      });
    });

    it('should throw a NotFoundException if show is not found', async () => {
      jest.spyOn(showService, 'getShowById').mockResolvedValue(null);

      await expect(showController.show(1)).rejects.toThrow(NotFoundException);
    });
  });
});
