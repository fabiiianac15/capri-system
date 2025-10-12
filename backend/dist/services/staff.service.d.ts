interface CreateStaffData {
    fullName: string;
    dni: string;
    staffType: 'ADMINISTRATIVO' | 'PRACTICANTE';
    salary: number;
    yearsExperience: number;
    specialization?: string;
    academicDegree?: string;
    managerId?: string;
    startDate: Date;
    endDate?: Date;
}
interface UpdateStaffData {
    fullName?: string;
    dni?: string;
    staffType?: 'ADMINISTRATIVO' | 'PRACTICANTE';
    salary?: number;
    yearsExperience?: number;
    specialization?: string;
    academicDegree?: string;
    managerId?: string;
    startDate?: Date;
    endDate?: Date;
}
declare class StaffService {
    create(data: CreateStaffData): Promise<{
        manager: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dni: string;
            fullName: string;
            staffType: string;
            salary: number;
            yearsExperience: number;
            specialization: string | null;
            academicDegree: string | null;
            managerId: string | null;
            startDate: Date;
            endDate: Date | null;
        } | null;
        subordinates: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dni: string;
            fullName: string;
            staffType: string;
            salary: number;
            yearsExperience: number;
            specialization: string | null;
            academicDegree: string | null;
            managerId: string | null;
            startDate: Date;
            endDate: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dni: string;
        fullName: string;
        staffType: string;
        salary: number;
        yearsExperience: number;
        specialization: string | null;
        academicDegree: string | null;
        managerId: string | null;
        startDate: Date;
        endDate: Date | null;
    }>;
    getAll(filters?: {
        staffType?: string;
    }): Promise<({
        manager: {
            id: string;
            dni: string;
            fullName: string;
            staffType: string;
        } | null;
        subordinates: {
            id: string;
            dni: string;
            fullName: string;
            staffType: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dni: string;
        fullName: string;
        staffType: string;
        salary: number;
        yearsExperience: number;
        specialization: string | null;
        academicDegree: string | null;
        managerId: string | null;
        startDate: Date;
        endDate: Date | null;
    })[]>;
    getById(id: string): Promise<{
        manager: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dni: string;
            fullName: string;
            staffType: string;
            salary: number;
            yearsExperience: number;
            specialization: string | null;
            academicDegree: string | null;
            managerId: string | null;
            startDate: Date;
            endDate: Date | null;
        } | null;
        subordinates: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dni: string;
            fullName: string;
            staffType: string;
            salary: number;
            yearsExperience: number;
            specialization: string | null;
            academicDegree: string | null;
            managerId: string | null;
            startDate: Date;
            endDate: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dni: string;
        fullName: string;
        staffType: string;
        salary: number;
        yearsExperience: number;
        specialization: string | null;
        academicDegree: string | null;
        managerId: string | null;
        startDate: Date;
        endDate: Date | null;
    }>;
    update(id: string, data: UpdateStaffData): Promise<{
        manager: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dni: string;
            fullName: string;
            staffType: string;
            salary: number;
            yearsExperience: number;
            specialization: string | null;
            academicDegree: string | null;
            managerId: string | null;
            startDate: Date;
            endDate: Date | null;
        } | null;
        subordinates: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dni: string;
            fullName: string;
            staffType: string;
            salary: number;
            yearsExperience: number;
            specialization: string | null;
            academicDegree: string | null;
            managerId: string | null;
            startDate: Date;
            endDate: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dni: string;
        fullName: string;
        staffType: string;
        salary: number;
        yearsExperience: number;
        specialization: string | null;
        academicDegree: string | null;
        managerId: string | null;
        startDate: Date;
        endDate: Date | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dni: string;
        fullName: string;
        staffType: string;
        salary: number;
        yearsExperience: number;
        specialization: string | null;
        academicDegree: string | null;
        managerId: string | null;
        startDate: Date;
        endDate: Date | null;
    }>;
    getStats(): Promise<{
        total: number;
        byType: {
            staffType: string;
            count: number;
        }[];
        avgSalaryByType: {
            staffType: string;
            avgSalary: number;
        }[];
    }>;
    getManagers(): Promise<{
        id: string;
        dni: string;
        fullName: string;
        staffType: string;
    }[]>;
}
declare const _default: StaffService;
export default _default;
//# sourceMappingURL=staff.service.d.ts.map