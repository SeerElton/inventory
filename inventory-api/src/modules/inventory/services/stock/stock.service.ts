import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result } from '../../../../dtos/results';
import { codes } from '../../../../codes';
import { GBStock, GBStockDocument } from '../../../../entities/stock.entity';
import { StockResponse } from '../../../../dtos/stock-response';
import { InsertStockRequest } from '../../../../dtos/insert-stock-request';
import { UpdateStockRequest } from '../../../../dtos/update-stock-request';
import { StockQuantityService } from '../stock-quantity/stock-quantity.service';

@Injectable()
export class StockService {
  constructor(@InjectModel(GBStock.name) private stockModel: Model<GBStockDocument>,
    private stockQuantityService: StockQuantityService) { }

  async add(userId: string, entry: InsertStockRequest): Promise<Result<GBStock>> {
    try {
      const newRecord = new this.stockModel({
        ...entry,
        userId: userId,
        created: Date.now(),
        updated: Date.now(),
      });
      await newRecord.save();

      await this.stockQuantityService.add(newRecord._id, entry.initialQuantity);

      return new Result(true, newRecord);
    } catch (e) {
      console.error('Error adding stock item', e, codes.StockService_ErrorAddingStockItem);
      return new Result(false);
    }
  }

  async remove(id: string): Promise<Result<null>> {
    try {
      await this.stockModel.findByIdAndDelete(id);
      return new Result(true);
    } catch (e) {
      console.error('Error removing stock item', e, codes.StockService_ErrorRemovingStockItem);
      return new Result(false);
    }
  }

  async getAll(userId: string): Promise<Result<StockResponse[]>> {
    try {
      const records = await this.stockModel.find({ userId }).exec();
      return new Result(true, records);
    } catch (e) {
      console.error('Error getting quantity records', e, codes.StockService_ErrorGettingInventoryItems);
      return new Result(false);
    }
  }

  async update(id: string, item: UpdateStockRequest): Promise<Result<StockResponse>> {
    try {
      const record = await this.stockModel.findByIdAndUpdate(id, item, { new: true }).exec();
      if (!record) {
        return new Result(false);
      }
      return new Result(true, record);
    } catch (e) {
      console.error('Error updating stock item record', e, codes.StockService_ErrorUpdatingStockItem);
      return new Result(false);
    }
  }
}
