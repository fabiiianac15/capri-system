import api from '../lib/axios';

export type StaffType = 'ADMINISTRATIVO' | 'PRACTICANTE';

export interface Staff {
  id: string;
  fullName: string;
  dni: string;
  staffType: StaffType;
  salary: number;
  yearsExperience: number;
  specialization?: string | null;
  academicDegree?: string | null;
  managerId?: string | null;
  manager?: {
    id: string;
    fullName: string;
    dni: string;
    staffType: StaffType;
  } | null;
  subordinates?: Array<{
    id: string;
    fullName: string;
    dni: string;
    staffType: StaffType;
  }>;
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStaffDTO {
  fullName: string;
  dni: string;
  staffType: StaffType;
  salary: number;
  yearsExperience: number;
  specialization?: string;
  academicDegree?: string;
  managerId?: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
}

export interface UpdateStaffDTO {
  fullName?: string;
  dni?: string;
  staffType?: StaffType;
  salary?: number;
  yearsExperience?: number;
  specialization?: string;
  academicDegree?: string;
  managerId?: string;
  startDate?: string; // ISO string
  endDate?: string; // ISO string
}

export interface StaffStats {
  total: number;
  byType: Array<{
    staffType: string;
    count: number;
  }>;
  avgSalaryByType: Array<{
    staffType: string;
    avgSalary: number;
  }>;
}

export interface Manager {
  id: string;
  fullName: string;
  dni: string;
  staffType: StaffType;
}

export const staffService = {
  async getAll(filters?: { staffType?: string }): Promise<Staff[]> {
    const { data } = await api.get('/staff', { params: filters });
    return data.data;
  },

  async getById(id: string): Promise<Staff> {
    const { data } = await api.get(`/staff/${id}`);
    return data.data;
  },

  async create(staffData: CreateStaffDTO): Promise<Staff> {
    const { data } = await api.post('/staff', staffData);
    return data.data;
  },

  async update(id: string, staffData: UpdateStaffDTO): Promise<Staff> {
    const { data } = await api.put(`/staff/${id}`, staffData);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/staff/${id}`);
  },

  async getStats(): Promise<StaffStats> {
    const { data } = await api.get('/staff/stats');
    return data.data;
  },

  async getManagers(): Promise<Manager[]> {
    const { data } = await api.get('/staff/managers');
    return data.data;
  }
};
