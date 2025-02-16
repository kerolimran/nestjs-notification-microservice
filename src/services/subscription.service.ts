import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription, SubscriptionDocument } from '../schemas/subscription.schema';
import { ChannelType } from '../interfaces/notification.interface';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectModel(Subscription.name)
        private subscriptionModel: Model<SubscriptionDocument>,
    ) { }

    async isSubscribed(userId: string, companyId: string, channelType: ChannelType): Promise<boolean> {
        const subscription = await this.subscriptionModel.findOne({
            userId,
            companyId,
            channelType,
            isActive: true,
        });
        return !!subscription;
    }

    async subscribe(userId: string, companyId: string, channelType: ChannelType): Promise<Subscription> {
        const subscription = await this.subscriptionModel.findOne({
            userId,
            companyId,
            channelType,
        });

        if (subscription) {
            subscription.isActive = true;
            subscription.updatedAt = new Date();
            return subscription.save();
        }

        return this.subscriptionModel.create({
            userId,
            companyId,
            channelType,
        });
    }

    async unsubscribe(userId: string, companyId: string, channelType: ChannelType): Promise<Subscription | null> {
        const subscription = await this.subscriptionModel.findOne({
            userId,
            companyId,
            channelType,
        });

        if (subscription) {
            subscription.isActive = false;
            subscription.updatedAt = new Date();
            return subscription.save();
        }

        return null;
    }

    async getUserSubscriptions(userId: string): Promise<Subscription[]> {
        return this.subscriptionModel
            .find({ userId, isActive: true })
            .sort({ updatedAt: -1 })
            .exec();
    }
}