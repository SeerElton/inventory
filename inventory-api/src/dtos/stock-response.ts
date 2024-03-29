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

export class StockResponse {

    @ApiProperty({
        example: 'fd3df093-9909-4f0c-b966-e62eecb58cdc',
        type: String,
    })
    _id?: string;

    @ApiProperty({
        example: 'Chef name',
        type: String,
    })
    name?: string;

    @ApiProperty({
        example: 'base64',
        type: String,
    })
    image?: string;
}

