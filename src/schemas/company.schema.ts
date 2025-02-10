
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema()
export class Company {
    @Prop({ required: true, unique: true })
    companyId: string;

    @Prop({ required: true })
    companyName: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);