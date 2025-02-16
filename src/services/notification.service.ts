import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelFactory } from '../factories/channel.factory';
import { NotificationType, ChannelType, INotification } from '../interfaces/notification.interface';
import { Notification, NotificationDocument } from '../schemas/notification.schema';
import { SubscriptionService } from './subscription.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { User, UserDocument } from '../schemas/user.schema';

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
        private readonly notificationRepository: NotificationRepository,
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    /**
     * Sends a notification to a user based on their subscription preferences.
     *
     * @param notification - The notification object to be sent.
     * @returns A promise that resolves when the notification has been sent successfully.
     */
    async sendNotification(notification: INotification): Promise<void> {
        const channels = this.notificationChannels.get(notification.type);

        notification.user.name = await this.getUserName(notification);

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
                console.log(`User ${notification?.user.name || notification.userId} is not subscribed to ${channelType} channel`);
                continue;
            }
        }
    }


    /**
     * Retrieves all notifications associated with a specific user.
     * 
     * @param userId - The unique identifier of the user whose notifications are to be retrieved
     * @returns A promise that resolves to an array of Notification objects
     * @throws {NotFoundException} If no notifications are found for the user
     */
    async getUserNotifications(userId: string): Promise<Notification[]> {
        return this.notificationRepository.findByUserId(userId);
    }



    /**
     * Retrieves the name of a user associated with a notification.
     * 
     * @param notification - The notification object containing user information
     * @returns Promise that resolves to the user's name as a string
     * @throws Error if the user is not found in the database
     */
    async getUserName(notification: INotification): Promise<string> {
        const user = await this.userModel.findOne({ userId: notification.userId }).exec();

        if (!user) {
            throw new Error('User not found');
        }
        return user.name;
    }
}

