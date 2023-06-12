import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { ItemService } from 'app/item/item.service';

describe('ItemService', () => {
  let itemService: ItemService;
  let prismaDatabaseService: PrismaDatabaseService;

  beforeEach(() => {
    prismaDatabaseService = new PrismaDatabaseService();
    itemService = new ItemService(prismaDatabaseService);
  });

  describe('createOrUpdateItem', () => {
    it('should create a new item if it does not exist', async () => {
      // Mock the PrismaDatabaseService's item.upsert method
      jest
        .spyOn(prismaDatabaseService.item, 'upsert')
        .mockResolvedValue({ id: 1, itemName: 'Item 1', quantity: 10 });

      const item = await itemService.createOrUpdateItem('Item 1', 5);

      expect(prismaDatabaseService.item.upsert).toHaveBeenCalledWith({
        where: { itemName: 'Item 1' },
        update: { quantity: 15 },
        create: { itemName: 'Item 1', quantity: 5 },
      });
      expect(item).toEqual({ id: 1, itemName: 'Item 1', quantity: 10 });
    });

    it('should update an existing item', async () => {
      // Mock the PrismaDatabaseService's item.upsert method
      jest
        .spyOn(prismaDatabaseService.item, 'upsert')
        .mockResolvedValue({ id: 1, itemName: 'Item 1', quantity: 15 });

      const item = await itemService.createOrUpdateItem('Item 1', 5);

      expect(prismaDatabaseService.item.upsert).toHaveBeenCalledWith({
        where: { itemName: 'Item 1' },
        update: { quantity: 20 },
        create: { itemName: 'Item 1', quantity: 5 },
      });
      expect(item).toEqual({ id: 1, itemName: 'Item 1', quantity: 15 });
    });
  });

  describe('getItemById', () => {
    it('should return the item with the given ID', async () => {
      // Mock the PrismaDatabaseService's item.findUnique method
      jest
        .spyOn(prismaDatabaseService.item, 'findUnique')
        .mockResolvedValue({ id: 1, itemName: 'Item 1', quantity: 10 });

      const item = await itemService.getItemById(1);

      expect(prismaDatabaseService.item.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(item).toEqual({ id: 1, itemName: 'Item 1', quantity: 10 });
    });

    it('should return null if the item does not exist', async () => {
      // Mock the PrismaDatabaseService's item.findUnique method
      jest
        .spyOn(prismaDatabaseService.item, 'findUnique')
        .mockResolvedValue(null);

      const item = await itemService.getItemById(1);

      expect(prismaDatabaseService.item.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(item).toBeNull();
    });
  });

  describe('getItemsByShow', () => {
    it('should return an array of items associated with the given showId', async () => {
      // Mock the PrismaDatabaseService's item.findMany method
      jest.spyOn(prismaDatabaseService.item, 'findMany').mockResolvedValue([
        { id: 1, itemName: 'Item 1', quantity: 10 },
        { id: 2, itemName: 'Item 2', quantity: 5 },
      ]);

      const items = await itemService.getItemsByShow(1);

      expect(prismaDatabaseService.item.findMany).toHaveBeenCalledWith({
        where: { showId: 1 },
      });
      expect(items).toEqual([
        { id: 1, itemName: 'Item 1', quantity: 10 },
        { id: 2, itemName: 'Item 2', quantity: 5 },
      ]);
    });
  });

  describe('getItemName', () => {
    it('should return the item with the given itemName', async () => {
      // Mock the PrismaDatabaseService's item.findUnique method
      jest
        .spyOn(prismaDatabaseService.item, 'findUnique')
        .mockResolvedValue({ id: 1, itemName: 'Item 1', quantity: 10 });

      const item = await itemService.getItemName('Item 1');

      expect(prismaDatabaseService.item.findUnique).toHaveBeenCalledWith({
        where: { itemName: 'Item 1' },
      });
      expect(item).toEqual({ id: 1, itemName: 'Item 1', quantity: 10 });
    });

    it('should return null if the item does not exist', async () => {
      // Mock the PrismaDatabaseService's item.findUnique method
      jest
        .spyOn(prismaDatabaseService.item, 'findUnique')
        .mockResolvedValue(null);

      const item = await itemService.getItemName('Item 1');

      expect(prismaDatabaseService.item.findUnique).toHaveBeenCalledWith({
        where: { itemName: 'Item 1' },
      });
      expect(item).toBeNull();
    });
  });
});
