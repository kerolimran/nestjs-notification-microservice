import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ChannelFactory } from '../factories/channel.factory';
import { SubscriptionService } from './subscription.service';
import { getModelToken } from '@nestjs/mongoose';
import { Notification } from '../schemas/notification.schema';
import { Model } from 'mongoose';
import { INotification, NotificationType } from '../interfaces/notification.interface';
import { NotificationRepository } from '../repositories/notification.repository';
import { User } from '../schemas/user.schema';

describe('NotificationService', () => {
    let service: NotificationService;
    let channelFactory: ChannelFactory;
    let subscriptionService: SubscriptionService;
    let notificationRepository: NotificationRepository;
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

    const mockNotificationRepository = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByUserId: jest.fn(),
    };

    const mockNotificationService = {
        getUserName: jest.fn()
    };

    const mockUserModel = {
        findById: jest.fn().mockReturnThis(),
        exec: jest.fn()
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
                {
                    provide: NotificationRepository,
                    useValue: mockNotificationRepository,
                },
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                }
            ],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
        channelFactory = module.get<ChannelFactory>(ChannelFactory);
        subscriptionService = module.get<SubscriptionService>(SubscriptionService);
        notificationModel = module.get<Model<Notification>>(
            getModelToken(Notification.name),
        );

        // Mock getUserName method
        jest.spyOn(service, 'getUserName').mockImplementation(mockNotificationService.getUserName);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendNotification', () => {
        let consoleSpy: jest.SpyInstance;

        beforeEach(() => {
            consoleSpy = jest.spyOn(console, 'log');
            mockNotificationService.getUserName.mockReset();
            mockUserModel.findById.mockClear();
            mockUserModel.exec.mockClear();
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        const mockNotification: INotification = {
            type: NotificationType.HAPPY_BIRTHDAY,
            userId: 'u01',
            companyId: 'c01',
            message: '',
            user: {
                userId: 'u01',
                name: '',
                companyId: 'c01',
            },
        };

        it('should send notification through subscribed channels', async () => {
            mockChannelFactory.getChannel.mockReturnValue(mockChannel);
            mockChannel.send.mockResolvedValue(undefined);
            mockNotificationService.getUserName.mockResolvedValue('Armstrong Ross');
            mockSubscriptionService.isSubscribed.mockResolvedValue(true);
            mockUserModel.exec.mockResolvedValue({ name: 'Armstrong Ross' });

            const test = await service.sendNotification(mockNotification);

            expect(mockNotificationService.getUserName).toHaveBeenCalledWith({ "companyId": "c01", "message": "", "type": "happy-birthday", "user": { "companyId": "c01", "name": "Armstrong Ross", "userId": "u01" }, "userId": "u01" });
            expect(mockSubscriptionService.isSubscribed).toHaveBeenCalledTimes(2);
            expect(mockChannelFactory.getChannel).toHaveBeenCalledTimes(2);
            expect(mockChannel.send).toHaveBeenCalledTimes(2);

        });

        it('should handle case when user is not found', async () => {

            const mockNotification2: INotification = {
                type: NotificationType.HAPPY_BIRTHDAY,
                userId: 'u11',
                companyId: 'c01',
                message: '',
                user: {
                    userId: 'u11',
                    name: '',
                    companyId: 'c01',
                },
            };

            mockChannelFactory.getChannel.mockReturnValue(mockChannel);
            // mockSubscriptionService.isSubscribed.mockResolvedValue(false);
            mockNotificationService.getUserName.mockRejectedValue(new Error('User not found'));
            mockUserModel.exec.mockResolvedValue(null);

            await expect(service.sendNotification(mockNotification2))
                .rejects
                .toThrow('User not found');

            expect(mockNotificationService.getUserName).toHaveBeenCalledWith(mockNotification2);
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

            mockNotificationRepository.findByUserId.mockResolvedValue(mockNotifications);

            const result = await service.getUserNotifications(userId);

            expect(mockNotificationRepository.findByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockNotifications);
        });
    });
});
