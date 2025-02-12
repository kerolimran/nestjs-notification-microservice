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
     * Sends a notification to a user based on their subscription preferences.
     *
     * @param notification - The notification object to be sent.
     * @returns A promise that resolves when the notification has been sent successfully.
     */
    async sendNotification(notification: INotification): Promise<void> {
        const channels = this.notificationChannels.get(notification.type);

        const notificationWithUser = await this.getNotificationWithUser(notification);

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
                await channel.send(notificationWithUser);
            } else {
                console.log(`User ${notificationWithUser?.user.name || notification.userId} is not subscribed to ${channelType} channel`);
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

    /**
     * Retrieves notifications with associated user information using MongoDB aggregation.
     * 
     * @param notification - The notification object containing user ID for filtering
     * @returns Promise that resolves to notifications with populated user data
     * 
     * @example
     * ```typescript
     * const notification = { userId: '123' };
     * const result = await getNotificationWithUser(notification);
     * // Returns notifications with user details for userId: '123'
     * ```
     */
    async getNotificationWithUser(notification: INotification): Promise<any> {
        const notificationUser = this.notificationModel.aggregate([
            { $match: { userId: notification.userId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'user'
                }
            },
            { $unwind: '$user' }
        ]).exec();

        return notificationUser;
    }
}

