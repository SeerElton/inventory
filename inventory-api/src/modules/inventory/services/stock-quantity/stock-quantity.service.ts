import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result } from '../../../../dtos/results';
import { codes } from '../../../../codes';
import { GBStockQuantity, GBStockQuantityDocument } from '../../../../entities/stock-quantity.entity';
import { StockQuantity } from '../../../../dtos/stock-quantity';

@Injectable()
export class StockQuantityService {
  constructor(@InjectModel(GBStockQuantity.name) private stockQuantityModel: Model<GBStockQuantityDocument>) { }

  async add(stockId: string, quantity: number): Promise<Result<GBStockQuantityDocument>> {
    try {
      const record = new this.stockQuantityModel({ stockId, quantity });
      await record.save();
      return new Result(true, record);
    } catch (e) {
      console.error('Error adding stock item quantity', e, codes.StockQuantityService_ErrorAddingStockItemQuantity);
      return new Result(false);
    }
  }

  async remove(id: string): Promise<Result<null>> {
    try {
      await this.stockQuantityModel.findByIdAndDelete(id);
      return new Result(true);
    } catch (e) {
      console.error('Error removing stock item quantity', e, codes.StockQuantityService_ErrorRemovingStockItemQuantity);
      return new Result(false);
    }
  }

  async getByStockId(stockId: string): Promise<Result<StockQuantity[]>> {
    try {
      const records = await this.stockQuantityModel.find({ stockId }).exec();

      return new Result<StockQuantity[]>(true, records);
    } catch (e) {
      console.error('Error getting quantity records for stock item', e, codes.StockQuantityService_ErrorGettingQuantityRecordsForStockId);
      return new Result(false);
    }
  }

  async update(id: string, item: StockQuantity): Promise<Result<StockQuantity>> {
    try {
      const record = await this.stockQuantityModel.findByIdAndUpdate(id, item, { new: true }).exec();
      return new Result(true, record);
    } catch (e) {
      console.error('Error updating quantity records for stock item', e, codes.StockQuantityService_ErrorUpdatingStockItemQuantity);
      return new Result(false);
    }
  }
}
