import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema({ collection: 'departments', timestamps: true })
export class Department {
  @Prop({ required: true, unique: true, trim: true })
  departmentCode!: string;

  @Prop({ required: true, trim: true })
  departmentName!: string;

  @Prop({ required: true, trim: true })
  location!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ default: true })
  active!: boolean;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
