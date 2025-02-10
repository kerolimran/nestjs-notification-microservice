import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ChannelType } from '../interfaces/notification.interface';

export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription {
    @Prop({ required: true })
    companyId: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, enum: ChannelType })
    channelType: ChannelType;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);