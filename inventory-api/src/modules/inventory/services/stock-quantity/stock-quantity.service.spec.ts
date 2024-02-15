import { StockQuantityService } from './stock-quantity.service';
import { Model } from 'mongoose';
import { Result } from '../../../../dtos/results';
import { GBStockQuantity, GBStockQuantityDocument } from '../../../../entities/stock-quantity.entity';
import { StockQuantity } from '../../../../dtos/stock-quantity';

describe('StockQuantityService', () => {
    let service: StockQuantityService;
    let mockModel: Model<GBStockQuantityDocument>;

    beforeEach(() => {
        mockModel = {
            create: jest.fn(),
            findByIdAndDelete: jest.fn(),
            find: jest.fn(),
            findByIdAndUpdate: jest.fn(),
        } as unknown as Model<GBStockQuantityDocument>;

        service = new StockQuantityService(mockModel);
    });

    describe('add', () => {
        it('should add a new stock quantity record', async () => {
            const stockId = 'stockId';
            const quantity = 10;
            const mockRecord = { _id: '1', quantity, stockId } as GBStockQuantityDocument;

            jest.spyOn(mockModel, 'create').mockResolvedValue(mockRecord);

            const result = await service.add(stockId, quantity);

            expect(result).toEqual(new Result(true, mockRecord));
            expect(mockModel.create).toHaveBeenCalledWith({ stockId, quantity });
        });

        it('should handle errors during addition', async () => {
            const stockId = 'stockId';
            const quantity = 10;

            jest.spyOn(mockModel, 'create').mockRejectedValue(new Error('Mocked error'));

            const result = await service.add(stockId, quantity);

            expect(result).toEqual(new Result(false));
        });
    });

    describe('remove', () => {
        it('should remove a stock quantity record', async () => {
            const id = '123';

            jest.spyOn(mockModel, 'findByIdAndDelete').mockResolvedValue(undefined);

            const result = await service.remove(id);

            expect(result).toEqual(new Result(true));
            expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(id);
        });

        it('should handle errors during removal', async () => {
            const id = '123';
            jest.spyOn(mockModel, 'findByIdAndDelete').mockRejectedValue(new Error('Mocked error'));

            const result = await service.remove(id);

            expect(result).toEqual(new Result(false));
        });
    });

    describe('getByStockId', () => {
        it('should get quantity records for a stock item', async () => {
            const stockId = 'stockId';
            const mockRecords: GBStockQuantity[] = [
                { _id: '1', stockId, quantity: 10, date: new Date('01/01/2024') },
                { _id: '2', stockId, quantity: 20, date: new Date('01/01/2024') },
            ];

            jest.spyOn(mockModel, 'find').mockResolvedValue(mockRecords);

            const result = await service.getByStockId(stockId);

            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual(mockRecords);
            expect(mockModel.find).toHaveBeenCalledWith({ stockId });
        });

        it('should handle errors during quantity retrieval', async () => {
            const stockId = 'stockId';
            jest.spyOn(mockModel, 'find').mockRejectedValue(new Error('Mocked error'));

            const result = await service.getByStockId(stockId);

            expect(result.isSuccess).toBe(false);
        });
    });

    describe('update', () => {
        it('should update quantity records for a stock item', async () => {
            const id = '1';
            const mockRecord: GBStockQuantity = { _id: '1', stockId: 'stockId', quantity: 10, date: new Date() };

            jest.spyOn(mockModel, 'findByIdAndUpdate').mockResolvedValue(mockRecord);

            const result = await service.update(id, mockRecord);

            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual(mockRecord);
            expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(id, mockRecord, { new: true });
        });

        it('should handle errors during quantity update', async () => {
            const id = '1';
            const mockRecord: GBStockQuantity = { _id: '1', stockId: 'stockId', quantity: 10, date: new Date() };

            jest.spyOn(mockModel, 'findByIdAndUpdate').mockRejectedValue(new Error('Mocked error'));

            const result = await service.update(id, mockRecord);

            expect(result.isSuccess).toBe(false);
        });
    });
});
