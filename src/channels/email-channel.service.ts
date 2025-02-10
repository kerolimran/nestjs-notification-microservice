import { Injectable } from '@nestjs/common';
import { INotificationChannel } from './notification-channel.interface';
import { NotificationType } from '../interfaces/notification.interface';

@Injectable()
export class EmailChannelService implements INotificationChannel {
    /**
     * Sends an email notification based on the notification type.
     * @param notification - The notification object containing details for the email
     * @param notification.type - The type of notification (MONTHLY_PAYSLIP, HAPPY_BIRTHDAY)
     * @param notification.userId - The ID of the user receiving the notification
     * @param notification.companyId - The ID of the company sending the notification (required for birthday notifications)
     * @throws {Error} When an unsupported notification type is provided
     * @returns Promise<void>
     */
    async send(notification: any): Promise<void> {

        switch (notification.type) {
            case NotificationType.MONTHLY_PAYSLIP:
                // Send email notification for monthly payslip
                console.log(`Subject: Monthly Payslip for this month`);
                console.log(`Body: Hi ${notification.userId}! Your monthly payslip for this month is ready.`);
                break;
            case NotificationType.HAPPY_BIRTHDAY:
                // Send email notification for birthday greeting
                console.log(`Subject: Happy Birthday! ${notification.userId}`);
                console.log(`Body: ${notification.companyId} is wishing you a very happy birthday!`);
                break;
            default:
                throw new Error(`Notification type ${notification.type} not supported`);
        }

    }
}
