import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from '../../schemas/employee.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>
  ) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('setup')
  async setup() {
    const defaultPassword = await bcrypt.hash('123456', 10);
    const employees = await this.employeeModel.find();
    
    let count = 0;
    for (const emp of employees) {
      if (!emp.password) {
        emp.password = defaultPassword;
        // Make the first user or 'IT' users admin, others user
        if (emp.departmentCode === 'IT' || count === 0) {
          emp.role = 'admin';
        } else {
          emp.role = 'user';
        }
        await emp.save();
        count++;
      }
    }
    return { message: `Cập nhật thành công ${count} tài khoản. Mật khẩu mặc định: 123456` };
  }
}
