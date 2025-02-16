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
import { NotificationRepository } from './repositories/notification.repository';
import { SubscriptionController } from './controllers/subscription.controller';
import { User, UserSchema } from './schemas/user.schema';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/notifications'),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [NotificationController, SubscriptionController],
  providers: [
    NotificationService,
    SubscriptionService,
    EmailChannelService,
    UIChannelService,
    ChannelFactory,
    NotificationRepository
  ],
})
export class AppModule { }