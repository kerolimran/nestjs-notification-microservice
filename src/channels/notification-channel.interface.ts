export interface INotificationChannel {
    send(notification: any): Promise<void>;
}