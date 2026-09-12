import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from '../../schemas/employee.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.employeeModel.findOne({ employeeId: loginDto.employeeId }).select('+password').lean();
    if (!user) {
      throw new UnauthorizedException('Sai mã nhân viên hoặc mật khẩu');
    }

    if (!user.password) {
      throw new UnauthorizedException('Tài khoản chưa được cấp mật khẩu');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Sai mã nhân viên hoặc mật khẩu');
    }

    const payload = { sub: user.employeeId, role: user.role, fullName: user.fullName };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        employeeId: user.employeeId,
        fullName: user.fullName,
        role: user.role
      }
    };
  }
}
