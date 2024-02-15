import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Public } from '../../_helper/jwt/public.decorator';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs'
import * as path from 'path';

@Public()
@Controller('')
@ApiTags('root')
export class RootController {

    @Public()
    @ApiTags('root')
    @ApiOperation({ summary: 'Ping' })
    @Get('ping')
    ping() {
        return 'pong';
    }
}
