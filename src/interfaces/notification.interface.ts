export enum NotificationType {
    LEAVE_BALANCE_REMINDER = 'leave-balance-reminder',
    MONTHLY_PAYSLIP = 'monthly-payslip',
    HAPPY_BIRTHDAY = 'happy-birthday',
}

export enum ChannelType {
    EMAIL = 'email',
    UI = 'ui',
}

export interface INotification {
    companyId: string;
    userId: string;
    type: NotificationType;
    createdAt?: Date;
}


