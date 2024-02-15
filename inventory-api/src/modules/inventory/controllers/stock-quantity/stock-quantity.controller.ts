import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { codes } from '../../../../codes';
import { ToastrResponse } from '../../../../dtos/toastrResponse';
import { Response } from 'express';
import { StockResponse } from '../../../../dtos/stock-response';
import { StockQuantityService } from '../../services/stock-quantity/stock-quantity.service';
import { InsertStockQuantityRequest } from '../../../../dtos/insert-stock-quantity-request';
import { StockQuantity } from '../../../../dtos/stock-quantity';

@ApiTags('stock quantity')
@Controller('stock-quantity')
export class StockQuantitiesController {
    constructor(private stockQuantityService: StockQuantityService) { }

    @Get(':stockItemId')
    @ApiParam({ name: 'stockItemId', description: 'stock item id' })
    @ApiOperation({ summary: 'Get stock captured quantity', description: "This endpoint add returns captured stock quantities of an item" })
    @ApiResponse({ status: 200, description: 'Successful operation', type: StockResponse, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getStockQuantity(@Param('stockItemId') stockItemId: string, @Res() res: Response) {
        try {
            const results = await this.stockQuantityService.getByStockId(stockItemId);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error fetching stock quantities",
                    type: 'error'
                });
            }
            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            console.error("Get stock quantities error", e, codes.StockQuantitiesController_ErrorGettingStockQuantities);
            throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':stockItemId')
    @ApiParam({ name: 'stockItemId', description: 'stock item id' })
    @ApiOperation({ summary: 'Add stock item quantity', description: "This endpoint add an adjustments to be made over a inventory item quantity" })
    @ApiBody({ description: 'stock item quantity', type: InsertStockQuantityRequest })
    @ApiResponse({ status: 200, description: 'Successful operation', type: StockResponse })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async addStockQuantity(@Param('stockItemId') stockItemId: string, @Body() body: InsertStockQuantityRequest, @Res() res: Response) {
        try {
            const results = await this.stockQuantityService.add(stockItemId, body.quantity);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error getting stock item",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            console.error("add stock item quantity error", e, codes.StockController_AddStockQuantityError);
            throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post(':id')
    @ApiBody({ description: 'stock item', type: InsertStockQuantityRequest })
    @ApiParam({ name: 'id', description: 'quantity id' })
    @ApiOperation({ summary: 'Update stock item' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: StockQuantity, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateStockItemQuantity(@Param('id') id: string, @Body() body: StockQuantity, @Res() res: Response) {
        try {
            const results = await this.stockQuantityService.update(id, body);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error updating stock item quantity",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            console.error("add stock item quantity error", e, codes.StockController_UpdateStockItemError);
            throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiParam({ name: 'id', description: "id of item to remove" })
    @ApiOperation({ summary: 'Remove stock item quantity' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: ToastrResponse })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async removeStockItem(@Param('id') id: string, @Res() res: Response) {
        try {
            const results = await this.stockQuantityService.remove(id);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error removing stock item",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send()
            }
        } catch (e) {
            console.error("Error removing stock item quantity", e, codes.StockController_ErrorRemovingStockItemQuanrity);
            throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
