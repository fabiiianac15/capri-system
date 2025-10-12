export interface CreateGoatData {
    customId: string;
    name?: string;
    breed: string;
    sex: 'MALE' | 'FEMALE';
    birthDate: Date;
    weight?: number;
    category?: 'CRIA' | 'LEVANTE_1' | 'LEVANTE_2' | 'REPRODUCTOR' | 'LECHERA';
    motherId?: string;
    fatherId?: string;
    notes?: string;
}
export interface UpdateGoatData {
    name?: string;
    breed?: string;
    weight?: number;
    category?: string;
    status?: string;
    milkProduction?: number;
    feedConsumption?: number;
    notes?: string;
}
declare class GoatService {
    create(data: CreateGoatData): Promise<{
        mother: {
            id: string;
            name: string | null;
            customId: string;
        } | null;
        vaccines: {
            id: string;
            name: string;
            createdAt: Date;
            notes: string | null;
            applicationDate: Date;
            unit: string;
            goatId: string;
            dose: number;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        customId: string;
        breed: string;
        sex: string;
        birthDate: Date;
        weight: number | null;
        category: string;
        milkProduction: number;
        feedConsumption: number;
        birthCount: number;
        status: string;
        notes: string | null;
        motherId: string | null;
        fatherId: string | null;
    }>;
    getAll(filters?: {
        category?: string;
        breed?: string;
        status?: string;
        sex?: string;
    }): Promise<({
        mother: {
            id: string;
            name: string | null;
            customId: string;
        } | null;
        vaccines: {
            id: string;
            name: string;
            createdAt: Date;
            notes: string | null;
            applicationDate: Date;
            unit: string;
            goatId: string;
            dose: number;
        }[];
        reproductiveData: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            mountingDate: Date;
            goatId: string;
            maleId: string;
            maleCustomId: string;
            maleBreed: string;
            expectedBirth: Date;
            actualBirthDate: Date | null;
            wasAbortion: boolean;
            birthNumber: number;
            femaleOffspring: number;
            maleOffspring: number;
            totalOffspring: number;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        customId: string;
        breed: string;
        sex: string;
        birthDate: Date;
        weight: number | null;
        category: string;
        milkProduction: number;
        feedConsumption: number;
        birthCount: number;
        status: string;
        notes: string | null;
        motherId: string | null;
        fatherId: string | null;
    })[]>;
    getById(id: string): Promise<{
        mother: {
            id: string;
            name: string | null;
            customId: string;
            breed: string;
        } | null;
        offspring: {
            id: string;
            name: string | null;
            customId: string;
            sex: string;
            birthDate: Date;
        }[];
        vaccines: {
            id: string;
            name: string;
            createdAt: Date;
            notes: string | null;
            applicationDate: Date;
            unit: string;
            goatId: string;
            dose: number;
        }[];
        reproductiveData: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            mountingDate: Date;
            goatId: string;
            maleId: string;
            maleCustomId: string;
            maleBreed: string;
            expectedBirth: Date;
            actualBirthDate: Date | null;
            wasAbortion: boolean;
            birthNumber: number;
            femaleOffspring: number;
            maleOffspring: number;
            totalOffspring: number;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        customId: string;
        breed: string;
        sex: string;
        birthDate: Date;
        weight: number | null;
        category: string;
        milkProduction: number;
        feedConsumption: number;
        birthCount: number;
        status: string;
        notes: string | null;
        motherId: string | null;
        fatherId: string | null;
    }>;
    getByCustomId(customId: string): Promise<{
        mother: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            customId: string;
            breed: string;
            sex: string;
            birthDate: Date;
            weight: number | null;
            category: string;
            milkProduction: number;
            feedConsumption: number;
            birthCount: number;
            status: string;
            notes: string | null;
            motherId: string | null;
            fatherId: string | null;
        } | null;
        offspring: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            customId: string;
            breed: string;
            sex: string;
            birthDate: Date;
            weight: number | null;
            category: string;
            milkProduction: number;
            feedConsumption: number;
            birthCount: number;
            status: string;
            notes: string | null;
            motherId: string | null;
            fatherId: string | null;
        }[];
        vaccines: {
            id: string;
            name: string;
            createdAt: Date;
            notes: string | null;
            applicationDate: Date;
            unit: string;
            goatId: string;
            dose: number;
        }[];
        reproductiveData: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            mountingDate: Date;
            goatId: string;
            maleId: string;
            maleCustomId: string;
            maleBreed: string;
            expectedBirth: Date;
            actualBirthDate: Date | null;
            wasAbortion: boolean;
            birthNumber: number;
            femaleOffspring: number;
            maleOffspring: number;
            totalOffspring: number;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        customId: string;
        breed: string;
        sex: string;
        birthDate: Date;
        weight: number | null;
        category: string;
        milkProduction: number;
        feedConsumption: number;
        birthCount: number;
        status: string;
        notes: string | null;
        motherId: string | null;
        fatherId: string | null;
    }>;
    update(id: string, data: UpdateGoatData): Promise<{
        mother: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            customId: string;
            breed: string;
            sex: string;
            birthDate: Date;
            weight: number | null;
            category: string;
            milkProduction: number;
            feedConsumption: number;
            birthCount: number;
            status: string;
            notes: string | null;
            motherId: string | null;
            fatherId: string | null;
        } | null;
        vaccines: {
            id: string;
            name: string;
            createdAt: Date;
            notes: string | null;
            applicationDate: Date;
            unit: string;
            goatId: string;
            dose: number;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        customId: string;
        breed: string;
        sex: string;
        birthDate: Date;
        weight: number | null;
        category: string;
        milkProduction: number;
        feedConsumption: number;
        birthCount: number;
        status: string;
        notes: string | null;
        motherId: string | null;
        fatherId: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        customId: string;
        breed: string;
        sex: string;
        birthDate: Date;
        weight: number | null;
        category: string;
        milkProduction: number;
        feedConsumption: number;
        birthCount: number;
        status: string;
        notes: string | null;
        motherId: string | null;
        fatherId: string | null;
    }>;
    getStats(): Promise<{
        total: number;
        byCategory: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.GoatGroupByOutputType, "category"[]> & {
            _count: number;
        })[];
        byBreed: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.GoatGroupByOutputType, "breed"[]> & {
            _count: number;
        })[];
        bySex: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.GoatGroupByOutputType, "sex"[]> & {
            _count: number;
        })[];
        totalMilkProduction: number;
    }>;
    updateCategoryByWeight(id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        customId: string;
        breed: string;
        sex: string;
        birthDate: Date;
        weight: number | null;
        category: string;
        milkProduction: number;
        feedConsumption: number;
        birthCount: number;
        status: string;
        notes: string | null;
        motherId: string | null;
        fatherId: string | null;
    }>;
}
declare const _default: GoatService;
export default _default;
//# sourceMappingURL=goat.service.d.ts.map