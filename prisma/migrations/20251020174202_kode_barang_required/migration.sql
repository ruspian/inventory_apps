/*
  Warnings:

  - Made the column `kodeBarang` on table `Barang` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Barang" ALTER COLUMN "kodeBarang" SET NOT NULL;
