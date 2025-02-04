import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationType } from '../interfaces/notification.interface';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
    @Prop({ required: true })
    companyId: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, enum: NotificationType })
    type: NotificationType;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ required: true })
    message: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);