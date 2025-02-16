import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INotificationChannel } from './notification-channel.interface';
import { INotification, NotificationType } from '../interfaces/notification.interface';
import { NotificationDocument, Notification } from '../schemas/notification.schema';


@Injectable()
export class EmailChannelService implements INotificationChannel {
    constructor(
        @InjectModel(Notification.name)
        private notificationModel: Model<NotificationDocument>,
    ) { }


    /**
     * Sends an email notification based on the notification type. 
     * Mocked to using console.log for now. can be replaced with actual email sending logic.
     * 
     * @param notification - The notification object containing the type and user details     
     * @throws Error if the notification type is not supported
     * @returns Promise<void>
     */
    async send(notification: INotification): Promise<void> {
        switch (notification.type) {
            case NotificationType.MONTHLY_PAYSLIP:
                console.log(`Subject: Monthly Payslip for this month`);
                console.log(`Body: Hi ${notification?.user.name || notification.userId}! Your monthly payslip for this month is ready.`);
                break;

            case NotificationType.HAPPY_BIRTHDAY:
                console.log(`Subject: Happy Birthday! ${notification?.user.name || notification.userId}`);
                console.log(`Body: Hi ${notification?.user.name || notification.userId}, We wish you a very happy birthday!`);
                break;

            default:
                throw new Error(`Notification type ${notification.type} not supported`);
        }

    }
}
