-- CreateTable
CREATE TABLE "Monta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hembraId" TEXT NOT NULL,
    "machoId" TEXT NOT NULL,
    "machoCustomId" TEXT NOT NULL,
    "machoBreed" TEXT NOT NULL,
    "machoName" TEXT,
    "fechaMonta" DATETIME NOT NULL,
    "fechaEstimadaParto" DATETIME NOT NULL,
    "fechaParto" DATETIME,
    "tipoEvento" TEXT NOT NULL DEFAULT 'GESTACION',
    "numeroParto" INTEGER NOT NULL DEFAULT 1,
    "totalCrias" INTEGER NOT NULL DEFAULT 0,
    "criasHembra" INTEGER NOT NULL DEFAULT 0,
    "criasMacho" INTEGER NOT NULL DEFAULT 0,
    "criasMuertas" INTEGER NOT NULL DEFAULT 0,
    "detallesCrias" TEXT,
    "complicaciones" TEXT,
    "veterinarioAsistio" BOOLEAN NOT NULL DEFAULT false,
    "tratamientosPostParto" TEXT,
    "inicioProduccionLeche" DATETIME,
    "produccionPromedio" REAL,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Monta_hembraId_fkey" FOREIGN KEY ("hembraId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Monta_machoId_fkey" FOREIGN KEY ("machoId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Medicamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT,
    "dosis" TEXT NOT NULL,
    "viaAdministracion" TEXT NOT NULL,
    "fabricante" TEXT,
    "lote" TEXT,
    "fechaVencimiento" DATETIME,
    "stockActual" REAL NOT NULL,
    "stockMinimo" REAL NOT NULL,
    "unidadMedida" TEXT NOT NULL,
    "precioUnitario" REAL,
    "ubicacionAlmacen" TEXT,
    "condicionesAlmacenamiento" TEXT,
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AplicacionMedicamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goatId" TEXT NOT NULL,
    "medicamentoId" TEXT NOT NULL,
    "fechaAplicacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dosis" TEXT NOT NULL,
    "viaAdministrada" TEXT NOT NULL,
    "veterinario" TEXT,
    "aplicadoPor" TEXT,
    "motivo" TEXT NOT NULL,
    "diagnostico" TEXT,
    "proximaDosis" DATETIME,
    "frecuencia" TEXT,
    "observaciones" TEXT,
    "reaccionAdversa" TEXT,
    "efectividad" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AplicacionMedicamento_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AplicacionMedicamento_medicamentoId_fkey" FOREIGN KEY ("medicamentoId") REFERENCES "Medicamento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CambioCategoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goatId" TEXT NOT NULL,
    "categoriaAnterior" TEXT NOT NULL,
    "categoriaNueva" TEXT NOT NULL,
    "pesoAlCambio" REAL NOT NULL,
    "edadMeses" INTEGER,
    "motivo" TEXT,
    "realizadoPor" TEXT,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CambioCategoria_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegistroPeso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goatId" TEXT NOT NULL,
    "peso" REAL NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoRegistro" TEXT NOT NULL DEFAULT 'RUTINARIO',
    "notas" TEXT,
    "registradoPor" TEXT,
    CONSTRAINT "RegistroPeso_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Monta_hembraId_idx" ON "Monta"("hembraId");

-- CreateIndex
CREATE INDEX "Monta_machoId_idx" ON "Monta"("machoId");

-- CreateIndex
CREATE INDEX "Monta_fechaMonta_idx" ON "Monta"("fechaMonta");

-- CreateIndex
CREATE INDEX "Monta_fechaEstimadaParto_idx" ON "Monta"("fechaEstimadaParto");

-- CreateIndex
CREATE INDEX "Medicamento_tipo_idx" ON "Medicamento"("tipo");

-- CreateIndex
CREATE INDEX "Medicamento_fechaVencimiento_idx" ON "Medicamento"("fechaVencimiento");

-- CreateIndex
CREATE INDEX "AplicacionMedicamento_goatId_idx" ON "AplicacionMedicamento"("goatId");

-- CreateIndex
CREATE INDEX "AplicacionMedicamento_medicamentoId_idx" ON "AplicacionMedicamento"("medicamentoId");

-- CreateIndex
CREATE INDEX "AplicacionMedicamento_fechaAplicacion_idx" ON "AplicacionMedicamento"("fechaAplicacion");

-- CreateIndex
CREATE INDEX "AplicacionMedicamento_proximaDosis_idx" ON "AplicacionMedicamento"("proximaDosis");

-- CreateIndex
CREATE INDEX "CambioCategoria_goatId_idx" ON "CambioCategoria"("goatId");

-- CreateIndex
CREATE INDEX "CambioCategoria_fecha_idx" ON "CambioCategoria"("fecha");

-- CreateIndex
CREATE INDEX "RegistroPeso_goatId_idx" ON "RegistroPeso"("goatId");

-- CreateIndex
CREATE INDEX "RegistroPeso_fecha_idx" ON "RegistroPeso"("fecha");

-- CreateIndex
CREATE INDEX "Goat_status_idx" ON "Goat"("status");
