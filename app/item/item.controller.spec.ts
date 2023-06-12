import { BadRequestException } from '@nestjs/common';
import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

describe('ItemController', () => {
  let itemController: ItemController;
  let itemService: ItemService;
  let prismaDatabaseService: PrismaDatabaseService;

  beforeEach(() => {
    itemService = new ItemService(prismaDatabaseService);
    itemController = new ItemController(itemService);
  });

  describe('inventory', () => {
    it('should create or update an item and return it', async () => {
      // Mock the ItemService's createOrUpdateItem method
      jest
        .spyOn(itemService, 'createOrUpdateItem')
        .mockResolvedValue({ id: 1, itemName: 'Item 1', quantity: 10 });

      const itemName = 'Item 1';
      const quantity = 5;

      const item = await itemController.inventory(itemName, quantity);

      expect(itemService.createOrUpdateItem).toHaveBeenCalledWith(
        itemName,
        quantity,
      );
      expect(item).toEqual({ id: 1, itemName: 'Item 1', quantity: 10 });
    });

    it('should throw a BadRequestException if itemName or quantity is missing', async () => {
      const itemName = 'Item 1';
      const quantity = undefined;

      await expect(
        itemController.inventory(itemName, quantity),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
