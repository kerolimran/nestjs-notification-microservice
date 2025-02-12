import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INotificationChannel } from './notification-channel.interface';
import { NotificationType } from '../interfaces/notification.interface';
import { NotificationDocument, Notification } from '../schemas/notification.schema';


@Injectable()
export class EmailChannelService implements INotificationChannel {
    constructor(
        @InjectModel(Notification.name)
        private notificationModel: Model<NotificationDocument>,
    ) { }


    async send(notification: any): Promise<void> {
        switch (notification.type) {
            case NotificationType.MONTHLY_PAYSLIP:
                // Send email notification for monthly payslip
                console.log(`Subject: Monthly Payslip for this month`);
                console.log(`Body: Hi ${notification?.user.name || notification.userId}! Your monthly payslip for this month is ready.`);
                break;
            case NotificationType.HAPPY_BIRTHDAY:
                // Send email notification for birthday greeting
                console.log(`Subject: Happy Birthday! ${notification.userId}`);
                console.log(`Body: ${notification?.user.name || notification.userId} is wishing you a very happy birthday!`);
                break;
            default:
                throw new Error(`Notification type ${notification.type} not supported`);
        }

    }
}
