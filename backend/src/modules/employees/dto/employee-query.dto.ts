import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class EmployeeQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  departmentCode?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  minSalary?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  maxSalary?: number;

  @IsOptional()
  @IsIn(['salary', 'fullName', 'departmentCode', 'hireDate'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
