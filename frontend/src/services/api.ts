const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export type Address = {
  street: string;
  district: string;
  city: string;
};

export type Employee = {
  employeeId: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: Address;
  departmentCode: string;
  position: string;
  salary: number;
  hireDate: string;
  skills: string[];
  active: boolean;
};

export type Project = {
  projectId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'Planning' | 'In Progress' | 'Completed';
  managerId: string;
  members: Array<{ employeeId: string; role: string; joinDate: string; hoursPerWeek: number }>;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>)
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store'
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (payload: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
  },
  departments: () => request<Array<{ departmentCode: string; departmentName: string }>>('/departments'),
  employees: (params = '') => request<Employee[]>(`/employees${params}`),
  employee: (id: string) => request<Employee>(`/employees/${id}`),
  createEmployee: (payload: Employee) => request<Employee>('/employees', { method: 'POST', body: JSON.stringify(payload) }),
  updateEmployee: (id: string, payload: Partial<Employee>) =>
    request<Employee>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteEmployee: (id: string) => request<Employee>(`/employees/${id}`, { method: 'DELETE' }),
  overview: () => request<Record<string, number>>('/dashboard/overview'),
  departmentsStats: () =>
    request<Array<{ _id: string; totalEmployees: number; avgSalary: number; maxSalary: number; minSalary: number }>>(
      '/dashboard/departments-stats'
    ),
  skillsStats: () => request<Array<{ _id: string; count: number }>>('/dashboard/skills-stats'),
  projects: (params = '') => request<Project[]>(`/projects${params}`),
  project: (id: string) => request<Project>(`/projects/${id}`)
};
