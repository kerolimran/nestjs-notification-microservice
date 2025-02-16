import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../schemas/notification.schema';

@Injectable()
export class NotificationRepository {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) { }

    async create(notificationData: Partial<Notification>): Promise<Notification> {
        const notification = new this.notificationModel(notificationData);
        return notification.save();
    }

    async findById(notificationId: string): Promise<Notification | null> {
        return this.notificationModel.findById(notificationId).exec();
    }

    async findByUserId(userId: string): Promise<Notification[]> {
        return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }

    async update(notificationId: string, updateData: Partial<Notification>): Promise<Notification | null> {
        return this.notificationModel.findByIdAndUpdate(notificationId, updateData, { new: true }).exec();
    }

    async delete(notificationId: string): Promise<Notification | null> {
        return this.notificationModel.findByIdAndDelete(notificationId).exec();
    }
}