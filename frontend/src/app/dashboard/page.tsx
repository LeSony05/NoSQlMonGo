'use client';

import { BarChart3, FolderKanban, Users } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { api, Employee, Project } from '../../services/api';

const money = new Intl.NumberFormat('vi-VN');

export default function DashboardPage() {
  const [overview, setOverview] = useState<Record<string, number>>({});
  const [departments, setDepartments] = useState<Array<{ _id: string; totalEmployees: number; avgSalary: number; maxSalary: number; minSalary: number }>>([]);
  const [skills, setSkills] = useState<Array<{ _id: string; count: number }>>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  const [budgetSort, setBudgetSort] = useState<'asc' | 'desc'>('desc');
  const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const maxSkill = Math.max(...skills.map((skill) => skill.count), 1);
  const filteredProjects = projects
    .filter((project) => (projectStatus ? project.status === projectStatus : true))
    .filter((project) => project.projectName.toLowerCase().includes(projectSearch.toLowerCase()) || project.projectId.toLowerCase().includes(projectSearch.toLowerCase()))
    .sort((a, b) => (budgetSort === 'desc' ? b.budget - a.budget : a.budget - b.budget));

  useEffect(() => {
    Promise.all([api.overview(), api.departmentsStats(), api.skillsStats(), api.projects()]).then(
      ([overviewData, departmentData, skillData, projectData]) => {
        setOverview(overviewData);
        setDepartments(departmentData);
        setSkills(skillData);
        setProjects(projectData);
      }
    );
  }, []);

  async function showDepartmentEmployees(code: string) {
    setDepartmentEmployees(await api.employees(`?departmentCode=${code}&sortBy=salary&sortOrder=desc`));
  }

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-semibold">Dashboard HRM & Dự án</h1>

      <div className="grid gap-3 md:grid-cols-4">
        <Metric icon={<Users size={20} />} label="Nhân viên" value={overview.totalEmployees ?? 0} />
        <Metric icon={<Users size={20} />} label="Đang làm" value={overview.activeEmployees ?? 0} />
        <Metric icon={<FolderKanban size={20} />} label="Dự án" value={overview.totalProjects ?? 0} />
        <Metric icon={<BarChart3 size={20} />} label="Ngân sách chạy" value={`${money.format(overview.runningBudget ?? 0)} đ`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-semibold">Thống kê phòng ban</h2>
          <div className="space-y-2">
            {departments.map((item) => (
              <button key={item._id} onClick={() => showDepartmentEmployees(item._id)} className="grid w-full grid-cols-4 gap-2 rounded border p-3 text-left text-sm hover:bg-mist">
                <span className="font-semibold">{item._id}</span>
                <span>{item.totalEmployees} NV</span>
                <span>TB {money.format(Math.round(item.avgSalary))}</span>
                <span>{money.format(item.minSalary)} - {money.format(item.maxSalary)}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {departmentEmployees.map((employee) => (
              <div key={employee.employeeId} className="flex justify-between rounded bg-mist px-3 py-2 text-sm">
                <span>{employee.fullName}</span>
                <span>{money.format(employee.salary)} đ</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-semibold">Thống kê kỹ năng</h2>
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill._id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{skill._id}</span>
                  <span>{skill.count}</span>
                </div>
                <div className="h-2 rounded bg-mist">
                  <div className="h-2 rounded bg-teal" style={{ width: `${(skill.count / maxSkill) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded border border-slate-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Quản lý dự án</h2>
          <div className="grid gap-2 md:grid-cols-3">
            <input className="rounded border px-3 py-2 text-sm" placeholder="Tìm dự án" value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} />
            <select className="rounded border px-3 py-2 text-sm" value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select className="rounded border px-3 py-2 text-sm" value={budgetSort} onChange={(e) => setBudgetSort(e.target.value as 'asc' | 'desc')}>
              <option value="desc">Budget giảm</option>
              <option value="asc">Budget tăng</option>
            </select>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <button key={project.projectId} onClick={() => setSelectedProject(project)} className="rounded border p-4 text-left hover:bg-mist">
              <div className="flex justify-between gap-3">
                <span className="font-semibold">{project.projectName}</span>
                <span className="text-sm">{project.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">PM: {project.managerId} - {money.format(project.budget)} đ</p>
            </button>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-10 bg-black/30 p-4" onClick={() => setSelectedProject(null)}>
          <div className="mx-auto max-w-2xl rounded bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-xl font-semibold">{selectedProject.projectName}</h2>
            <p className="mt-2 text-slate-600">Project Manager: {selectedProject.managerId}</p>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="bg-mist">
                <tr>
                  <th className="p-2">Nhân viên</th>
                  <th className="p-2">Vai trò</th>
                  <th className="p-2">Giờ/tuần</th>
                </tr>
              </thead>
              <tbody>
                {selectedProject.members.map((member) => (
                  <tr key={`${member.employeeId}-${member.role}`} className="border-t">
                    <td className="p-2">{member.employeeId}</td>
                    <td className="p-2">{member.role}</td>
                    <td className="p-2">{member.hoursPerWeek}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <div className="mb-3 text-teal">{icon}</div>
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
