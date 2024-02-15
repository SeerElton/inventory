import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type GBUserDocument = HydratedDocument<GBUser>;

@Schema({ timestamps: true })
export class GBUser extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;
}

export const GBUserSchema = SchemaFactory.createForClass(GBUser);