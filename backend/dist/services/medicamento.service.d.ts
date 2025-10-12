export interface CreateMedicamentoDTO {
    nombre: string;
    tipo: string;
    descripcion?: string;
    dosis: string;
    viaAdministracion: string;
    fabricante?: string;
    lote?: string;
    fechaVencimiento?: string;
    stockActual: number;
    stockMinimo: number;
    unidadMedida: string;
    precioUnitario?: number;
    ubicacionAlmacen?: string;
    condicionesAlmacenamiento?: string;
    notas?: string;
}
export interface UpdateMedicamentoDTO extends Partial<CreateMedicamentoDTO> {
    activo?: boolean;
}
export interface AlertaMedicamento {
    tipo: 'VENCIMIENTO' | 'STOCK_BAJO' | 'STOCK_CRITICO';
    medicamento: any;
    mensaje: string;
    prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
}
declare class MedicamentoService {
    create(data: CreateMedicamentoDTO): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        tipo: string;
        descripcion: string | null;
        dosis: string;
        viaAdministracion: string;
        fabricante: string | null;
        lote: string | null;
        fechaVencimiento: Date | null;
        stockActual: number;
        stockMinimo: number;
        unidadMedida: string;
        precioUnitario: number | null;
        ubicacionAlmacen: string | null;
        condicionesAlmacenamiento: string | null;
        notas: string | null;
        activo: boolean;
    }>;
    getAll(filters?: {
        tipo?: string;
        activo?: boolean;
    }): Promise<({
        aplicaciones: ({
            goat: {
                name: string | null;
                customId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            goatId: string;
            dosis: string;
            fechaAplicacion: Date;
            medicamentoId: string;
            viaAdministrada: string;
            veterinario: string | null;
            aplicadoPor: string | null;
            motivo: string;
            diagnostico: string | null;
            proximaDosis: Date | null;
            frecuencia: string | null;
            observaciones: string | null;
            reaccionAdversa: string | null;
            efectividad: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        tipo: string;
        descripcion: string | null;
        dosis: string;
        viaAdministracion: string;
        fabricante: string | null;
        lote: string | null;
        fechaVencimiento: Date | null;
        stockActual: number;
        stockMinimo: number;
        unidadMedida: string;
        precioUnitario: number | null;
        ubicacionAlmacen: string | null;
        condicionesAlmacenamiento: string | null;
        notas: string | null;
        activo: boolean;
    })[]>;
    getById(id: string): Promise<({
        aplicaciones: ({
            goat: {
                name: string | null;
                customId: string;
                breed: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            goatId: string;
            dosis: string;
            fechaAplicacion: Date;
            medicamentoId: string;
            viaAdministrada: string;
            veterinario: string | null;
            aplicadoPor: string | null;
            motivo: string;
            diagnostico: string | null;
            proximaDosis: Date | null;
            frecuencia: string | null;
            observaciones: string | null;
            reaccionAdversa: string | null;
            efectividad: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        tipo: string;
        descripcion: string | null;
        dosis: string;
        viaAdministracion: string;
        fabricante: string | null;
        lote: string | null;
        fechaVencimiento: Date | null;
        stockActual: number;
        stockMinimo: number;
        unidadMedida: string;
        precioUnitario: number | null;
        ubicacionAlmacen: string | null;
        condicionesAlmacenamiento: string | null;
        notas: string | null;
        activo: boolean;
    }) | null>;
    update(id: string, data: UpdateMedicamentoDTO): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        tipo: string;
        descripcion: string | null;
        dosis: string;
        viaAdministracion: string;
        fabricante: string | null;
        lote: string | null;
        fechaVencimiento: Date | null;
        stockActual: number;
        stockMinimo: number;
        unidadMedida: string;
        precioUnitario: number | null;
        ubicacionAlmacen: string | null;
        condicionesAlmacenamiento: string | null;
        notas: string | null;
        activo: boolean;
    }>;
    updateStock(id: string, cantidad: number, operacion: 'INCREMENTAR' | 'DECREMENTAR'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        tipo: string;
        descripcion: string | null;
        dosis: string;
        viaAdministracion: string;
        fabricante: string | null;
        lote: string | null;
        fechaVencimiento: Date | null;
        stockActual: number;
        stockMinimo: number;
        unidadMedida: string;
        precioUnitario: number | null;
        ubicacionAlmacen: string | null;
        condicionesAlmacenamiento: string | null;
        notas: string | null;
        activo: boolean;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        tipo: string;
        descripcion: string | null;
        dosis: string;
        viaAdministracion: string;
        fabricante: string | null;
        lote: string | null;
        fechaVencimiento: Date | null;
        stockActual: number;
        stockMinimo: number;
        unidadMedida: string;
        precioUnitario: number | null;
        ubicacionAlmacen: string | null;
        condicionesAlmacenamiento: string | null;
        notas: string | null;
        activo: boolean;
    }>;
    hardDelete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        tipo: string;
        descripcion: string | null;
        dosis: string;
        viaAdministracion: string;
        fabricante: string | null;
        lote: string | null;
        fechaVencimiento: Date | null;
        stockActual: number;
        stockMinimo: number;
        unidadMedida: string;
        precioUnitario: number | null;
        ubicacionAlmacen: string | null;
        condicionesAlmacenamiento: string | null;
        notas: string | null;
        activo: boolean;
    }>;
    getAlertas(): Promise<AlertaMedicamento[]>;
    getEstadisticas(): Promise<{
        totalMedicamentos: number;
        totalAplicaciones: number;
        porTipo: Record<string, number>;
        stockBajo: number;
        porVencer: number;
        valorInventario: number;
    }>;
}
declare const _default: MedicamentoService;
export default _default;
//# sourceMappingURL=medicamento.service.d.ts.map