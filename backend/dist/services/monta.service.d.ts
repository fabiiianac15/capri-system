interface CreateMontaDTO {
    hembraId: string;
    machoId: string;
    fechaMonta: Date;
    metodoDeteccion?: string;
    observaciones?: string;
    registradoPor?: string;
}
interface UpdateMontaDTO {
    fechaEstimadaParto?: Date;
    fechaParto?: Date;
    tipoEvento?: 'GESTACION' | 'PARTO_EXITOSO' | 'ABORTO' | 'PARTO_COMPLICADO' | 'SIN_GESTACION';
    totalCrias?: number;
    criasHembra?: number;
    criasMacho?: number;
    detallesCrias?: string;
    observacionesParto?: string;
    complicaciones?: string;
    asistenciaVeterinaria?: boolean;
    inicioProduccionLeche?: boolean;
    produccionPromedio?: number;
}
interface RegistrarPartoDTO {
    montaId: string;
    fechaParto: Date;
    totalCrias: number;
    criasHembra: number;
    criasMacho: number;
    detallesCrias?: Array<{
        sexo: 'MACHO' | 'HEMBRA';
        peso?: number;
        color?: string;
        estado: 'VIVO' | 'MUERTO';
        observaciones?: string;
    }>;
    observacionesParto?: string;
    complicaciones?: string;
    asistenciaVeterinaria?: boolean;
    inicioProduccionLeche?: boolean;
}
declare class MontaService {
    /**
     * Registrar una nueva monta
     */
    create(data: CreateMontaDTO): Promise<{
        hembra: {
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
        macho: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notas: string | null;
        machoCustomId: string;
        machoBreed: string;
        machoName: string | null;
        fechaMonta: Date;
        fechaEstimadaParto: Date;
        fechaParto: Date | null;
        tipoEvento: string;
        numeroParto: number;
        totalCrias: number;
        criasHembra: number;
        criasMacho: number;
        criasMuertas: number;
        detallesCrias: string | null;
        complicaciones: string | null;
        veterinarioAsistio: boolean;
        tratamientosPostParto: string | null;
        inicioProduccionLeche: Date | null;
        produccionPromedio: number | null;
        hembraId: string;
        machoId: string;
    }>;
    /**
     * Obtener todas las montas con filtros
     */
    getAll(filters?: {
        hembraId?: string;
        machoId?: string;
        tipoEvento?: string;
        activo?: boolean;
    }): Promise<({
        hembra: {
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
        macho: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notas: string | null;
        machoCustomId: string;
        machoBreed: string;
        machoName: string | null;
        fechaMonta: Date;
        fechaEstimadaParto: Date;
        fechaParto: Date | null;
        tipoEvento: string;
        numeroParto: number;
        totalCrias: number;
        criasHembra: number;
        criasMacho: number;
        criasMuertas: number;
        detallesCrias: string | null;
        complicaciones: string | null;
        veterinarioAsistio: boolean;
        tratamientosPostParto: string | null;
        inicioProduccionLeche: Date | null;
        produccionPromedio: number | null;
        hembraId: string;
        machoId: string;
    })[]>;
    /**
     * Obtener monta por ID
     */
    getById(id: string): Promise<({
        hembra: {
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
        macho: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notas: string | null;
        machoCustomId: string;
        machoBreed: string;
        machoName: string | null;
        fechaMonta: Date;
        fechaEstimadaParto: Date;
        fechaParto: Date | null;
        tipoEvento: string;
        numeroParto: number;
        totalCrias: number;
        criasHembra: number;
        criasMacho: number;
        criasMuertas: number;
        detallesCrias: string | null;
        complicaciones: string | null;
        veterinarioAsistio: boolean;
        tratamientosPostParto: string | null;
        inicioProduccionLeche: Date | null;
        produccionPromedio: number | null;
        hembraId: string;
        machoId: string;
    }) | null>;
    /**
     * Actualizar monta
     */
    update(id: string, data: UpdateMontaDTO): Promise<{
        hembra: {
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
        macho: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notas: string | null;
        machoCustomId: string;
        machoBreed: string;
        machoName: string | null;
        fechaMonta: Date;
        fechaEstimadaParto: Date;
        fechaParto: Date | null;
        tipoEvento: string;
        numeroParto: number;
        totalCrias: number;
        criasHembra: number;
        criasMacho: number;
        criasMuertas: number;
        detallesCrias: string | null;
        complicaciones: string | null;
        veterinarioAsistio: boolean;
        tratamientosPostParto: string | null;
        inicioProduccionLeche: Date | null;
        produccionPromedio: number | null;
        hembraId: string;
        machoId: string;
    }>;
    /**
     * Registrar parto
     */
    registrarParto(data: RegistrarPartoDTO): Promise<{
        hembra: {
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
        macho: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notas: string | null;
        machoCustomId: string;
        machoBreed: string;
        machoName: string | null;
        fechaMonta: Date;
        fechaEstimadaParto: Date;
        fechaParto: Date | null;
        tipoEvento: string;
        numeroParto: number;
        totalCrias: number;
        criasHembra: number;
        criasMacho: number;
        criasMuertas: number;
        detallesCrias: string | null;
        complicaciones: string | null;
        veterinarioAsistio: boolean;
        tratamientosPostParto: string | null;
        inicioProduccionLeche: Date | null;
        produccionPromedio: number | null;
        hembraId: string;
        machoId: string;
    }>;
    /**
     * Registrar aborto
     */
    registrarAborto(montaId: string, data: {
        fechaAborto: Date;
        motivo?: string;
        observaciones?: string;
    }): Promise<{
        hembra: {
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
        macho: {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notas: string | null;
        machoCustomId: string;
        machoBreed: string;
        machoName: string | null;
        fechaMonta: Date;
        fechaEstimadaParto: Date;
        fechaParto: Date | null;
        tipoEvento: string;
        numeroParto: number;
        totalCrias: number;
        criasHembra: number;
        criasMacho: number;
        criasMuertas: number;
        detallesCrias: string | null;
        complicaciones: string | null;
        veterinarioAsistio: boolean;
        tratamientosPostParto: string | null;
        inicioProduccionLeche: Date | null;
        produccionPromedio: number | null;
        hembraId: string;
        machoId: string;
    }>;
    /**
     * Obtener gestaciones activas
     */
    getGestacionesActivas(): Promise<any[]>;
    /**
     * Obtener próximos partos (próximos 30 días)
     */
    getProximosPartos(dias?: number): Promise<any[]>;
    /**
     * Historial reproductivo de una hembra
     */
    getHistorialHembra(hembraId: string): Promise<{
        montas: ({
            macho: {
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
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notas: string | null;
            machoCustomId: string;
            machoBreed: string;
            machoName: string | null;
            fechaMonta: Date;
            fechaEstimadaParto: Date;
            fechaParto: Date | null;
            tipoEvento: string;
            numeroParto: number;
            totalCrias: number;
            criasHembra: number;
            criasMacho: number;
            criasMuertas: number;
            detallesCrias: string | null;
            complicaciones: string | null;
            veterinarioAsistio: boolean;
            tratamientosPostParto: string | null;
            inicioProduccionLeche: Date | null;
            produccionPromedio: number | null;
            hembraId: string;
            machoId: string;
        })[];
        estadisticas: {
            totalMontas: number;
            totalPartos: number;
            totalCrias: number;
            totalHembras: number;
            totalMachos: number;
            abortos: number;
            tasaExito: string | number;
            promedioXParto: string | number;
        };
    }>;
    /**
     * Historial reproductivo de un macho
     */
    getHistorialMacho(machoId: string): Promise<{
        montas: ({
            hembra: {
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
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notas: string | null;
            machoCustomId: string;
            machoBreed: string;
            machoName: string | null;
            fechaMonta: Date;
            fechaEstimadaParto: Date;
            fechaParto: Date | null;
            tipoEvento: string;
            numeroParto: number;
            totalCrias: number;
            criasHembra: number;
            criasMacho: number;
            criasMuertas: number;
            detallesCrias: string | null;
            complicaciones: string | null;
            veterinarioAsistio: boolean;
            tratamientosPostParto: string | null;
            inicioProduccionLeche: Date | null;
            produccionPromedio: number | null;
            hembraId: string;
            machoId: string;
        })[];
        estadisticas: {
            totalMontas: number;
            totalPartos: number;
            totalCrias: number;
            totalHembras: number;
            totalMachos: number;
            tasaExito: string | number;
        };
    }>;
    /**
     * Estadísticas generales de reproducción
     */
    getEstadisticas(filters?: {
        startDate?: string;
        endDate?: string;
    }): Promise<{
        totalMontas: number;
        gestacionesActivas: number;
        totalPartos: number;
        abortos: number;
        totalCrias: number;
        criasHembra: number;
        criasMacho: number;
        tasaExito: string | number;
        promedioXParto: string | number;
        topMachos: {
            macho: {
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
            totalMontas: any;
            partosExitosos: any;
            totalCrias: any;
            tasaExito: string | number;
        }[];
    }>;
    /**
     * Eliminar monta
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
declare const _default: MontaService;
export default _default;
//# sourceMappingURL=monta.service.d.ts.map