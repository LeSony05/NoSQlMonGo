import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { throwIfMissing } from '../../common/not-found';
import { Project, ProjectDocument } from '../../schemas/project.schema';
import { ProjectQueryDto } from './dto/project-query.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>) {}

  findAll(query: ProjectQueryDto) {
    const filter = query.status ? { status: query.status } : {};
    const sort: Record<string, SortOrder> = query.sortBudget
      ? { budget: query.sortBudget === 'desc' ? -1 : 1 }
      : { projectId: 1 };

    return this.projectModel.find(filter).sort(sort).lean();
  }

  async findOne(projectId: string) {
    return throwIfMissing(await this.projectModel.findOne({ projectId }).lean(), 'Project');
  }
}
