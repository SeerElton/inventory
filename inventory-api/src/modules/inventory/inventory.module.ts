import { Module } from '@nestjs/common';
import { StockService } from './services/stock/stock.service';
import { StockQuantityService } from './services/stock-quantity/stock-quantity.service';
import { GBStockQuantitySchema } from '../../entities/stock-quantity.entity';
import { GBStockSchema } from '../../entities/stock.entity';
import { StockController } from './controllers/stock/stock.controller';
import { StockQuantitiesController } from './controllers/stock-quantity/stock-quantity.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    controllers: [StockController, StockQuantitiesController],
    providers: [StockQuantityService, StockService],
    imports: [
        MongooseModule.forFeature([
            { name: 'GBStockQuantity', schema: GBStockQuantitySchema },
            { name: 'GBStock', schema: GBStockSchema }
        ])
    ]
})
export class InventoryModule { }
