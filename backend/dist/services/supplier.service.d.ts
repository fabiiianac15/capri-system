export declare const supplierService: {
    getAll(): Promise<({
        city: ({
            state: {
                country: {
                    id: string;
                    name: string;
                    code: string;
                };
            } & {
                id: string;
                name: string;
                countryId: string;
            };
        } & {
            id: string;
            name: string;
            stateId: string;
        }) | null;
        products: {
            id: string;
            name: string;
            category: string;
        }[];
    } & {
        id: string;
        email: string | null;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        nit: string | null;
        address: string | null;
        cityId: string | null;
        description: string | null;
    })[]>;
    getById(id: string): Promise<({
        city: ({
            state: {
                country: {
                    id: string;
                    name: string;
                    code: string;
                };
            } & {
                id: string;
                name: string;
                countryId: string;
            };
        } & {
            id: string;
            name: string;
            stateId: string;
        }) | null;
        products: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            description: string | null;
            currentStock: number;
            minStock: number;
            unit: string;
            price: number;
            supplierId: string | null;
            location: string | null;
            expirationDate: Date | null;
        }[];
    } & {
        id: string;
        email: string | null;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        nit: string | null;
        address: string | null;
        cityId: string | null;
        description: string | null;
    }) | null>;
    create(data: {
        name: string;
        nit?: string;
        phone?: string;
        email?: string;
        address?: string;
        cityId?: string;
    }): Promise<{
        city: ({
            state: {
                country: {
                    id: string;
                    name: string;
                    code: string;
                };
            } & {
                id: string;
                name: string;
                countryId: string;
            };
        } & {
            id: string;
            name: string;
            stateId: string;
        }) | null;
    } & {
        id: string;
        email: string | null;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        nit: string | null;
        address: string | null;
        cityId: string | null;
        description: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        nit?: string;
        phone?: string;
        email?: string;
        address?: string;
        cityId?: string;
    }): Promise<{
        city: ({
            state: {
                country: {
                    id: string;
                    name: string;
                    code: string;
                };
            } & {
                id: string;
                name: string;
                countryId: string;
            };
        } & {
            id: string;
            name: string;
            stateId: string;
        }) | null;
    } & {
        id: string;
        email: string | null;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        nit: string | null;
        address: string | null;
        cityId: string | null;
        description: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        nit: string | null;
        address: string | null;
        cityId: string | null;
        description: string | null;
    }>;
    getCountries(): Promise<{
        id: string;
        name: string;
        code: string;
    }[]>;
    getStatesByCountry(countryId: string): Promise<{
        id: string;
        name: string;
        countryId: string;
    }[]>;
    getCitiesByState(stateId: string): Promise<{
        id: string;
        name: string;
        stateId: string;
    }[]>;
};
//# sourceMappingURL=supplier.service.d.ts.map