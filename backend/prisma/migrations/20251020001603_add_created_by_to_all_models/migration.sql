/*
  Warnings:

  - Added the required column `createdById` to the `AplicacionMedicamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Goat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Medicamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Monta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `ReproductiveRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Vaccine` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AplicacionMedicamento" (
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
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AplicacionMedicamento_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AplicacionMedicamento_medicamentoId_fkey" FOREIGN KEY ("medicamentoId") REFERENCES "Medicamento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AplicacionMedicamento_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AplicacionMedicamento" ("aplicadoPor", "createdAt", "diagnostico", "dosis", "efectividad", "fechaAplicacion", "frecuencia", "goatId", "id", "medicamentoId", "motivo", "observaciones", "proximaDosis", "reaccionAdversa", "updatedAt", "veterinario", "viaAdministrada", "createdById") SELECT "aplicadoPor", "createdAt", "diagnostico", "dosis", "efectividad", "fechaAplicacion", "frecuencia", "goatId", "id", "medicamentoId", "motivo", "observaciones", "proximaDosis", "reaccionAdversa", "updatedAt", "veterinario", "viaAdministrada", 'cmgml2zro0000btbazkqkz0ah' FROM "AplicacionMedicamento";
DROP TABLE "AplicacionMedicamento";
ALTER TABLE "new_AplicacionMedicamento" RENAME TO "AplicacionMedicamento";
CREATE INDEX "AplicacionMedicamento_goatId_idx" ON "AplicacionMedicamento"("goatId");
CREATE INDEX "AplicacionMedicamento_medicamentoId_idx" ON "AplicacionMedicamento"("medicamentoId");
CREATE INDEX "AplicacionMedicamento_fechaAplicacion_idx" ON "AplicacionMedicamento"("fechaAplicacion");
CREATE INDEX "AplicacionMedicamento_proximaDosis_idx" ON "AplicacionMedicamento"("proximaDosis");
CREATE TABLE "new_Goat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customId" TEXT NOT NULL,
    "name" TEXT,
    "photo" TEXT,
    "breed" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "weight" REAL,
    "category" TEXT NOT NULL DEFAULT 'CRIA',
    "milkProduction" REAL NOT NULL DEFAULT 0,
    "feedConsumption" REAL NOT NULL DEFAULT 0,
    "birthCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "motherId" TEXT,
    "fatherId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Goat_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Goat" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "Goat_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Goat" ("birthCount", "birthDate", "breed", "category", "createdAt", "customId", "fatherId", "feedConsumption", "id", "milkProduction", "motherId", "name", "notes", "photo", "sex", "status", "updatedAt", "weight", "createdById") SELECT "birthCount", "birthDate", "breed", "category", "createdAt", "customId", "fatherId", "feedConsumption", "id", "milkProduction", "motherId", "name", "notes", "photo", "sex", "status", "updatedAt", "weight", 'cmgml2zro0000btbazkqkz0ah' FROM "Goat";
DROP TABLE "Goat";
ALTER TABLE "new_Goat" RENAME TO "Goat";
CREATE UNIQUE INDEX "Goat_customId_key" ON "Goat"("customId");
CREATE INDEX "Goat_customId_idx" ON "Goat"("customId");
CREATE INDEX "Goat_breed_idx" ON "Goat"("breed");
CREATE INDEX "Goat_category_idx" ON "Goat"("category");
CREATE INDEX "Goat_status_idx" ON "Goat"("status");
CREATE TABLE "new_Medicamento" (
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
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Medicamento_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Medicamento" ("activo", "condicionesAlmacenamiento", "createdAt", "descripcion", "dosis", "fabricante", "fechaVencimiento", "id", "lote", "nombre", "notas", "precioUnitario", "stockActual", "stockMinimo", "tipo", "ubicacionAlmacen", "unidadMedida", "updatedAt", "viaAdministracion", "createdById") SELECT "activo", "condicionesAlmacenamiento", "createdAt", "descripcion", "dosis", "fabricante", "fechaVencimiento", "id", "lote", "nombre", "notas", "precioUnitario", "stockActual", "stockMinimo", "tipo", "ubicacionAlmacen", "unidadMedida", "updatedAt", "viaAdministracion", 'cmgml2zro0000btbazkqkz0ah' FROM "Medicamento";
DROP TABLE "Medicamento";
ALTER TABLE "new_Medicamento" RENAME TO "Medicamento";
CREATE INDEX "Medicamento_tipo_idx" ON "Medicamento"("tipo");
CREATE INDEX "Medicamento_fechaVencimiento_idx" ON "Medicamento"("fechaVencimiento");
CREATE TABLE "new_Monta" (
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
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Monta_hembraId_fkey" FOREIGN KEY ("hembraId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Monta_machoId_fkey" FOREIGN KEY ("machoId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Monta_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Monta" ("complicaciones", "createdAt", "criasHembra", "criasMacho", "criasMuertas", "detallesCrias", "fechaEstimadaParto", "fechaMonta", "fechaParto", "hembraId", "id", "inicioProduccionLeche", "machoBreed", "machoCustomId", "machoId", "machoName", "notas", "numeroParto", "produccionPromedio", "tipoEvento", "totalCrias", "tratamientosPostParto", "updatedAt", "veterinarioAsistio", "createdById") SELECT "complicaciones", "createdAt", "criasHembra", "criasMacho", "criasMuertas", "detallesCrias", "fechaEstimadaParto", "fechaMonta", "fechaParto", "hembraId", "id", "inicioProduccionLeche", "machoBreed", "machoCustomId", "machoId", "machoName", "notas", "numeroParto", "produccionPromedio", "tipoEvento", "totalCrias", "tratamientosPostParto", "updatedAt", "veterinarioAsistio", 'cmgml2zro0000btbazkqkz0ah' FROM "Monta";
DROP TABLE "Monta";
ALTER TABLE "new_Monta" RENAME TO "Monta";
CREATE INDEX "Monta_hembraId_idx" ON "Monta"("hembraId");
CREATE INDEX "Monta_machoId_idx" ON "Monta"("machoId");
CREATE INDEX "Monta_fechaMonta_idx" ON "Monta"("fechaMonta");
CREATE INDEX "Monta_fechaEstimadaParto_idx" ON "Monta"("fechaEstimadaParto");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "currentStock" REAL NOT NULL,
    "minStock" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "supplierId" TEXT,
    "location" TEXT,
    "expirationDate" DATETIME,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("category", "createdAt", "currentStock", "description", "expirationDate", "id", "location", "minStock", "name", "price", "supplierId", "unit", "updatedAt", "createdById") SELECT "category", "createdAt", "currentStock", "description", "expirationDate", "id", "location", "minStock", "name", "price", "supplierId", "unit", "updatedAt", 'cmgml2zro0000btbazkqkz0ah' FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE TABLE "new_ReproductiveRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goatId" TEXT NOT NULL,
    "maleId" TEXT NOT NULL,
    "maleCustomId" TEXT NOT NULL,
    "maleBreed" TEXT NOT NULL,
    "mountingDate" DATETIME NOT NULL,
    "expectedBirth" DATETIME NOT NULL,
    "actualBirthDate" DATETIME,
    "wasAbortion" BOOLEAN NOT NULL DEFAULT false,
    "birthNumber" INTEGER NOT NULL,
    "femaleOffspring" INTEGER NOT NULL DEFAULT 0,
    "maleOffspring" INTEGER NOT NULL DEFAULT 0,
    "totalOffspring" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReproductiveRecord_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReproductiveRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ReproductiveRecord" ("actualBirthDate", "birthNumber", "createdAt", "expectedBirth", "femaleOffspring", "goatId", "id", "maleBreed", "maleCustomId", "maleId", "maleOffspring", "mountingDate", "notes", "totalOffspring", "updatedAt", "wasAbortion", "createdById") SELECT "actualBirthDate", "birthNumber", "createdAt", "expectedBirth", "femaleOffspring", "goatId", "id", "maleBreed", "maleCustomId", "maleId", "maleOffspring", "mountingDate", "notes", "totalOffspring", "updatedAt", "wasAbortion", 'cmgml2zro0000btbazkqkz0ah' FROM "ReproductiveRecord";
DROP TABLE "ReproductiveRecord";
ALTER TABLE "new_ReproductiveRecord" RENAME TO "ReproductiveRecord";
CREATE INDEX "ReproductiveRecord_goatId_idx" ON "ReproductiveRecord"("goatId");
CREATE TABLE "new_Vaccine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goatId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dose" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "applicationDate" DATETIME NOT NULL,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vaccine_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vaccine_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vaccine" ("applicationDate", "createdAt", "dose", "goatId", "id", "name", "notes", "unit", "createdById") SELECT "applicationDate", "createdAt", "dose", "goatId", "id", "name", "notes", "unit", 'cmgml2zro0000btbazkqkz0ah' FROM "Vaccine";
DROP TABLE "Vaccine";
ALTER TABLE "new_Vaccine" RENAME TO "Vaccine";
CREATE INDEX "Vaccine_goatId_idx" ON "Vaccine"("goatId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
