import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
    @Prop({ type: String, required: true, unique: true, index: true })
    userId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, index: true })
    companyId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes
UserSchema.index({ userId: 1, companyId: 1 });
