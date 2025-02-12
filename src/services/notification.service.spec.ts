import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ChannelFactory } from '../factories/channel.factory';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Notification } from '../schemas/notification.schema';
import { Model } from 'mongoose';
import { INotification, NotificationType } from '../interfaces/notification.interface';

describe('NotificationService', () => {
    let service: NotificationService;
    let channelFactory: ChannelFactory;
    let subscriptionService: SubscriptionService;
    let notificationModel: Model<Notification>;

    const mockChannel = {
        send: jest.fn(),
    };

    const mockChannelFactory = {
        getChannel: jest.fn(),
    };

    const mockSubscriptionService = {
        isSubscribed: jest.fn(),
    };

    const mockNotificationModel = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn(),
        aggregate: jest.fn().mockReturnThis(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: ChannelFactory,
                    useValue: mockChannelFactory,
                },
                {
                    provide: SubscriptionService,
                    useValue: mockSubscriptionService,
                },
                {
                    provide: getModelToken(Notification.name),
                    useValue: mockNotificationModel,
                },
            ],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
        channelFactory = module.get<ChannelFactory>(ChannelFactory);
        subscriptionService = module.get<SubscriptionService>(SubscriptionService);
        notificationModel = module.get<Model<Notification>>(
            getModelToken(Notification.name),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendNotification', () => {
        const mockNotification: INotification = {
            type: NotificationType.HAPPY_BIRTHDAY,
            userId: 'user123',
            companyId: 'company123',
        };

        it('should send notification through subscribed channels', async () => {
            mockSubscriptionService.isSubscribed.mockResolvedValue(true);
            mockChannelFactory.getChannel.mockReturnValue(mockChannel);
            mockChannel.send.mockResolvedValue(undefined);

            await service.sendNotification(mockNotification);

            expect(mockSubscriptionService.isSubscribed).toHaveBeenCalledTimes(2);
            expect(mockChannelFactory.getChannel).toHaveBeenCalledTimes(2);
            expect(mockChannel.send).toHaveBeenCalledTimes(2);
        });

        it('should throw error for unsupported notification type', async () => {
            const invalidNotification = { ...mockNotification, type: 'INVALID_TYPE' as NotificationType };

            await expect(service.sendNotification(invalidNotification))
                .rejects
                .toThrow('Notification type INVALID_TYPE not supported');
        });

        it('should skip sending for unsubscribed channels', async () => {
            mockChannelFactory.getChannel.mockClear();
            mockChannel.send.mockClear();
            mockSubscriptionService.isSubscribed.mockResolvedValue(false);

            await service.sendNotification(mockNotification);

            expect(mockChannelFactory.getChannel).not.toHaveBeenCalled();
            expect(mockChannel.send).not.toHaveBeenCalled();
        });
    });

    describe('getUserNotifications', () => {
        it('should return sorted user notifications', async () => {
            const userId = 'user123';
            const mockNotifications = [{ userId, content: 'test' }];

            mockNotificationModel.find.mockReturnThis();
            mockNotificationModel.sort.mockReturnThis();
            mockNotificationModel.exec.mockResolvedValue(mockNotifications);

            const result = await service.getUserNotifications(userId);

            expect(mockNotificationModel.find).toHaveBeenCalledWith({ userId });
            expect(mockNotificationModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(result).toEqual(mockNotifications);
        });
    });
});
