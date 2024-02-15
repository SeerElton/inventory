// import { StockService } from './stock.service';
// import { Repository } from 'typeorm';
// import { Result } from '../../../../dtos/results';
// import { GBStock } from '../../../../entities/stock.entity';
// import { InsertStockRequest } from '../../../../dtos/insert-stock-request';

// describe('StockService', () => {
//     let service: StockService;
//     let mockRepository: Repository<GBStock>;

//     beforeEach(() => {
//         mockRepository = {} as Repository<GBStock>;
//         service = new StockService(mockRepository);
//     });

//     describe('add', () => {
//         it('should add a new stock item', async () => {
//             const entry: InsertStockRequest = {
//                 id: 'fd3df093-9909-4f0c-b966-e62eecb58cdc',
//                 userId: 'user123',
//                 name: 'item name',
//                 image: 'base64',
//                 initialQuantity: 10
//             };
//             const mockRecord = new GBStock();

//             mockRepository.save = jest.fn().mockResolvedValue(mockRecord);

//             const result = await service.add(entry);

//             expect(result).toEqual(new Result(true, expect.objectContaining(entry)));
//             expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
//                 id: entry.id,
//                 userId: entry.userId,
//                 name: entry.name,
//                 image: entry.image
//             }));
//         });

//         it('should handle errors during addition', async () => {
//             const entry: InsertStockRequest = {
//                 id: 'fd3df093-9909-4f0c-b966-e62eecb58cdc',
//                 userId: 'user123',
//                 name: 'item name',
//                 image: 'base64',
//                 initialQuantity: 10
//             };

//             mockRepository.save = jest.fn().mockRejectedValue(new Error('Mocked error'));

//             const result = await service.add(entry);

//             expect(result).toEqual(new Result(false));
//         });
//     });

//     describe('remove', () => {
//         it('should remove a stock item', async () => {
//             const id = '123';

//             mockRepository.softRemove = jest.fn().mockResolvedValue(undefined);

//             const result = await service.remove(id);

//             expect(result).toEqual(new Result(true));
//             expect(mockRepository.softRemove).toHaveBeenCalledWith({ id });
//         });

//         it('should handle errors during removal', async () => {
//             const id = '123';

//             mockRepository.softRemove = jest.fn().mockRejectedValue(new Error('Mocked error'));

//             const result = await service.remove(id);

//             expect(result).toEqual(new Result(false));
//         });
//     });

//     describe('getAll', () => {
//         it('should get all stock items for a user', async () => {
//             const userId = 'user123';
//             const mockRecords: GBStock[] = [{
//                 id: 'fd3df093-9909-4f0c-b966-e62eecb58cdc',
//                 userId: 'user123',
//                 name: 'item 2',

//             }, {
//                 id: 'fd3df093-9909-4f0c-b966-e62eecb58cdc',
//                 userId: 'user123',
//                 name: 'item 2'
//             }];

//             mockRepository.find = jest.fn().mockResolvedValue(mockRecords);

//             const result = await service.getAll(userId);

//             expect(result.isSuccess).toBe(true);
//             expect(result.value).toEqual(mockRecords);
//             expect(mockRepository.find).toHaveBeenCalledWith({ where: { userId } });
//         });

//         it('should handle errors during stock retrieval', async () => {
//             const userId = 'user123';

//             mockRepository.find = jest.fn().mockRejectedValue(new Error('Mocked error'));

//             const result = await service.getAll(userId);

//             expect(result.isSuccess).toBe(false);
//         });
//     });

//     describe('update', () => {
//         it('should update a stock item', async () => {
//             const item: InsertStockRequest = {
//                 id: 'fd3df093-9909-4f0c-b966-e62eecb58cdc',
//                 userId: 'user123',
//                 name: 'item name',
//                 image: 'base64',
//                 initialQuantity: 10
//             };
//             const mockRecord: GBStock = { ...item };

//             mockRepository.findOne = jest.fn().mockResolvedValue(mockRecord);
//             mockRepository.save = jest.fn().mockResolvedValue(mockRecord);

//             const result = await service.update(item);

//             expect(result.isSuccess).toBe(true);
//             expect(result.value).toEqual(mockRecord);
//             expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: item.id } });
//             expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
//                 id: item.id,
//                 userId: item.userId,
//                 name: item.name,
//                 image: item.image,
//                 initialQuantity: item.initialQuantity
//             }));
//         });

//         it('should handle errors during stock item update', async () => {
//             const item: InsertStockRequest = {
//                 id: 'fd3df093-9909-4f0c-b966-e62eecb58cdc',
//                 userId: 'user123',
//                 name: 'item name',
//                 image: 'base64',
//                 initialQuantity: 10
//             };
//             const mockRecord: GBStock = { ...item };

//             mockRepository.findOne = jest.fn().mockResolvedValue(mockRecord);
//             mockRepository.save = jest.fn().mockRejectedValue(new Error('Mocked error'));

//             const result = await service.update(item);

//             expect(result.isSuccess).toBe(false);
//         });

//         it('should return failure result if stock item not found', async () => {
//             const item: InsertStockRequest = {
//                 id: 'fd3df093-9909-4f0c-b966-e62eecb58cdc',
//                 userId: 'user123',
//                 name: 'item name',
//                 image: 'base64',
//                 initialQuantity: 10
//             };

//             mockRepository.findOne = jest.fn().mockResolvedValue(null);

//             const result = await service.update(item);

//             expect(result.isSuccess).toBe(false);
//         });
//     });
// });
