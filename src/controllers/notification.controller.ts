import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../interfaces/notification.interface';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    async sendNotification(@Param('userId') userId: string, @Param('companyId') companyId: string, @Param('notificationType') notificationType: NotificationType) {
        const notification = {
            userId: userId,
            companyId: companyId,
            type: notificationType,
        }
        await this.notificationService.sendNotification(notification);
        return { message: 'Notification sent successfully' };
    }

    @Get('user/:userId')
    async getUserNotifications(@Param('userId') userId: string) {
        return this.notificationService.getUserNotifications(userId);
    }
}