import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelFactory } from '../factories/channel.factory';
import { NotificationType, ChannelType, INotification } from '../interfaces/notification.interface';
import { Notification, NotificationDocument } from '../schemas/notification.schema';

@Injectable()
export class NotificationService {
    private readonly notificationChannels = new Map<NotificationType, ChannelType[]>([
        [NotificationType.LEAVE_BALANCE_REMINDER, [ChannelType.UI]],
        [NotificationType.MONTHLY_PAYSLIP, [ChannelType.EMAIL]],
        [NotificationType.HAPPY_BIRTHDAY, [ChannelType.EMAIL, ChannelType.UI]],
    ]);

    constructor(
        private readonly channelFactory: ChannelFactory,
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) { }

    async sendNotification(notification: INotification): Promise<void> {
        const channels = this.notificationChannels.get(notification.type);

        if (!channels) {
            throw new Error(`Notification type ${notification.type} not supported`);
        }

        const message = this.generateMessage(notification);
        const notificationData = { ...notification, message };

        for (const channelType of channels) {
            const channel = this.channelFactory.getChannel(channelType);
            await channel.send(notificationData);
        }
    }

    async getUserNotifications(userId: string): Promise<Notification[]> {
        return this.notificationModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .exec();
    }

    private generateMessage(notification: INotification): string {
        switch (notification.type) {
            case NotificationType.LEAVE_BALANCE_REMINDER:
                return 'Remember to plan your leave balance!';
            case NotificationType.MONTHLY_PAYSLIP:
                return 'Your monthly payslip is now available.';
            case NotificationType.HAPPY_BIRTHDAY:
                return 'Happy Birthday! Have a great day!';
            default:
                throw new Error(`Notification type ${notification.type} not supported`);
        }
    }
}