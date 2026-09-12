'use client';

import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { EmployeeForm } from '../../components/EmployeeForm';
import { api, Employee } from '../../services/api';

const money = new Intl.NumberFormat('vi-VN');

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Array<{ departmentCode: string; departmentName: string }>>([]);
  const [search, setSearch] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');
  const [active, setActive] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editing, setEditing] = useState<Employee | null>(null);
  const [detail, setDetail] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);

  const params = useMemo(() => {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (departmentCode) query.set('departmentCode', departmentCode);
    if (active) query.set('active', active);
    if (minSalary) query.set('minSalary', minSalary);
    if (maxSalary) query.set('maxSalary', maxSalary);
    query.set('sortBy', 'salary');
    query.set('sortOrder', sortOrder);
    return `?${query.toString()}`;
  }, [active, departmentCode, maxSalary, minSalary, search, sortOrder]);

  async function load() {
    const [empData, depData] = await Promise.all([
      api.employees(params),
      api.departments()
    ]);
    setEmployees(empData);
    setDepartments(depData);
  }

  const [userRole, setUserRole] = useState<string>('user');

  useEffect(() => {
    load();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserRole(JSON.parse(storedUser).role);
    }
  }, [params]);

  async function removeEmployee(id: string) {
    await api.deleteEmployee(id);
    await load();
  }

  async function saveEmployee(employee: Employee) {
    if (editing) {
      await api.updateEmployee(editing.employeeId, employee);
    } else {
      await api.createEmployee(employee);
    }
    setShowForm(false);
    setEditing(null);
    await load();
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Quản lý nhân viên</h1>
        {userRole === 'admin' && (
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded bg-teal px-4 py-2 text-white">
            <Plus size={18} />
            Thêm
          </button>
        )}
      </div>

      <div className="grid gap-3 rounded border border-slate-200 bg-white p-4 md:grid-cols-6">
        <label className="flex items-center gap-2 rounded border px-3 py-2">
          <Search size={18} />
          <input className="w-full outline-none" placeholder="Tìm mã hoặc tên" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <select className="rounded border px-3 py-2" value={departmentCode} onChange={(e) => setDepartmentCode(e.target.value)}>
          <option value="">Tất cả phòng ban</option>
          {departments.map((d) => (
            <option key={d.departmentCode} value={d.departmentCode}>{d.departmentName || d.departmentCode}</option>
          ))}
        </select>
        <select className="rounded border px-3 py-2" value={active} onChange={(e) => setActive(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <input className="rounded border px-3 py-2" type="number" placeholder="Lương từ" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} />
        <input className="rounded border px-3 py-2" type="number" placeholder="Lương đến" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} />
        <select className="rounded border px-3 py-2" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
          <option value="desc">Lương giảm dần</option>
          <option value="asc">Lương tăng dần</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-mist text-slate-600">
            <tr>
              <th className="p-3">Mã</th>
              <th className="p-3">Họ tên</th>
              <th className="p-3">Phòng</th>
              <th className="p-3">Chức vụ</th>
              <th className="p-3">Lương</th>
              <th className="p-3">Kỹ năng</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employeeId} className="border-t">
                <td className="p-3 font-medium">{employee.employeeId}</td>
                <td className="p-3">{employee.fullName}</td>
                <td className="p-3">{employee.departmentCode}</td>
                <td className="p-3">{employee.position}</td>
                <td className="p-3">{money.format(employee.salary)} đ</td>
                <td className="p-3">{employee.skills.join(', ')}</td>
                <td className="p-3">{employee.active ? 'Active' : 'Inactive'}</td>
                <td className="flex gap-1 p-3">
                  <button className="rounded p-2 hover:bg-mist" onClick={() => setDetail(employee)} aria-label="Xem">
                    <Eye size={16} />
                  </button>
                  {userRole === 'admin' && (
                    <>
                      <button className="rounded p-2 hover:bg-mist" onClick={() => { setEditing(employee); setShowForm(true); }} aria-label="Sửa">
                        <Pencil size={16} />
                      </button>
                      <button className="rounded p-2 text-coral hover:bg-mist" onClick={() => removeEmployee(employee.employeeId)} aria-label="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <EmployeeForm departments={departments} employee={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSubmit={saveEmployee} />}
      {detail && (
        <div className="fixed inset-0 z-10 bg-black/30 p-4" onClick={() => setDetail(null)}>
          <div className="mx-auto max-w-xl rounded bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-xl font-semibold">{detail.fullName}</h2>
            <p className="mt-2 text-slate-600">{detail.position} - {detail.departmentCode}</p>
            <p className="mt-2">{detail.address.street}, {detail.address.district}, {detail.address.city}</p>
            <p className="mt-2">Email: {detail.email}</p>
            <p>Điện thoại: {detail.phone}</p>
          </div>
        </div>
      )}
    </section>
  );
}
