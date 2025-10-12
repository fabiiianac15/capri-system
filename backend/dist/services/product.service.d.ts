export declare const productService: {
    getAll(): Promise<({
        outputs: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            notes: string | null;
            date: Date;
            quantity: number;
            productId: string;
            userId: string;
        })[];
        supplier: ({
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
        }) | null;
    } & {
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
    })[]>;
    getById(id: string): Promise<({
        outputs: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            notes: string | null;
            date: Date;
            quantity: number;
            productId: string;
            userId: string;
        })[];
        supplier: ({
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
        }) | null;
    } & {
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
    }) | null>;
    create(data: {
        name: string;
        category: string;
        description?: string;
        currentStock: number;
        minStock: number;
        unit: string;
        price: number;
        supplierId?: string;
        location?: string;
        expirationDate?: Date;
    }): Promise<{
        supplier: {
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
        } | null;
    } & {
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
    }>;
    update(id: string, data: {
        name?: string;
        category?: string;
        description?: string;
        currentStock?: number;
        minStock?: number;
        unit?: string;
        price?: number;
        supplierId?: string;
        location?: string;
        expirationDate?: Date;
    }): Promise<{
        supplier: {
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
        } | null;
    } & {
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
    }>;
    delete(id: string): Promise<{
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
    }>;
    createOutput(data: {
        productId: string;
        userId: string;
        quantity: number;
        notes?: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        product: {
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
        };
    } & {
        id: string;
        notes: string | null;
        date: Date;
        quantity: number;
        productId: string;
        userId: string;
    }>;
    getOutputs(productId: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        notes: string | null;
        date: Date;
        quantity: number;
        productId: string;
        userId: string;
    })[]>;
    getLowStockProducts(): Promise<({
        supplier: {
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
        } | null;
    } & {
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
    })[]>;
    getStats(): Promise<{
        total: number;
        lowStock: number;
        byCategory: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ProductGroupByOutputType, "category"[]> & {
            _count: {
                category: number;
            };
            _sum: {
                currentStock: number | null;
            };
        })[];
        totalValue: number;
    }>;
};
//# sourceMappingURL=product.service.d.ts.map