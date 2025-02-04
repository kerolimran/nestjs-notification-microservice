import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INotificationChannel } from './notification-channel.interface';
import { Notification, NotificationDocument } from '../schemas/notification.schema';

@Injectable()
export class UIChannelService implements INotificationChannel {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) { }

    async send(notification: any): Promise<void> {
        await this.notificationModel.create(notification);
    }
}