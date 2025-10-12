# 📋 PLAN COMPLETO - SISTEMA DE GESTIÓN CAPRINO GRANME

## 🎯 CONTEXTO DEL PROYECTO

### Cliente Final
- **Usuario**: Granjero sin conocimientos técnicos
- **Necesidad**: Sistema OFFLINE, fácil de usar, con reportes y gráficas en tiempo real
- **Ubicación**: Granja dentro de la Universidad

### Requisitos Técnicos para Aprobación Universitaria
- **Frontend**: React ✅ (ya lo tienes)
- **Backend**: Symphony (actualmente tienes Express/Node.js)
- **Base de datos**: Oracle (actualmente tienes SQLite/Prisma)

### Estado Actual del Proyecto
- ✅ Frontend React + TypeScript + Tailwind
- ✅ Backend Node.js + Express + Prisma
- ✅ Base de datos SQLite (archivo local)
- ✅ Sistema de autenticación
- ✅ UI modernizada (completada hoy)
- ⚠️ Necesita migración futura a Symphony + Oracle

---

## 🚀 ESTRATEGIA DE DESARROLLO (3 FASES)

### **FASE 1: SISTEMA FUNCIONAL PARA EL GRANJERO** (Actual - Prioridad MÁXIMA)
**Objetivo**: Sistema 100% funcional, offline, fácil de usar para el cliente final

**Stack Tecnológico Actual (Óptimo para cliente):**
- ✅ Frontend: React + TypeScript + Vite
- ✅ Backend: Node.js + Express
- ✅ Base de datos: SQLite (archivo local .db)
- ✅ ORM: Prisma (facilita migración futura)
- ✅ Empaquetado: Electron (para app de escritorio offline)

**Ventajas para el granjero:**
- ✅ No necesita internet
- ✅ Instalación simple (doble clic)
- ✅ Datos guardados localmente
- ✅ Rápido y ligero
- ✅ Backups automáticos

### **FASE 2: APROBACIÓN DEL CLIENTE** (Testing)
**Objetivo**: Validar que el sistema cumpla todas las necesidades

**Actividades:**
1. Capacitación al granjero
2. Testing en campo real
3. Ajustes según feedback
4. Documentación de usuario

### **FASE 3: MIGRACIÓN UNIVERSITARIA** (Después de aprobación)
**Objetivo**: Adaptar a Symphony + Oracle manteniendo la funcionalidad

**Stack Final para Universidad:**
- ✅ Frontend: React (mismo código, sin cambios)
- 🔄 Backend: Migrar de Express → Symphony
- 🔄 Base de datos: Migrar de SQLite → Oracle
- 🔄 ORM: Migrar de Prisma → Doctrine (Symphony ORM)

**Ventajas de esta estrategia:**
- ✅ Frontend NO necesita cambios (React es React)
- ✅ Prisma facilita migración de esquemas
- ✅ Lógica de negocio se puede portar
- ✅ APIs REST compatibles

---

## 📊 NUEVOS REQUISITOS DEL GRANJERO

### 1. **Gestión de Categorías de Cabras (Actualizado)**

#### Categorías por Edad y Peso:
```
🐐 CRÍA (2-3 meses)
   └─> Peso: < 18kg
   └─> Próxima etapa: LEVANTE_1

🐐 LEVANTE_1 (Desarrollo)
   └─> Peso: 18kg - 25kg
   └─> Próxima etapa: LEVANTE_2

🐐 LEVANTE_2 (Pre-reproductiva)
   └─> Peso: 25kg - 35kg
   └─> Próxima etapa: REPRODUCTORA (hembras) o REPRODUCTOR (machos)

🐐 REPRODUCTORA (Hembra adulta)
   └─> Peso: > 35kg
   └─> Estado: Puede ser preñada
   └─> Función: Producción de crías

🐐 REPRODUCTOR (Macho adulto)
   └─> Peso: > 35kg
   └─> Función: Monta/Reproducción

🐐 LECHERA (Hembra en producción)
   └─> Estado: Después del parto
   └─> Función: Producción de leche
```

#### Transiciones Automáticas:
- Sistema debe alertar cuando una cabra alcanza el peso para cambiar de categoría
- Historial de cambios de categoría
- Gráficas de crecimiento individual

---

### 2. **NUEVO: Módulo de Medicamentos** 🏥

#### Estructura necesaria:
```typescript
interface Medicamento {
  id: string;
  nombre: string;
  tipo: 'VACUNA' | 'ANTIBIOTICO' | 'ANTIPARASITARIO' | 'VITAMINA' | 'OTRO';
  dosis: string; // "5ml", "2 comprimidos"
  viaAdministracion: 'ORAL' | 'INYECTABLE' | 'TOPICA';
  fabricante: string;
  lote: string;
  fechaVencimiento: Date;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: string; // "ml", "tabletas", "frascos"
  precioUnitario: number;
  ubicacionAlmacen: string;
  notas: string;
}

interface AplicacionMedicamento {
  id: string;
  goatId: string; // Cabra tratada
  medicamentoId: string;
  fecha: Date;
  dosis: string;
  veterinarioResponsable: string;
  motivo: string; // "Vacunación anual", "Tratamiento parásitos"
  proximaDosis?: Date; // Para tratamientos recurrentes
  observaciones: string;
  reaccionAdversa?: string;
}
```

#### Funcionalidades del Módulo:
1. **Inventario de Medicamentos**
   - Lista completa con stock
   - Alertas de stock bajo
   - Alertas de vencimiento (30 días antes)
   - Historial de compras

2. **Registro de Aplicaciones**
   - Por cabra individual
   - Por lote/grupo
   - Calendario de próximas dosis
   - Historial médico por animal

3. **Reportes**
   - Medicamentos más usados
   - Costos por tratamiento
   - Calendario de vacunaciones
   - Animales por tratar

4. **Alertas**
   - Vacunas próximas a vencer
   - Animales que necesitan tratamiento
   - Stock bajo de medicamentos críticos

---

### 3. **NUEVO: Datos Reproductivos Completos** 🐑

#### Estructura ampliada:
```typescript
interface DatosReproductivos {
  id: string;
  goatId: string; // Hembra (madre)
  
  // Datos de Monta
  fechaMonta: Date;
  machoId: string; // ID del macho que la montó
  razaMacho: string; // Raza del macho
  nombreMacho?: string;
  
  // Predicciones
  fechaEstimadaParto: Date; // Monta + 150 días (gestación cabra)
  
  // Resultado del Parto
  fechaParto?: Date;
  tipoEvento: 'PARTO_EXITOSO' | 'ABORTO' | 'PARTO_ASISTIDO' | 'GESTACION';
  numeroParto: number; // 1er parto, 2do parto, etc.
  
  // Crías
  totalCrias: number;
  criasHembra: number;
  criasMacho: number;
  criasMuertas?: number;
  
  // Detalles de Crías (array)
  crias: {
    customId: string; // Ej: "218-344" (mamá-cría)
    sexo: 'MALE' | 'FEMALE';
    peso: number;
    estado: 'VIVA' | 'MUERTA' | 'VENDIDA';
    observaciones?: string;
  }[];
  
  // Datos Veterinarios
  complicaciones?: string;
  veterinarioAsistio: boolean;
  tratamientosPostParto?: string;
  
  // Producción Láctea Post-Parto
  inicioProduccionLeche?: Date;
  produccionPromedioDiaria?: number;
  
  // Observaciones
  notas?: string;
}

interface HistorialReproductivo {
  goatId: string;
  totalPartos: number;
  totalCrias: number;
  totalHembras: number;
  totalMachos: number;
  totalAbortos: number;
  tasaExito: number; // % de partos exitosos
  intervaloParto: number; // Días promedio entre partos
  ultimoParto?: Date;
  proximaMontaEstimada?: Date;
}
```

#### Sistema de Numeración:
```
Formato: [ID_MADRE]-[ID_CRIA]
Ejemplo: 218-344

218 = Identificador de la madre
344 = Identificador único asignado a la cría
```

**Lógica de generación:**
```typescript
function generarCustomId(madreId: string, siguienteNumero: number): string {
  return `${madreId}-${siguienteNumero}`;
}

// Ejemplo:
// Madre: "218"
// Última cría registrada en el sistema: 343
// Nueva cría: "218-344"
```

---

### 4. **NUEVO: Listado y Análisis por Razas** 📊

#### Dashboard de Razas:
```typescript
interface EstadisticasPorRaza {
  raza: string;
  total: number;
  hembras: number;
  machos: number;
  crias: number;
  levantes: number;
  reproductoras: number;
  reproductores: number;
  lecheras: number;
  pesoPromedio: number;
  produccionLechePromedio: number;
  porcentajeDelTotal: number;
}
```

#### Funcionalidades:
1. **Vista de Tarjetas por Raza**
   - Card individual por cada raza
   - Gráfica de distribución
   - Estadísticas clave

2. **Comparativas**
   - Tabla comparativa de todas las razas
   - Gráfica de barras: cantidad por raza
   - Pie chart: distribución porcentual

3. **Reportes Descargables**
   - PDF con todas las razas
   - Gráficas incluidas
   - Tabla resumen
   - Detalles por categoría

4. **Filtros Avanzados**
   - Por raza específica
   - Por categoría (cría, levante, etc.)
   - Por estado reproductivo
   - Por rango de peso

---

## 🗂️ ESTRUCTURA DE BASE DE DATOS ACTUALIZADA

### Esquema Prisma Completo:

```prisma
// schema.prisma

model Goat {
  id                String   @id @default(uuid())
  customId          String   @unique // "218" o "218-344"
  name              String?
  breed             String
  birthDate         DateTime
  sex               String   // MALE, FEMALE
  category          String   // CRIA, LEVANTE_1, LEVANTE_2, REPRODUCTOR, REPRODUCTORA, LECHERA
  weight            Float?
  milkProduction    Float    @default(0)
  status            String   @default("ACTIVE") // ACTIVE, SOLD, DECEASED
  location          String?
  notes             String?
  
  // Datos reproductivos (si es hembra)
  madreId           String?  // Para crías: ID de la madre
  madre             Goat?    @relation("CriasDeHembra", fields: [madreId], references: [id])
  crias             Goat[]   @relation("CriasDeHembra")
  
  // Relaciones
  montasComoHembra     Monta[]              @relation("HembraMontada")
  montasComoMacho      Monta[]              @relation("MachoReproductor")
  aplicacionesMed      AplicacionMedicamento[]
  historialCategorias  CambioCategoria[]
  pesoHistorial        RegistroPeso[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Monta {
  id                    String   @id @default(uuid())
  
  // Hembra (madre)
  hembraId              String
  hembra                Goat     @relation("HembraMontada", fields: [hembraId], references: [id])
  
  // Macho (padre)
  machoId               String
  macho                 Goat     @relation("MachoReproductor", fields: [machoId], references: [id])
  razaMacho             String
  nombreMacho           String?
  
  // Fechas
  fechaMonta            DateTime
  fechaEstimadaParto    DateTime
  fechaParto            DateTime?
  
  // Resultado
  tipoEvento            String   // PARTO_EXITOSO, ABORTO, PARTO_ASISTIDO, GESTACION
  numeroParto           Int
  
  // Crías
  totalCrias            Int      @default(0)
  criasHembra           Int      @default(0)
  criasMacho            Int      @default(0)
  criasMuertas          Int      @default(0)
  
  // Detalles médicos
  complicaciones        String?
  veterinarioAsistio    Boolean  @default(false)
  tratamientosPostParto String?
  
  // Producción láctea
  inicioProduccionLeche DateTime?
  produccionPromedio    Float?
  
  notas                 String?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model Medicamento {
  id                  String   @id @default(uuid())
  nombre              String
  tipo                String   // VACUNA, ANTIBIOTICO, ANTIPARASITARIO, VITAMINA, OTRO
  dosis               String
  viaAdministracion   String   // ORAL, INYECTABLE, TOPICA
  fabricante          String?
  lote                String?
  fechaVencimiento    DateTime?
  stockActual         Float
  stockMinimo         Float
  unidadMedida        String   // ml, tabletas, frascos
  precioUnitario      Float?
  ubicacionAlmacen    String?
  notas               String?
  
  aplicaciones        AplicacionMedicamento[]
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model AplicacionMedicamento {
  id                    String   @id @default(uuid())
  
  goatId                String
  goat                  Goat     @relation(fields: [goatId], references: [id])
  
  medicamentoId         String
  medicamento           Medicamento @relation(fields: [medicamentoId], references: [id])
  
  fechaAplicacion       DateTime
  dosis                 String
  veterinario           String?
  motivo                String
  proximaDosis          DateTime?
  observaciones         String?
  reaccionAdversa       String?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model CambioCategoria {
  id          String   @id @default(uuid())
  goatId      String
  goat        Goat     @relation(fields: [goatId], references: [id])
  
  categoriaAnterior String
  categoriaNueva    String
  peso              Float
  motivo            String?
  fecha             DateTime @default(now())
}

model RegistroPeso {
  id          String   @id @default(uuid())
  goatId      String
  goat        Goat     @relation(fields: [goatId], references: [id])
  
  peso        Float
  fecha       DateTime @default(now())
  notas       String?
}

// ... (mantener User, Sale, Product, Supplier, Staff)
```

---

## 📱 NUEVAS PÁGINAS Y FUNCIONALIDADES

### 1. **Página: Reproducción** 🐑
**Ruta**: `/reproduccion`

**Secciones:**
- **Calendario de Montas**: Vista mensual con fechas
- **Gestación Activa**: Hembras preñadas con countdown
- **Próximos Partos**: Alertas 15 días antes
- **Historial de Partos**: Tabla completa
- **Estadísticas**: Tasa de éxito, crías por parto, etc.

**Formularios:**
- Registrar Monta
- Registrar Parto
- Registrar Aborto
- Ver Historial Reproductivo

---

### 2. **Página: Medicamentos** 💊
**Ruta**: `/medicamentos`

**Secciones:**
- **Inventario**: Cards con stock y estado
- **Alertas**: Vencimientos y stock bajo
- **Aplicaciones Recientes**: Últimos 30 días
- **Calendario**: Próximas vacunaciones
- **Reportes**: Costos y estadísticas

**Formularios:**
- Agregar Medicamento
- Registrar Aplicación
- Aplicación Masiva (grupo)
- Actualizar Stock

---

### 3. **Página: Análisis por Razas** 📊
**Ruta**: `/razas`

**Secciones:**
- **Vista de Cards**: Una por raza
- **Gráficas Comparativas**: Barras y pie charts
- **Tabla Detallada**: Todas las razas
- **Filtros Avanzados**: Por categoría y estado

**Acciones:**
- Exportar PDF por raza
- Exportar PDF comparativo
- Ver detalles de cada raza
- Filtrar animales por raza

---

### 4. **Mejoras en Página: Goats** 🐐

**Agregar:**
- **Tab "Historial Reproductivo"**: Para hembras
- **Tab "Historial Médico"**: Todas las aplicaciones
- **Tab "Crecimiento"**: Gráfica de peso en el tiempo
- **Badge de Categoría**: Color según categoría
- **Alerta de Transición**: "Lista para LEVANTE_2"

---

## 🎨 DISEÑO DE NUEVOS MÓDULOS

### Página Reproducción - Wireframe:

```
┌─────────────────────────────────────────────────────────┐
│ 🐑 Gestión Reproductiva                       [+ Monta] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│ │ TOTAL   │ │ ACTIVAS │ │PRÓXIMOS │ │ TASA    │       │
│ │ MONTAS  │ │ GESTAC. │ │ PARTOS  │ │ ÉXITO   │       │
│ │  145    │ │   12    │ │    3    │ │  94%    │       │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 📅 Próximos Partos (15 días)                      │  │
│ ├────────────────────────────────────────────────────┤  │
│ │ 218 - Toggenburg - 3 días - Macho: 145           │  │
│ │ 234 - Saanen - 7 días - Macho: 167               │  │
│ │ 189 - Alpina - 12 días - Macho: 145              │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 📊 Historial de Montas                  [Filtros] │  │
│ ├────────────────────────────────────────────────────┤  │
│ │ ID │ Hembra │ Macho │ Monta │ Parto Est. │ Estado│  │
│ │────┼────────┼───────┼───────┼────────────┼───────│  │
│ │ 218│ 218    │ 145   │ 1/Ago │ 28/Dic     │ 🤰    │  │
│ └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Página Medicamentos - Wireframe:

```
┌─────────────────────────────────────────────────────────┐
│ 💊 Gestión de Medicamentos         [+ Medicamento]      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ⚠️ ALERTAS                                               │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 🔴 Ivermectina - Stock bajo (5 unidades)          │  │
│ │ 🟡 Vitamina B12 - Vence en 15 días                │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ TOTAL    │ │ STOCK    │ │ APLICA   │ │ PRÓXIMAS │   │
│ │ MEDICAM. │ │ BAJO     │ │ MES      │ │ DOSIS    │   │
│ │   24     │ │    3     │ │   156    │ │    8     │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 📦 Inventario de Medicamentos          [Buscar 🔍]│  │
│ ├────────────────────────────────────────────────────┤  │
│ │ Ivermectina 1%                         Stock: 5   │  │
│ │ ANTIPARASITARIO • Vence: 20/Mar/2026   [Aplicar] │  │
│ │                                                    │  │
│ │ Vitamina B12                          Stock: 45   │  │
│ │ VITAMINA • Vence: 30/Oct/2025         [Aplicar]  │  │
│ └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 PLAN DE IMPLEMENTACIÓN PASO A PASO

### **PASO 1: Actualizar Base de Datos** ⏱️ 2-3 horas

1. **Actualizar schema.prisma** con nuevos modelos
2. **Crear migración**:
   ```bash
   npx prisma migrate dev --name add-reproduction-and-medicines
   ```
3. **Verificar base de datos**
4. **Generar Prisma Client**

---

### **PASO 2: Backend - Nuevos Endpoints** ⏱️ 4-5 horas

#### APIs de Reproducción:
```typescript
POST   /api/montas              - Registrar monta
GET    /api/montas              - Listar todas
GET    /api/montas/:id          - Ver detalles
PUT    /api/montas/:id          - Actualizar (registrar parto)
DELETE /api/montas/:id          - Eliminar
GET    /api/montas/proximos-partos - Partos próximos 15 días
GET    /api/montas/estadisticas    - Stats reproductivas
GET    /api/goats/:id/historial-reproductivo - Historial hembra
```

#### APIs de Medicamentos:
```typescript
POST   /api/medicamentos        - Crear medicamento
GET    /api/medicamentos        - Listar con stock
PUT    /api/medicamentos/:id    - Actualizar
DELETE /api/medicamentos/:id    - Eliminar
GET    /api/medicamentos/alertas - Vencimientos y stock bajo

POST   /api/aplicaciones        - Registrar aplicación
GET    /api/aplicaciones        - Historial
GET    /api/aplicaciones/proximas - Próximas dosis
GET    /api/goats/:id/historial-medico - Historial médico
```

#### APIs de Análisis por Razas:
```typescript
GET    /api/razas/estadisticas  - Stats por raza
GET    /api/razas/:raza/detalles - Detalles de una raza
GET    /api/razas/comparativa    - Tabla comparativa
```

---

### **PASO 3: Frontend - Nuevas Páginas** ⏱️ 6-8 horas

1. **ReproductionPage.tsx**
   - Vista principal
   - Cards de estadísticas
   - Lista de próximos partos
   - Tabla de montas
   - Formularios (modales)

2. **MedicinesPage.tsx**
   - Inventario con cards
   - Alertas destacadas
   - Formulario de aplicación
   - Calendario de dosis

3. **BreedAnalysisPage.tsx**
   - Cards por raza
   - Gráficas (Chart.js)
   - Tabla comparativa
   - Exportación PDF

4. **Actualizar GoatsPage.tsx**
   - Agregar tabs
   - Historial reproductivo
   - Historial médico
   - Gráfica de crecimiento

---

### **PASO 4: Sistema de Categorías Automático** ⏱️ 3-4 horas

1. **Crear servicio de transición**:
```typescript
// category.service.ts
class CategoryService {
  checkAndUpdateCategory(goat: Goat, newWeight: number) {
    const transitions = {
      CRIA: { minWeight: 18, nextCategory: 'LEVANTE_1' },
      LEVANTE_1: { minWeight: 25, nextCategory: 'LEVANTE_2' },
      LEVANTE_2: { 
        minWeight: 35, 
        nextCategory: goat.sex === 'FEMALE' ? 'REPRODUCTORA' : 'REPRODUCTOR' 
      }
    };
    
    // Lógica de transición...
  }
}
```

2. **Sistema de alertas**: Notificaciones cuando alcanza peso
3. **Historial de cambios**: Registrar en CambioCategoria
4. **Dashboard de transiciones**: Vista de animales listos para cambiar

---

### **PASO 5: Reportes PDF Mejorados** ⏱️ 2-3 horas

1. **Reporte Reproductivo**
   - Historial de una hembra
   - Todas las montas y partos
   - Gráfica de producción de crías

2. **Reporte Médico**
   - Historial de tratamientos
   - Calendario de vacunaciones
   - Costos por animal

3. **Reporte por Raza**
   - Estadísticas completas
   - Gráficas comparativas
   - Distribución por categorías

---

### **PASO 6: Empaquetado con Electron** ⏱️ 4-5 horas

**Para que funcione OFFLINE en la granja:**

1. **Instalar Electron**:
```bash
npm install --save-dev electron electron-builder concurrently
```

2. **Configurar electron.js**:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Incluir backend dentro de Electron
const backend = require('./backend/dist/index.js');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  win.loadFile('dist/index.html'); // Frontend compilado
}

app.whenReady().then(createWindow);
```

3. **Package.json scripts**:
```json
{
  "scripts": {
    "electron": "electron .",
    "build:electron": "electron-builder",
    "package": "npm run build && npm run build:electron"
  },
  "build": {
    "appId": "com.granme.caprisystem",
    "productName": "Sistema Capri Granme",
    "files": [
      "dist/**/*",
      "backend/dist/**/*",
      "prisma/**/*"
    ],
    "win": {
      "target": "portable",
      "icon": "assets/icon.ico"
    }
  }
}
```

**Resultado**: 
- Un solo archivo .exe ejecutable
- No necesita instalación
- Base de datos incluida
- Funciona 100% offline

---

### **PASO 7: Testing y Documentación** ⏱️ 3-4 horas

1. **Manual de usuario** (PDF con capturas)
2. **Videos tutoriales** (opcional)
3. **Testing con datos reales**
4. **Ajustes finales**

---

## 🔄 MIGRACIÓN FUTURA A SYMPHONY + ORACLE

### Cuando el granjero apruebe, migración en 3 pasos:

#### **Paso 1: Exportar Esquema**
```bash
# Generar SQL desde Prisma
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > migration.sql

# Adaptar a Oracle
# Cambiar tipos de datos SQLite → Oracle
```

#### **Paso 2: Backend Symphony**
```php
// Symphony Controller equivalente
class GoatController extends AbstractController {
  #[Route('/api/goats', methods: ['GET'])]
  public function index(GoatRepository $repo): JsonResponse {
    $goats = $repo->findAll();
    return $this->json($goats);
  }
}
```

**Ventaja**: La lógica de negocio se copia casi igual.

#### **Paso 3: Frontend sin cambios**
- React sigue siendo React
- Solo cambiar URL del backend
- Todo lo demás funciona igual

---

## 📅 CRONOGRAMA ESTIMADO

| Fase | Actividad | Tiempo | Acumulado |
|------|-----------|--------|-----------|
| 1 | Actualizar BD | 3h | 3h |
| 2 | Backend APIs | 5h | 8h |
| 3 | Frontend Páginas | 8h | 16h |
| 4 | Sistema Categorías | 4h | 20h |
| 5 | Reportes PDF | 3h | 23h |
| 6 | Empaquetado Electron | 5h | 28h |
| 7 | Testing + Docs | 4h | 32h |

**Total estimado: 32-40 horas** (1 semana a tiempo completo, 2-3 semanas part-time)

---

## 🎯 PRIORIDADES INMEDIATAS

### **HOY - DÍA 1**:
1. ✅ Actualizar schema.prisma
2. ✅ Crear migración
3. ✅ Implementar APIs de Medicamentos (backend)
4. ✅ Crear página MedicinesPage.tsx (básica)

### **DÍA 2**:
1. APIs de Reproducción (backend)
2. Página ReproductionPage.tsx
3. Sistema de generación de IDs

### **DÍA 3**:
1. Sistema de categorías automático
2. APIs de análisis por razas
3. Página BreedAnalysisPage.tsx

### **DÍA 4-5**:
1. Reportes PDF mejorados
2. Actualizar GoatsPage con tabs
3. Testing completo

### **DÍA 6-7**:
1. Empaquetado Electron
2. Documentación
3. Capacitación al usuario

---

## ✅ CHECKLIST COMPLETO

### Base de Datos
- [ ] Modelo Monta
- [ ] Modelo Medicamento
- [ ] Modelo AplicacionMedicamento
- [ ] Modelo CambioCategoria
- [ ] Modelo RegistroPeso
- [ ] Migración creada
- [ ] Seeds de prueba

### Backend
- [ ] CRUD Medicamentos
- [ ] CRUD Aplicaciones
- [ ] CRUD Montas
- [ ] Endpoint próximos partos
- [ ] Endpoint historial reproductivo
- [ ] Endpoint historial médico
- [ ] Endpoint stats por raza
- [ ] Sistema de alertas
- [ ] Generación de IDs

### Frontend
- [ ] MedicinesPage.tsx
- [ ] ReproductionPage.tsx
- [ ] BreedAnalysisPage.tsx
- [ ] Tabs en GoatsPage
- [ ] Formularios de Monta
- [ ] Formularios de Medicamento
- [ ] Formularios de Aplicación
- [ ] Gráficas Chart.js
- [ ] Alertas en Dashboard

### Reportes
- [ ] PDF Reproductivo
- [ ] PDF Médico
- [ ] PDF por Raza
- [ ] PDF Comparativo Razas

### Electron
- [ ] Configuración Electron
- [ ] Backend embebido
- [ ] Build scripts
- [ ] Icono y assets
- [ ] Instalador Windows
- [ ] Testing offline

### Documentación
- [ ] Manual de usuario
- [ ] Guía de instalación
- [ ] Video tutorial (opcional)
- [ ] Documentación técnica para migración

---

## 🚀 ¿EMPEZAMOS?

**Mi recomendación**: Empezar por el módulo de **Medicamentos** porque es el más sencillo e independiente. Luego **Reproducción** que es el más complejo, y finalmente **Análisis por Razas**.

**¿Quieres que empiece ahora mismo con el Paso 1 (actualizar schema.prisma)?** 

Solo confirma y empiezo a crear los modelos actualizados de base de datos. 🚀
