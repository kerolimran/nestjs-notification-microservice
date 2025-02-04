import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { EmailChannelService } from './channels/email-channel.service';
import { UIChannelService } from './channels/ui-channel.service';
import { ChannelFactory } from './factories/channel.factory';
import { Notification, NotificationSchema } from './schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/notifications'),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    EmailChannelService,
    UIChannelService,
    ChannelFactory,
  ],
})
export class AppModule { }