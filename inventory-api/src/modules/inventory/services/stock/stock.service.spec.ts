import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from './stock.service';
import { getModelToken } from '@nestjs/mongoose';
import { Result } from '../../../../dtos/results';
import { GBStock, GBStockDocument } from '../../../../entities/stock.entity';
import { StockResponse } from '../../../../dtos/stock-response';
import { InsertStockRequest } from '../../../../dtos/insert-stock-request';
import { UpdateStockRequest } from '../../../../dtos/update-stock-request';
import { StockQuantityService } from '../stock-quantity/stock-quantity.service';

describe('StockService', () => {
    let service: StockService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StockService,
                {
                    provide: getModelToken(GBStock.name),
                    useValue: {
                        new: jest.fn(),
                        save: jest.fn(),
                        findByIdAndDelete: jest.fn(),
                        find: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                    },
                },
                {
                    provide: StockQuantityService,
                    useValue: {
                        add: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<StockService>(StockService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('add', () => {
        it('should add a new stock item and return successful result', async () => {
            const userId = 'userId';
            const entry: InsertStockRequest = {
                name: 'Test Stock',
                initialQuantity: 10,
            };
            const newRecord = { _id: 'recordId', ...entry, userId, created: Date.now(), updated: Date.now() };
            jest.spyOn(service['stockModel'], 'new').mockReturnValue(newRecord);
            jest.spyOn(service['stockModel'], 'save').mockResolvedValue(newRecord);
            jest.spyOn(service['stockQuantityService'], 'add').mockResolvedValue();

            const result = await service.add(userId, entry);

            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual(newRecord);
            expect(service['stockQuantityService'].add).toHaveBeenCalledWith(newRecord._id, entry.initialQuantity);
        });

        it('should return failed result if there is an error adding stock item', async () => {
            const userId = 'userId';
            const entry: InsertStockRequest = {
                name: 'Test Stock',
                initialQuantity: 10,
            };
            jest.spyOn(service['stockModel'], 'new').mockImplementation(() => { throw new Error('Mock error'); });

            const result = await service.add(userId, entry);

            expect(result.isSuccess).toBe(false);
        });
    });

    describe('remove', () => {
        it('should remove a stock item and return successful result', async () => {
            const id = 'recordId';
            jest.spyOn(service['stockModel'], 'findByIdAndDelete').mockResolvedValue();

            const result = await service.remove(id);

            expect(result.isSuccess).toBe(true);
        });

        it('should return failed result if there is an error removing stock item', async () => {
            const id = 'recordId';
            jest.spyOn(service['stockModel'], 'findByIdAndDelete').mockImplementation(() => { throw new Error('Mock error'); });

            const result = await service.remove(id);

            expect(result.isSuccess).toBe(false);
        });
    });

    describe('getAll', () => {
        it('should return all stock items for a user', async () => {
            const userId = 'userId';
            const mockRecords: GBStockDocument[] = [{ _id: '1', name: 'Stock 1' }, { _id: '2', name: 'Stock 2' }];
            jest.spyOn(service['stockModel'], 'find').mockResolvedValue(mockRecords);

            const result = await service.getAll(userId);

            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual(mockRecords);
        });

        it('should return failed result if there is an error getting stock items', async () => {
            const userId = 'userId';
            jest.spyOn(service['stockModel'], 'find').mockImplementation(() => { throw new Error('Mock error'); });

            const result = await service.getAll(userId);

            expect(result.isSuccess).toBe(false);
        });
    });

    describe('update', () => {
        it('should update a stock item and return successful result', async () => {
            const id = 'recordId';
            const item: UpdateStockRequest = { name: 'Updated Stock Name' };
            const updatedRecord: GBStockDocument = { _id: id, name: item.name };
            jest.spyOn(service['stockModel'], 'findByIdAndUpdate').mockResolvedValue(updatedRecord);

            const result = await service.update(id, item);

            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual(updatedRecord);
        });

        it('should return failed result if there is an error updating stock item', async () => {
            const id = 'recordId';
            const item: UpdateStockRequest = { name: 'Updated Stock Name' };
            jest.spyOn(service['stockModel'], 'findByIdAndUpdate').mockImplementation(() => { throw new Error('Mock error'); });

            const result = await service.update(id, item);

            expect(result.isSuccess).toBe(false);
        });
    });
});

