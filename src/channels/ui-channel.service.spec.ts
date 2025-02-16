import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UIChannelService } from './ui-channel.service';
import { Notification, NotificationDocument } from '../schemas/notification.schema';
import { NotificationType } from '../interfaces/notification.interface';

describe('UIChannelService', () => {
    let service: UIChannelService;
    let model: Model<NotificationDocument>;

    const mockNotificationModel = {
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UIChannelService,
                {
                    provide: getModelToken(Notification.name),
                    useValue: mockNotificationModel,
                },
            ],
        }).compile();

        service = module.get<UIChannelService>(UIChannelService);
        model = module.get<Model<NotificationDocument>>(getModelToken(Notification.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('send', () => {
        it('should create leave balance reminder notification with user name', async () => {
            const notification = {
                type: NotificationType.LEAVE_BALANCE_REMINDER,
                userId: 'u01',
                companyId: 'c01',
                message: '',
                user: {
                    userId: 'u01',
                    name: 'Armstrong Ross',
                    companyId: 'c01',
                },
            };

            await service.send(notification);

            expect(model.create).toHaveBeenCalledWith({
                ...notification,
                message: 'Leave balance reminder for Armstrong Ross'
            });
        });

        it('should create leave balance reminder notification with userId when user name not provided', async () => {
            const notification = {
                type: NotificationType.LEAVE_BALANCE_REMINDER,
                userId: 'u01',
                companyId: 'c01',
                message: '',
                user: {
                    userId: 'u01',
                    name: 'Armstrong Ross',
                    companyId: 'c01',
                },
            };

            await service.send(notification);

            expect(model.create).toHaveBeenCalledWith({
                ...notification,
                message: 'Leave balance reminder for Armstrong Ross'
            });
        });

        it('should create happy birthday notification with user name', async () => {
            const notification = {
                type: NotificationType.HAPPY_BIRTHDAY,
                userId: 'u01',
                companyId: 'c01',
                message: '',
                user: {
                    userId: 'u01',
                    name: 'Armstrong Ross',
                    companyId: 'c01',
                },
            };

            await service.send(notification);

            expect(model.create).toHaveBeenCalledWith({
                ...notification,
                message: 'Happy Birthday! Armstrong Ross'
            });
        });

        it('should throw error for unsupported notification type', async () => {
            const notification = {
                type: 'UNSUPPORTED' as NotificationType,
                userId: 'u01',
                companyId: 'c01',
                message: '',
                user: {
                    userId: 'u01',
                    name: 'Armstrong Ross',
                    companyId: 'c01',
                },
            };

            await expect(service.send(notification)).rejects.toThrow(
                'Notification type UNSUPPORTED not supported'
            );
            expect(model.create).not.toHaveBeenCalled();
        });
    });
});