// ========================================
// TIPOS DE USUARIO
// ========================================
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER' | 'VIEWER';
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

// ========================================
// TIPOS DE CABRAS
// ========================================
export type GoatSex = 'MALE' | 'FEMALE';
export type GoatCategory = 'CRIA' | 'LEVANTE_1' | 'LEVANTE_2' | 'REPRODUCTOR' | 'LECHERA';
export type GoatStatus = 'ACTIVE' | 'SOLD' | 'DECEASED';

export interface Goat {
  id: string;
  customId: string;
  name?: string;
  breed: string;
  sex: GoatSex;
  birthDate: string;
  weight?: number;
  category: GoatCategory;
  milkProduction: number;
  feedConsumption: number;
  birthCount: number;
  status: GoatStatus;
  notes?: string;
  motherId?: string;
  fatherId?: string;
  createdAt: string;
  updatedAt: string;
  mother?: {
    id: string;
    customId: string;
    name?: string;
  };
  offspring?: Goat[];
  vaccines?: Vaccine[];
  reproductiveData?: ReproductiveRecord[];
}

export interface CreateGoatData {
  customId: string;
  name?: string;
  breed: string;
  sex: GoatSex;
  birthDate: string;
  weight?: number;
  category?: GoatCategory;
  motherId?: string;
  fatherId?: string;
  notes?: string;
}

export interface UpdateGoatData {
  name?: string;
  breed?: string;
  weight?: number;
  category?: GoatCategory;
  status?: GoatStatus;
  milkProduction?: number;
  feedConsumption?: number;
  notes?: string;
}

// ========================================
// TIPOS DE VACUNAS
// ========================================
export interface Vaccine {
  id: string;
  goatId: string;
  name: string;
  dose: number;
  unit: string;
  applicationDate: string;
  notes?: string;
  createdAt: string;
}

// ========================================
// TIPOS DE DATOS REPRODUCTIVOS
// ========================================
export interface ReproductiveRecord {
  id: string;
  goatId: string;
  maleId: string;
  maleCustomId: string;
  maleBreed: string;
  mountingDate: string;
  expectedBirth: string;
  actualBirthDate?: string;
  wasAbortion: boolean;
  birthNumber: number;
  femaleOffspring: number;
  maleOffspring: number;
  totalOffspring: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// TIPOS DE ESTADÍSTICAS
// ========================================
export interface GoatStats {
  total: number;
  byCategory: Array<{
    category: GoatCategory;
    _count: number;
  }>;
  byBreed: Array<{
    breed: string;
    _count: number;
  }>;
  bySex: Array<{
    sex: GoatSex;
    _count: number;
  }>;
  totalMilkProduction: number;
}

// ========================================
// TIPOS DE MEDICAMENTOS
// ========================================
export type TipoMedicamento = 
  | 'VACUNA' 
  | 'ANTIBIOTICO' 
  | 'ANTIPARASITARIO' 
  | 'VITAMINA' 
  | 'SUPLEMENTO' 
  | 'OTRO';

export interface Medicamento {
  id: string;
  nombre: string;
  tipo: TipoMedicamento;
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
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicamentoData {
  nombre: string;
  tipo: TipoMedicamento;
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

export interface UpdateMedicamentoData {
  nombre?: string;
  tipo?: TipoMedicamento;
  descripcion?: string;
  dosis?: string;
  viaAdministracion?: string;
  stockMinimo?: number;
  precioUnitario?: number;
  ubicacionAlmacen?: string;
  notas?: string;
}

export type TipoAlerta = 'VENCIMIENTO' | 'STOCK_BAJO' | 'STOCK_CRITICO';
export type PrioridadAlerta = 'ALTA' | 'MEDIA' | 'BAJA';

export interface AlertaMedicamento {
  tipo: TipoAlerta;
  medicamento: Medicamento;
  mensaje: string;
  prioridad: PrioridadAlerta;
}

export interface EstadisticasMedicamentos {
  totalMedicamentos: number;
  totalAplicaciones: number;
  porTipo: Array<{ tipo: string; count: number }>;
  stockBajo: number;
  porVencer: number;
  valorInventario: number;
}

// ========================================
// TIPOS DE APLICACIONES DE MEDICAMENTOS
// ========================================
export interface AplicacionMedicamento {
  id: string;
  goatId: string;
  medicamentoId: string;
  fechaAplicacion: string;
  dosis: string;
  viaAdministrada: string;
  veterinario?: string;
  aplicadoPor?: string;
  motivo?: string;
  proximaDosis?: string;
  frecuencia?: string;
  reaccionAdversa?: string;
  efectividad?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
  goat?: Goat;
  medicamento?: Medicamento;
}

export interface CreateAplicacionData {
  goatId: string;
  medicamentoId: string;
  fechaAplicacion?: string;
  dosis: string;
  viaAdministrada: string;
  veterinario?: string;
  aplicadoPor?: string;
  motivo?: string;
  proximaDosis?: string;
  frecuencia?: string;
  observaciones?: string;
}

export interface ProximaDosis {
  aplicacion: AplicacionMedicamento;
  diasRestantes: number;
}

// ========================================
// TIPOS DE REPRODUCCIÓN (MONTAS)
// ========================================
export type TipoEventoMonta = 
  | 'GESTACION' 
  | 'PARTO_EXITOSO' 
  | 'ABORTO' 
  | 'PARTO_COMPLICADO' 
  | 'SIN_GESTACION';

export interface Monta {
  id: string;
  hembraId: string;
  machoId: string;
  machoCustomId: string;
  machoBreed: string;
  machoName?: string;
  fechaMonta: string;
  fechaEstimadaParto: string;
  fechaParto?: string;
  tipoEvento: TipoEventoMonta;
  numeroParto: number;
  totalCrias: number;
  criasHembra: number;
  criasMacho: number;
  criasMuertas: number;
  detallesCrias?: string;
  complicaciones?: string;
  veterinarioAsistio: boolean;
  tratamientosPostParto?: string;
  inicioProduccionLeche?: string;
  produccionPromedio?: number;
  notas?: string;
  createdAt: string;
  updatedAt: string;
  hembra?: Goat;
  macho?: Goat;
}

export interface CreateMontaData {
  hembraId: string;
  machoId: string;
  fechaMonta: string;
  observaciones?: string;
}

export interface RegistrarPartoData {
  fechaParto: string;
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

export interface GestacionActiva extends Monta {
  diasRestantes: number;
  diasGestacion: number;
}

export interface EstadisticasReproduccion {
  totalMontas: number;
  gestacionesActivas: number;
  totalPartos: number;
  abortos: number;
  totalCrias: number;
  criasHembra: number;
  criasMacho: number;
  tasaExito: string;
  promedioXParto: string;
  topMachos: Array<{
    macho: Goat;
    totalMontas: number;
    partosExitosos: number;
    totalCrias: number;
    tasaExito: string;
  }>;
}

