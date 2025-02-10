import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationType } from '../interfaces/notification.interface';

export type NotificationDocument = Notification & Document;

/**
 * Represents a notification entity in the system.
 * @class
 * 
 * @property {string} companyId - The unique identifier of the company associated with the notification.
 * @property {string} userId - The unique identifier of the user associated with the notification.
 * @property {NotificationType} type - The type of notification, must be one of the predefined NotificationType enum values.
 * @property {Date} createdAt - The timestamp when the notification was created. Defaults to current date/time.
 * @property {string} message - The content/message of the notification.
 */
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