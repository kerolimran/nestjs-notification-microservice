import { Injectable } from '@nestjs/common';
import { INotificationChannel } from './notification-channel.interface';

@Injectable()
export class EmailChannelService implements INotificationChannel {
    async send(notification: any): Promise<void> {
        console.log(`Sending email notification to user ${notification.userId}: ${notification.message}`);
    }
}