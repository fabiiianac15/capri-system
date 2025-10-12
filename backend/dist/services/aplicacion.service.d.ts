export interface CreateAplicacionDTO {
    goatId: string;
    medicamentoId: string;
    fechaAplicacion?: string;
    dosis: string;
    viaAdministrada: string;
    veterinario?: string;
    aplicadoPor?: string;
    motivo: string;
    diagnostico?: string;
    proximaDosis?: string;
    frecuencia?: string;
    observaciones?: string;
    reaccionAdversa?: string;
    efectividad?: string;
}
export interface UpdateAplicacionDTO extends Partial<CreateAplicacionDTO> {
}
declare class AplicacionMedicamentoService {
    create(data: CreateAplicacionDTO): Promise<{
        goat: {
            name: string | null;
            customId: string;
            breed: string;
        };
        medicamento: {
            nombre: string;
            tipo: string;
            unidadMedida: string;
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
    }>;
    createBulk(goatIds: string[], aplicacionData: Omit<CreateAplicacionDTO, 'goatId'>): Promise<({
        goat: {
            name: string | null;
            customId: string;
            breed: string;
        };
        medicamento: {
            nombre: string;
            tipo: string;
            unidadMedida: string;
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
    })[]>;
    getAll(filters?: {
        goatId?: string;
        medicamentoId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<({
        goat: {
            name: string | null;
            customId: string;
            breed: string;
            category: string;
        };
        medicamento: {
            nombre: string;
            tipo: string;
            dosis: string;
            unidadMedida: string;
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
    })[]>;
    getById(id: string): Promise<({
        goat: {
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
        };
        medicamento: {
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
    }) | null>;
    update(id: string, data: UpdateAplicacionDTO): Promise<{
        goat: {
            name: string | null;
            customId: string;
        };
        medicamento: {
            nombre: string;
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
    }>;
    delete(id: string): Promise<{
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
    }>;
    getHistorialMedico(goatId: string): Promise<({
        medicamento: {
            nombre: string;
            tipo: string;
            dosis: string;
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
    })[]>;
    getProximasDosis(dias?: number): Promise<({
        goat: {
            name: string | null;
            customId: string;
            breed: string;
        };
        medicamento: {
            nombre: string;
            tipo: string;
            dosis: string;
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
    })[]>;
    getEstadisticas(filters?: {
        startDate?: string;
        endDate?: string;
    }): Promise<{
        totalAplicaciones: number;
        porTipo: Record<string, number>;
        topMedicamentos: {
            nombre: string;
            cantidad: number;
        }[];
        reaccionesAdversas: number;
    }>;
}
declare const _default: AplicacionMedicamentoService;
export default _default;
//# sourceMappingURL=aplicacion.service.d.ts.map