import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../interfaces/notification.interface';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    async sendNotification(@Body() data: { userId: string; companyId: string; notificationType: NotificationType }) {
        const notification = {
            userId: data.userId,
            companyId: data.companyId,
            type: data.notificationType,
            message: '',
            user: {
                userId: data.userId,
                name: '',
                companyId: data.companyId,
            },
        }
        await this.notificationService.sendNotification(notification);
        return { message: 'Notification sent successfully' };
    }

    @Get('user/:userId')
    async getUserNotifications(@Param('userId') userId: string) {
        return this.notificationService.getUserNotifications(userId);
    }
}