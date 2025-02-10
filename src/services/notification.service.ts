import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelFactory } from '../factories/channel.factory';
import { NotificationType, ChannelType, INotification } from '../interfaces/notification.interface';
import { Notification, NotificationDocument } from '../schemas/notification.schema';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class NotificationService {
    private readonly notificationChannels = new Map<NotificationType, ChannelType[]>([
        [NotificationType.LEAVE_BALANCE_REMINDER, [ChannelType.UI]],
        [NotificationType.MONTHLY_PAYSLIP, [ChannelType.EMAIL]],
        [NotificationType.HAPPY_BIRTHDAY, [ChannelType.EMAIL, ChannelType.UI]],
    ]);

    constructor(
        private readonly channelFactory: ChannelFactory,
        private readonly subscriptionService: SubscriptionService,
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) { }

    /**
     * Sends a notification to the user through the appropriate channels.
     *
     * @param {INotification} notification - The notification object containing the details of the notification.
     * @returns {Promise<void>} A promise that resolves when the notification has been sent.
     * @throws {Error} If the user is not subscribed to the notification channel.
     * @throws {Error} If the notification type is not supported.
     */
    async sendNotification(notification: INotification): Promise<void> {
        const channels = this.notificationChannels.get(notification.type);

        if (!channels) {
            throw new Error(`Notification type ${notification.type} not supported`);
        }

        for (const channelType of channels) {
            const isSubscribed = await this.subscriptionService.isSubscribed(
                notification.userId,
                notification.companyId,
                channelType,
            );

            if (isSubscribed) {
                const channel = this.channelFactory.getChannel(channelType);
                await channel.send(notification);
            } else {
                console.log(`User ${notification.userId} is not subscribed to ${channelType} channel`);
                continue;
            }
        }
    }

    /**
     * Retrieves a list of notifications for a specific user, sorted by creation date in descending order.
     *
     * @param userId - The unique identifier of the user whose notifications are to be retrieved.
     * @returns A promise that resolves to an array of notifications belonging to the specified user.
     */
    async getUserNotifications(userId: string): Promise<Notification[]> {
        return this.notificationModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .exec();
    }
}

