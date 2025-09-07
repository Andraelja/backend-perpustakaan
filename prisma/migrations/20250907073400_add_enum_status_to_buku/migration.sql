-- AlterTable
ALTER TABLE `buku` ADD COLUMN `status` ENUM('tersedia', 'dipinjam') NOT NULL DEFAULT 'tersedia';
