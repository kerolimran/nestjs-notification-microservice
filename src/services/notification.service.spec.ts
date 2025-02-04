import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { ChannelFactory } from '../factories/channel.factory';
import { NotificationType } from '../interfaces/notification.interface';
import { Model } from 'mongoose';

describe('NotificationService', () => {
    let service: NotificationService;
    let channelFactory: ChannelFactory;

    const mockNotificationModel = {
        find: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: ChannelFactory,
                    useValue: {
                        getChannel: jest.fn(),
                    },
                },
                {
                    provide: getModelToken('Notification'),
                    useValue: mockNotificationModel,
                },
            ],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
        channelFactory = module.get<ChannelFactory>(ChannelFactory);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should send notification through correct channels', async () => {
        const notification = {
            companyId: '1',
            userId: '1',
            type: NotificationType.HAPPY_BIRTHDAY,
        };

        const mockChannel = {
            send: jest.fn(),
        };

        jest.spyOn(channelFactory, 'getChannel').mockReturnValue(mockChannel);

        await service.sendNotification(notification);

        expect(channelFactory.getChannel).toHaveBeenCalledTimes(2);
        expect(mockChannel.send).toHaveBeenCalledTimes(2);
    });
});