/*
  Warnings:

  - Added the required column `productId` to the `Memory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Product" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "nameProduct" TEXT NOT NULL,
    "descriptionProduct" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Memory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("productId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Memory" ("content", "coverUrl", "createdAt", "id", "isPublic", "userId") SELECT "content", "coverUrl", "createdAt", "id", "isPublic", "userId" FROM "Memory";
DROP TABLE "Memory";
ALTER TABLE "new_Memory" RENAME TO "Memory";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("id", "login", "name") SELECT "id", "login", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
