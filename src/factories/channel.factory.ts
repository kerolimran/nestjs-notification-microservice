import { Injectable } from '@nestjs/common';
import { EmailChannelService } from '../channels/email-channel.service';
import { UIChannelService } from '../channels/ui-channel.service';
import { ChannelType } from '../interfaces/notification.interface';

@Injectable()
export class ChannelFactory {
    constructor(
        private readonly emailChannel: EmailChannelService,
        private readonly uiChannel: UIChannelService,
    ) { }

    getChannel(type: ChannelType) {
        switch (type) {
            case ChannelType.EMAIL:
                return this.emailChannel;
            case ChannelType.UI:
                return this.uiChannel;
            default:
                throw new Error(`Channel type ${type} not supported`);
        }
    }
}