import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { SubscriptionService } from '../services/subscription.service';
import { ChannelType } from '../interfaces/notification.interface';

@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Post()
    async subscribe(@Body() data: { userId: string; companyId: string; channelType: ChannelType }) {
        const subscription = await this.subscriptionService.subscribe(
            data.userId,
            data.companyId,
            data.channelType,
        );
        return { message: 'Subscription created successfully', subscription };
    }

    @Delete(':userId/:companyId/:channelType')
    async unsubscribe(@Param('userId') userId: string, @Param('companyId') companyId: string, @Param('channelType') channelType: ChannelType) {
        await this.subscriptionService.unsubscribe(userId, companyId, channelType);
        return { message: 'Unsubscribed successfully' };
    }

    @Get('user/:userId')
    async getUserSubscriptions(@Param('userId') userId: string) {
        return this.subscriptionService.getUserSubscriptions(userId);
    }
}