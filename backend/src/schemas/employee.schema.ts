import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema({ _id: false })
export class Address {
  @Prop({ required: true, trim: true })
  street!: string;

  @Prop({ required: true, trim: true })
  district!: string;

  @Prop({ required: true, trim: true })
  city!: string;
}

@Schema({ collection: 'employees', timestamps: true })
export class Employee {
  @Prop({ required: true, unique: true, trim: true })
  employeeId!: string;

  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, trim: true })
  gender!: string;

  @Prop({ required: true })
  dateOfBirth!: Date;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ required: true, type: Address })
  address!: Address;

  @Prop({ required: true, trim: true, index: true })
  departmentCode!: string;

  @Prop({ required: true, trim: true })
  position!: string;

  @Prop({ required: true, min: 0, index: true })
  salary!: number;

  @Prop({ required: true })
  hireDate!: Date;

  @Prop({ type: [String], default: [] })
  skills!: string[];

  @Prop({ default: true, index: true })
  active!: boolean;

  @Prop({ select: false })
  password?: string;

  @Prop({ default: 'user' })
  role!: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
EmployeeSchema.index({ departmentCode: 1, salary: -1 });
