import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from '../../schemas/department.schema';

@Injectable()
export class DepartmentsService {
  constructor(@InjectModel(Department.name) private readonly departmentModel: Model<DepartmentDocument>) {}

  findAll() {
    return this.departmentModel.find().sort({ departmentCode: 1 }).lean();
  }
}
