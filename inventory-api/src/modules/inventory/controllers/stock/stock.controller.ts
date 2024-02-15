import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { codes } from '../../../../codes';
import { ToastrResponse } from '../../../../dtos/toastrResponse';
import { Response, Request } from 'express';
import { StockService } from '../../services/stock/stock.service';
import jwt_decode from "jwt-decode";
import { StockResponse } from '../../../../dtos/stock-response';
import { InsertStockRequest } from '../../../../dtos/insert-stock-request';
import { GBUser } from '../../../../entities/user.entity';
import { UpdateStockRequest } from '../../../../dtos/update-stock-request';

@ApiTags('stock')
@Controller('stock')
export class StockController {
    constructor(private stockService: StockService) { }

    @Get('')
    @ApiOperation({ summary: 'Get stock', description: "This endpoint gets a list of all inventory item for a user, it uses the auth token to get user details" })
    @ApiResponse({ status: 200, description: 'Successful operation', type: StockResponse, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getStock(@Res() res: Response, @Req() req: Request) {
        try {
            var token = req.headers.authorization;
            var tokenData: GBUser = jwt_decode(token);

            const results = await this.stockService.getAll(tokenData._id);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error fetching stock",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            console.error("Get stock error", e, codes.StockController_ErrorGettingStock);
            throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('')
    @ApiOperation({ summary: 'Add stock item', description: "This endpoint adds an inventory item into our system" })
    @ApiBody({ description: 'stock item', type: InsertStockRequest })
    @ApiResponse({ status: 200, description: 'Successful operation', type: StockResponse })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async addStock(@Body() body: InsertStockRequest, @Res() res: Response, @Req() req: Request) {
        try {
            var token = req.headers.authorization;
            var tokenData: GBUser = jwt_decode(token);
            const results = await this.stockService.add(tokenData._id, body);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error adding stock item",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            console.error("add stock item error", e, codes.StockController_AddStockError);
            throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post(':id')
    @ApiOperation({ summary: 'Update stock item', description: "This endpoint updates an existing inventory item" })
    @ApiBody({ description: 'stock item', type: UpdateStockRequest })
    @ApiParam({ name: 'id', description: 'stock item id' })
    @ApiResponse({ status: 200, description: 'Successful operation', type: StockResponse, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateStockItem(@Param('id') id: string, @Body() body: UpdateStockRequest, @Res() res: Response) {
        try {
            const results = await this.stockService.update(id, body);

            if (!results.isSuccess) {
                res.status(500).json({
                    message: "Error updating stock item",
                    type: 'error'
                });
            }

            else {
                return res.status(200).send(results.value)
            }
        } catch (e) {
            console.error("errpr updating tock item", e, codes.StockController_UpdateStockItemError);
            throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiParam({ name: 'id', description: "Id of item to remove" })
    @ApiOperation({ summary: 'Remove stock item', description: "This endpoints remove an inventory item" })
    @ApiResponse({ status: 200, description: 'Successful operation', type: StockResponse, isArray: true })
    @ApiResponse({ status: 500, description: 'Internal server error', type: ToastrResponse })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async removeStockItem(@Param('id') id: string, @Res() res: Response) {
        try {
            const results = await this.stockService.remove(id);

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
            console.error("Error removing stock item", e, codes.StockController_ErrorRemovingStockItem);
            throw new HttpException({ message: "Internal server error", type: typeof ToastrResponse.TypeEnum.Error }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
