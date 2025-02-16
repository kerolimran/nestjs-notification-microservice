import { INotification } from "../interfaces/notification.interface";

/**
 * Interface for implementing notification channels
 * 
 * @interface INotificationChannel
 * 
 * @method send Sends a notification through the channel
 * @param notification The notification object to be sent
 * @returns Promise that resolves when the notification is sent
 * @throws May throw an error if sending fails
 */
export interface INotificationChannel {
    send(notification: INotification): Promise<void>;
}