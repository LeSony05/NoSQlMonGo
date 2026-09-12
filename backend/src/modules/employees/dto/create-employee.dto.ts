import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEmail, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class AddressDto {
  @IsString()
  street!: string;

  @IsString()
  district!: string;

  @IsString()
  city!: string;
}

export class CreateEmployeeDto {
  @IsString()
  employeeId!: string;

  @IsString()
  fullName!: string;

  @IsString()
  gender!: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @IsString()
  departmentCode!: string;

  @IsString()
  position!: string;

  @IsNumber()
  @Min(0)
  salary!: number;

  @IsDateString()
  hireDate!: string;

  @IsArray()
  @IsString({ each: true })
  skills!: string[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
