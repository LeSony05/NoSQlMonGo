'use client';

import { Save, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import type { Employee } from '../services/api';

const blank: Employee = {
  employeeId: '',
  fullName: '',
  gender: 'Nam',
  dateOfBirth: '2000-01-01',
  email: '',
  phone: '',
  address: { street: '', district: '', city: '' },
  departmentCode: 'IT',
  position: '',
  salary: 0,
  hireDate: '2026-01-01',
  skills: [],
  active: true
};

type Props = {
  departments: Array<{ departmentCode: string; departmentName: string }>;
  employee?: Employee | null;
  onCancel: () => void;
  onSubmit: (employee: Employee) => Promise<void>;
};

export function EmployeeForm({ departments, employee, onCancel, onSubmit }: Props) {
  const initial = useMemo(() => {
    if (!employee) return blank;
    return { ...employee, skills: employee.skills || [] };
  }, [employee]);
  const [form, setForm] = useState<Employee>(initial);
  const [skill, setSkill] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();

    // Basic validation for required fields
    if (
      !form.employeeId || !form.fullName || !form.email || !form.phone ||
      !form.departmentCode || !form.position ||
      !form.address.street || !form.address.district || !form.address.city
    ) {
      alert('Bạn phải nhập đầy đủ thông tin!');
      return;
    }

    try {
      // Create a clean payload to avoid backend forbidNonWhitelisted errors
      const payload = {
        employeeId: form.employeeId,
        fullName: form.fullName,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth.slice(0, 10),
        email: form.email,
        phone: form.phone,
        address: {
          street: form.address.street,
          district: form.address.district,
          city: form.address.city
        },
        departmentCode: form.departmentCode,
        position: form.position,
        salary: Number(form.salary),
        hireDate: form.hireDate.slice(0, 10),
        skills: (form.skills || []).filter(Boolean),
        active: form.active
      };

      await onSubmit(payload as Employee);
    } catch (err: any) {
      alert('Lỗi khi lưu: ' + (err.message || 'Vui lòng kiểm tra lại thông tin'));
    }
  }

  function addSkill() {
    const next = skill.trim();
    const currentSkills = form.skills || [];
    if (!next || currentSkills.includes(next)) return;
    setForm({ ...form, skills: [...currentSkills, next] });
    setSkill('');
  }

  return (
    <div className="fixed inset-0 z-20 bg-black/30 p-4">
      <form onSubmit={submit} className="mx-auto grid max-w-3xl gap-4 rounded bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{employee ? 'Sửa nhân viên' : 'Thêm nhân viên'}</h2>
          <button type="button" onClick={onCancel} className="rounded p-2 hover:bg-mist" aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border p-2" placeholder="Mã NV" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
          <input className="rounded border p-2" placeholder="Họ tên" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <select className="rounded border p-2" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option>Nam</option>
            <option>Nữ</option>
          </select>
          <input className="rounded border p-2" type="date" value={form.dateOfBirth.slice(0, 10)} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          <input className="rounded border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="rounded border p-2" placeholder="Điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="relative">
            <input list="departments-list" className="w-full rounded border p-2" placeholder="Phòng ban" value={form.departmentCode} onChange={(e) => setForm({ ...form, departmentCode: e.target.value })} />
            <datalist id="departments-list">
              {departments.map(d => <option key={d.departmentCode} value={d.departmentCode}>{d.departmentName}</option>)}
            </datalist>
          </div>
          <input className="rounded border p-2" placeholder="Chức vụ" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <input className="rounded border p-2" type="number" placeholder="Lương" value={form.salary || ''} onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })} />
          <input className="rounded border p-2" type="date" value={form.hireDate.slice(0, 10)} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} />
          <input className="rounded border p-2" placeholder="Đường" value={form.address.street} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} />
          <input className="rounded border p-2" placeholder="Quận/Huyện" value={form.address.district} onChange={(e) => setForm({ ...form, address: { ...form.address, district: e.target.value } })} />
          <input className="rounded border p-2" placeholder="Thành phố" value={form.address.city} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
          <label className="flex items-center gap-2 rounded border p-2">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Đang làm việc
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(form.skills || []).map((item) => (
            <button key={item} type="button" onClick={() => setForm({ ...form, skills: (form.skills || []).filter((s) => s !== item) })} className="rounded bg-mist px-2 py-1 text-sm">
              {item} x
            </button>
          ))}
          <input 
            className="rounded border px-2 py-1" 
            value={skill} 
            onChange={(e) => setSkill(e.target.value)} 
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
            placeholder="Thêm kỹ năng..." 
          />
          <button type="button" onClick={addSkill} className="rounded border px-3 py-1">
            Thêm
          </button>
        </div>

        <button className="inline-flex w-fit items-center gap-2 rounded bg-teal px-4 py-2 text-white">
          <Save size={18} />
          Lưu
        </button>
      </form>
    </div>
  );
}
