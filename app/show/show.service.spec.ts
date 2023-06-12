import { PrismaDatabaseService } from 'app/databases/prisma-database.service';
import { ShowService } from './show.service';

describe('ShowService', () => {
  let showService: ShowService;
  let prismaDatabaseService: PrismaDatabaseService;

  beforeEach(() => {
    prismaDatabaseService = new PrismaDatabaseService();
    showService = new ShowService(prismaDatabaseService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getShowById', () => {
    it('should return a show for the given showId', async () => {
      const findUniqueMock = jest
        .spyOn(prismaDatabaseService.show, 'findUnique')
        .mockResolvedValue({ id: 1 });

      const show = await showService.getShowById(1);

      expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(show).toEqual({ id: 1, name: 'Show 1' });
    });
  });

  describe('getShowOrders', () => {
    it('should return an array of orders for the given showId', async () => {
      const showMock = {
        id: 1,
        name: 'Show 1',
        showItems: jest.fn().mockResolvedValue([{ id: 1, name: 'Item 1' }]),
      };

      const findUniqueMock = jest
        .spyOn(prismaDatabaseService.show, 'findUnique')
        .mockResolvedValue(showMock);

      const orders = await showService.getShowOrders(1);

      expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(showMock.showItems).toHaveBeenCalled();
      expect(orders).toEqual([{ id: 1, name: 'Item 1' }]);
    });
  });

  describe('getShowItems', () => {
    it('should return an array of items for the given showId', async () => {
      const showMock = {
        id: 1,
        name: 'Show 1',
        showItems: jest.fn().mockResolvedValue([{ id: 1, name: 'Item 1' }]),
      };

      const findUniqueMock = jest
        .spyOn(prismaDatabaseService.show, 'findUnique')
        .mockResolvedValue(showMock);

      const items = await showService.getShowItems(1);

      expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(showMock.showItems).toHaveBeenCalled();
      expect(items).toEqual([{ id: 1, name: 'Item 1' }]);
    });
  });
});
