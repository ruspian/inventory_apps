/*
  Warnings:

  - A unique constraint covering the columns `[kodeBarang]` on the table `Barang` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Barang" ADD COLUMN     "kodeBarang" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Barang_kodeBarang_key" ON "Barang"("kodeBarang");
