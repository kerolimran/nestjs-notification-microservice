import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INotificationChannel } from './notification-channel.interface';
import { Notification, NotificationDocument } from '../schemas/notification.schema';
import { INotification, NotificationType } from '../interfaces/notification.interface';

@Injectable()
export class UIChannelService implements INotificationChannel {
    constructor(
        @InjectModel(Notification.name)
        private notificationModel: Model<NotificationDocument>,
    ) { }


    /**
     * Sends a notification through the UI channel based on the notification type.
     * 
     * @param notification - The notification object to be sent
     * @throws {Error} When an unsupported notification type is provided
     * @returns Promise that resolves when notification is sent successfully 
     */
    async send(notification: INotification): Promise<void> {
        switch (notification.type) {
            case NotificationType.LEAVE_BALANCE_REMINDER:
                notification.message = `Leave balance reminder for ${notification?.user.name || notification.userId}`;
                await this.notificationModel.create(notification);
                break;

            case NotificationType.HAPPY_BIRTHDAY:
                notification.message = `Happy Birthday! ${notification?.user.name || notification.userId}`;
                await this.notificationModel.create(notification);
                break;

            default:
                throw new Error(`Notification type ${notification.type} not supported`);
        }
    }
}
