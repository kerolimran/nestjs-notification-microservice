import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { EmailChannelService } from './channels/email-channel.service';
import { UIChannelService } from './channels/ui-channel.service';
import { ChannelFactory } from './factories/channel.factory';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { SubscriptionService } from './services/subscription.service';
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Company, CompanySchema } from './schemas/company.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/notifications'),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    SubscriptionService,
    EmailChannelService,
    UIChannelService,
    ChannelFactory,
  ],
})
export class AppModule { }