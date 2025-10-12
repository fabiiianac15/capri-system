-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Goat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customId" TEXT NOT NULL,
    "name" TEXT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Goat_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Goat" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "ReproductiveRecord" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReproductiveRecord_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vaccine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goatId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dose" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "applicationDate" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vaccine_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryOutput" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    CONSTRAINT "InventoryOutput_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventoryOutput_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nit" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "cityId" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Supplier_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "staffType" TEXT NOT NULL,
    "salary" REAL NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "specialization" TEXT,
    "academicDegree" TEXT,
    "managerId" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Staff_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Staff" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productType" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "goatId" TEXT,
    "saleDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sale_goatId_fkey" FOREIGN KEY ("goatId") REFERENCES "Goat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    CONSTRAINT "State_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    CONSTRAINT "City_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Goat_customId_key" ON "Goat"("customId");

-- CreateIndex
CREATE INDEX "Goat_customId_idx" ON "Goat"("customId");

-- CreateIndex
CREATE INDEX "Goat_breed_idx" ON "Goat"("breed");

-- CreateIndex
CREATE INDEX "Goat_category_idx" ON "Goat"("category");

-- CreateIndex
CREATE INDEX "ReproductiveRecord_goatId_idx" ON "ReproductiveRecord"("goatId");

-- CreateIndex
CREATE INDEX "Vaccine_goatId_idx" ON "Vaccine"("goatId");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "InventoryOutput_productId_idx" ON "InventoryOutput"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_nit_key" ON "Supplier"("nit");

-- CreateIndex
CREATE INDEX "Supplier_name_idx" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_dni_key" ON "Staff"("dni");

-- CreateIndex
CREATE INDEX "Staff_dni_idx" ON "Staff"("dni");

-- CreateIndex
CREATE INDEX "Sale_saleDate_idx" ON "Sale"("saleDate");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "State_countryId_name_key" ON "State"("countryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "City_stateId_name_key" ON "City"("stateId", "name");
