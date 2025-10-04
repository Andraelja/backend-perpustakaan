-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NULL,
    `role` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buku` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(255) NULL,
    `penulis` VARCHAR(255) NOT NULL,
    `penerbit` VARCHAR(255) NULL,
    `tahun` INTEGER NULL,
    `kategori` VARCHAR(255) NULL,
    `deskripsi` VARCHAR(255) NULL,
    `foto` VARCHAR(255) NULL,
    `stok` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('tersedia', 'dipinjam') NOT NULL DEFAULT 'tersedia',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `peminjaman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_buku` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `tanggal_peminjaman` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggal_pengembalian` DATETIME(3) NULL,
    `status` ENUM('BELUM_DIKEMBALIKAN', 'SUDAH_DIKEMBALIKAN') NOT NULL DEFAULT 'BELUM_DIKEMBALIKAN',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `peminjaman` ADD CONSTRAINT `peminjaman_id_buku_fkey` FOREIGN KEY (`id_buku`) REFERENCES `buku`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peminjaman` ADD CONSTRAINT `peminjaman_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
