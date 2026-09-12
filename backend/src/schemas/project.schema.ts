import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ _id: false })
export class ProjectMember {
  @Prop({ required: true, trim: true })
  employeeId!: string;

  @Prop({ required: true, trim: true })
  role!: string;

  @Prop({ required: true })
  joinDate!: Date;

  @Prop({ required: true, min: 0 })
  hoursPerWeek!: number;
}

@Schema({ collection: 'projects', timestamps: true })
export class Project {
  @Prop({ required: true, unique: true, trim: true })
  projectId!: string;

  @Prop({ required: true, trim: true })
  projectName!: string;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({ required: true, min: 0 })
  budget!: number;

  @Prop({ required: true, enum: ['Planning', 'In Progress', 'Completed'] })
  status!: string;

  @Prop({ required: true, trim: true })
  managerId!: string;

  @Prop({ type: [ProjectMember], default: [] })
  members!: ProjectMember[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
