import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INotificationChannel } from './notification-channel.interface';
import { Notification, NotificationDocument } from '../schemas/notification.schema';
import { NotificationType } from 'src/interfaces/notification.interface';

@Injectable()
export class UIChannelService implements INotificationChannel {
    constructor(
        @InjectModel(Notification.name)
        private notificationModel: Model<NotificationDocument>,
    ) { }

    /**
     * Sends a notification through the UI channel.
     *
     * @param notification - The notification object to be sent
     * @param notification.type - The type of notification (LEAVE_BALANCE_REMINDER, HAPPY_BIRTHDAY)
     * @param notification.userId - The user ID the notification is for
     * @param notification.message - The message content (will be overwritten based on type)
     * @throws Error when an unsupported notification type is provided
     * @returns Promise<void>
     */
    async send(notification: any): Promise<void> {
        switch (notification.type) {
            case NotificationType.LEAVE_BALANCE_REMINDER:
                // Send UI notification for leave balance reminder
                notification.message = `Leave balance reminder for ${notification.userId}`;
                await this.notificationModel.create(notification);
                break;
            case NotificationType.HAPPY_BIRTHDAY:
                // Send UI notification for birthday greeting
                notification.message = `Happy Birthday! ${notification.userId}`;
                await this.notificationModel.create(notification);
                break;
            default:
                throw new Error(`Notification type ${notification.type} not supported`);
        }
    }
}
