-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "registerNewProduct" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nameProduct" TEXT NOT NULL,
    "descriptionProduct" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("descriptionProduct", "nameProduct", "productId", "userId") SELECT "descriptionProduct", "nameProduct", "productId", "userId" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
