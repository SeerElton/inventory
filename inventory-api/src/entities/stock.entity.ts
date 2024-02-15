import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { GBStockQuantity } from './stock-quantity.entity';

export type GBStockDocument = HydratedDocument<GBStock>;

@Schema({ timestamps: true })
export class GBStock extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'GBUser', required: true })
    userId: string;

    @Prop({ type: String, required: true })
    image: string;

    @Prop({ type: Date, default: Date.now })
    created?: Date;

    @Prop({ type: Date, default: Date.now })
    updated?: Date;

    @Prop({ type: Date, default: null })
    deletedAt?: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'GBStockQuantity', required: true, default: [] })
    quantityRecords: GBStockQuantity[];
}

export const GBStockSchema = SchemaFactory.createForClass(GBStock);
