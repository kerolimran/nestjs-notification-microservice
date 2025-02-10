import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SubscriptionService } from './subscription.service';
import { ChannelType } from '../interfaces/notification.interface';

describe('SubscriptionService', () => {
    let service: SubscriptionService;

    const mockSubscriptionModel = {
        findOne: jest.fn(),
        create: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubscriptionService,
                {
                    provide: getModelToken('Subscription'),
                    useValue: mockSubscriptionModel,
                },
            ],
        }).compile();

        service = module.get<SubscriptionService>(SubscriptionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should check if user is subscribed', async () => {
        mockSubscriptionModel.findOne.mockResolvedValue({ isActive: true });

        const result = await service.isSubscribed(
            'user1',
            'company1',
            ChannelType.EMAIL,
        );

        expect(result).toBeTruthy();
        expect(mockSubscriptionModel.findOne).toHaveBeenCalledWith({
            userId: 'user1',
            companyId: 'company1',
            channelType: ChannelType.EMAIL,
            isActive: true,
        });
    });
});