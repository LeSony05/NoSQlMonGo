import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { throwIfMissing } from '../../common/not-found';
import { Employee, EmployeeDocument } from '../../schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(@InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>) {}

  findAll(query: EmployeeQueryDto) {
    const filter: FilterQuery<EmployeeDocument> = {};

    if (query.search) {
      filter.$or = [
        { employeeId: new RegExp(query.search, 'i') },
        { fullName: new RegExp(query.search, 'i') }
      ];
    }
    if (query.departmentCode) filter.departmentCode = query.departmentCode;
    if (typeof query.active === 'boolean') filter.active = query.active;
    if (query.minSalary || query.maxSalary) {
      filter.salary = {};
      if (query.minSalary) filter.salary.$gte = query.minSalary;
      if (query.maxSalary) filter.salary.$lte = query.maxSalary;
    }

    const sortBy = query.sortBy ?? 'employeeId';
    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;

    return this.employeeModel.find(filter).sort({ [sortBy]: sortOrder }).lean();
  }

  async findOne(employeeId: string) {
    return throwIfMissing(await this.employeeModel.findOne({ employeeId }).lean(), 'Employee');
  }

  async create(dto: CreateEmployeeDto) {
    const data = { ...dto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.employeeModel.create(data);
  }

  async update(employeeId: string, dto: UpdateEmployeeDto) {
    const data = { ...dto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return throwIfMissing(
      await this.employeeModel.findOneAndUpdate({ employeeId }, data, { new: true }).lean(),
      'Employee'
    );
  }

  async remove(employeeId: string) {
    return throwIfMissing(await this.employeeModel.findOneAndDelete({ employeeId }).lean(), 'Employee');
  }

  async addSkill(employeeId: string, skill: string) {
    return throwIfMissing(
      await this.employeeModel.findOneAndUpdate({ employeeId }, { $addToSet: { skills: skill } }, { new: true }).lean(),
      'Employee'
    );
  }

  async removeSkill(employeeId: string, skill: string) {
    return throwIfMissing(
      await this.employeeModel.findOneAndUpdate({ employeeId }, { $pull: { skills: skill } }, { new: true }).lean(),
      'Employee'
    );
  }
}
