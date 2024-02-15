/**
 * Gotbot
 * Gotbot app
 *
 * OpenAPI spec version: 1.0.11
 * Contact: nhlana.2@gmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { ApiProperty } from "@nestjs/swagger";

export class InsertStockRequest {

    @ApiProperty({
        example: 'Chef name',
        type: String,
    })
    name: string;

    @ApiProperty({
        example: 'base64',
        type: String,
    })
    image?: string;

    @ApiProperty({
        example: '10',
        type: Number,
    })
    initialQuantity: number;
}
