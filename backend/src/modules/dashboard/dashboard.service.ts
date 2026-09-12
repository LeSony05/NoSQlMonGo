import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from '../../schemas/department.schema';
import { Employee, EmployeeDocument } from '../../schemas/employee.schema';
import { Project, ProjectDocument } from '../../schemas/project.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: Model<DepartmentDocument>,
    @InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>,
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>
  ) {}

  async overview() {
    const [
      totalDepartments,
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalProjects,
      inProgressProjects,
      completedProjects,
      budgetRows
    ] = await Promise.all([
      this.departmentModel.countDocuments(),
      this.employeeModel.countDocuments(),
      this.employeeModel.countDocuments({ active: true }),
      this.employeeModel.countDocuments({ active: false }),
      this.projectModel.countDocuments(),
      this.projectModel.countDocuments({ status: 'In Progress' }),
      this.projectModel.countDocuments({ status: 'Completed' }),
      this.projectModel.aggregate([
        { $match: { status: 'In Progress' } },
        { $group: { _id: null, totalBudget: { $sum: '$budget' } } }
      ])
    ]);

    return {
      totalDepartments,
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalProjects,
      inProgressProjects,
      completedProjects,
      runningBudget: budgetRows[0]?.totalBudget ?? 0
    };
  }

  departmentsStats() {
    return this.employeeModel.aggregate([
      {
        $group: {
          _id: '$departmentCode',
          totalEmployees: { $sum: 1 },
          avgSalary: { $avg: '$salary' },
          maxSalary: { $max: '$salary' },
          minSalary: { $min: '$salary' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  skillsStats() {
    return this.employeeModel.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]);
  }
}
