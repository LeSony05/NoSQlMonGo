import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  overview() {
    return this.dashboardService.overview();
  }

  @Get('departments-stats')
  departmentsStats() {
    return this.dashboardService.departmentsStats();
  }

  @Get('skills-stats')
  skillsStats() {
    return this.dashboardService.skillsStats();
  }
}
