type ProductType = 'CARNE' | 'LECHE' | 'CABRA_VIVA';
type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';
interface CreateSaleData {
    productType: ProductType;
    customerName: string;
    customerId?: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    paymentMethod: string;
    paymentStatus?: PaymentStatus;
    userId: string;
    goatId?: string;
    notes?: string;
    saleDate?: Date;
}
interface UpdateSaleData {
    productType?: ProductType;
    customerName?: string;
    customerId?: string;
    quantity?: number;
    unit?: string;
    unitPrice?: number;
    totalPrice?: number;
    paymentMethod?: string;
    paymentStatus?: PaymentStatus;
    goatId?: string;
    notes?: string;
    saleDate?: Date;
}
declare class SaleService {
    create(data: CreateSaleData): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        goat: {
            id: string;
            name: string | null;
            customId: string;
            breed: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        unit: string;
        quantity: number;
        userId: string;
        productType: string;
        customerId: string | null;
        customerName: string;
        unitPrice: number;
        totalPrice: number;
        paymentMethod: string;
        paymentStatus: string;
        saleDate: Date;
        goatId: string | null;
    }>;
    getAll(filters?: {
        productType?: string;
        paymentStatus?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
        goat: {
            id: string;
            name: string | null;
            customId: string;
            breed: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        unit: string;
        quantity: number;
        userId: string;
        productType: string;
        customerId: string | null;
        customerName: string;
        unitPrice: number;
        totalPrice: number;
        paymentMethod: string;
        paymentStatus: string;
        saleDate: Date;
        goatId: string | null;
    })[]>;
    getById(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        goat: {
            id: string;
            name: string | null;
            customId: string;
            breed: string;
            weight: number | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        unit: string;
        quantity: number;
        userId: string;
        productType: string;
        customerId: string | null;
        customerName: string;
        unitPrice: number;
        totalPrice: number;
        paymentMethod: string;
        paymentStatus: string;
        saleDate: Date;
        goatId: string | null;
    }>;
    update(id: string, data: UpdateSaleData): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        goat: {
            id: string;
            name: string | null;
            customId: string;
            breed: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        unit: string;
        quantity: number;
        userId: string;
        productType: string;
        customerId: string | null;
        customerName: string;
        unitPrice: number;
        totalPrice: number;
        paymentMethod: string;
        paymentStatus: string;
        saleDate: Date;
        goatId: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        unit: string;
        quantity: number;
        userId: string;
        productType: string;
        customerId: string | null;
        customerName: string;
        unitPrice: number;
        totalPrice: number;
        paymentMethod: string;
        paymentStatus: string;
        saleDate: Date;
        goatId: string | null;
    }>;
    getStats(): Promise<{
        total: number;
        byProductType: {
            productType: string;
            count: number;
            revenue: number;
        }[];
        byPaymentStatus: {
            paymentStatus: string;
            count: number;
        }[];
        totalRevenue: number;
        avgSaleValue: number;
    }>;
}
declare const _default: SaleService;
export default _default;
//# sourceMappingURL=sale.service.d.ts.map