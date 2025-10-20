-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Staff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "staffType" TEXT NOT NULL,
    "salary" REAL,
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
INSERT INTO "new_Staff" ("academicDegree", "createdAt", "dni", "endDate", "fullName", "id", "managerId", "salary", "specialization", "staffType", "startDate", "updatedAt", "yearsExperience") SELECT "academicDegree", "createdAt", "dni", "endDate", "fullName", "id", "managerId", "salary", "specialization", "staffType", "startDate", "updatedAt", "yearsExperience" FROM "Staff";
DROP TABLE "Staff";
ALTER TABLE "new_Staff" RENAME TO "Staff";
CREATE UNIQUE INDEX "Staff_dni_key" ON "Staff"("dni");
CREATE INDEX "Staff_dni_idx" ON "Staff"("dni");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
