import { IsIn, IsOptional } from 'class-validator';

export class ProjectQueryDto {
  @IsOptional()
  @IsIn(['Planning', 'In Progress', 'Completed'])
  status?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortBudget?: 'asc' | 'desc';
}
