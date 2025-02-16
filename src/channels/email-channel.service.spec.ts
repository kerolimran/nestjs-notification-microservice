import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailChannelService } from './email-channel.service';
import { Notification, NotificationDocument } from '../schemas/notification.schema';
import { NotificationType } from '../interfaces/notification.interface';

describe('EmailChannelService', () => {
    let service: EmailChannelService;
    let mockNotificationModel: Model<NotificationDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailChannelService,
                {
                    provide: getModelToken(Notification.name),
                    useValue: Model
                }
            ],
        }).compile();

        service = module.get<EmailChannelService>(EmailChannelService);
        mockNotificationModel = module.get<Model<NotificationDocument>>(getModelToken(Notification.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('send', () => {
        let consoleSpy: jest.SpyInstance;

        beforeEach(() => {
            consoleSpy = jest.spyOn(console, 'log');
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('should send monthly payslip notification', async () => {
            const notification = {
                type: NotificationType.MONTHLY_PAYSLIP,
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

            expect(consoleSpy).toHaveBeenCalledWith('Subject: Monthly Payslip for this month');
            expect(consoleSpy).toHaveBeenCalledWith('Body: Hi Armstrong Ross! Your monthly payslip for this month is ready.');
        });

        it('should send birthday notification', async () => {
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

            expect(consoleSpy).toHaveBeenCalledWith('Subject: Happy Birthday! Armstrong Ross');
            expect(consoleSpy).toHaveBeenCalledWith('Body: Hi Armstrong Ross, We wish you a very happy birthday!');
        });
    });
});