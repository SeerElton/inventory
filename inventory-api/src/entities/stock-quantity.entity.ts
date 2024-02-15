import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type GBStockQuantityDocument = HydratedDocument<GBStockQuantity>;

@Schema({ timestamps: true })
export class GBStockQuantity extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'GBStock', required: true })
    stockId: string;

    @Prop({ type: Number, required: true })
    quantity: number;

    @Prop({ type: Date, required: true, default: Date.now })
    date: Date;

    @Prop({ type: Date, default: Date.now })
    created?: Date;

    @Prop({ type: Date, default: Date.now })
    updated?: Date;

    @Prop({ type: Date, default: null })
    deletedAt?: Date;
}

export const GBStockQuantitySchema = SchemaFactory.createForClass(GBStockQuantity);
