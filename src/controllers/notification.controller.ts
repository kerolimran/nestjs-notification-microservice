import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { INotification } from '../interfaces/notification.interface';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    async sendNotification(@Body() notification: INotification) {
        await this.notificationService.sendNotification(notification);
        return { message: 'Notification sent successfully' };
    }

    @Get('user/:userId')
    async getUserNotifications(@Param('userId') userId: string) {
        return this.notificationService.getUserNotifications(userId);
    }
}