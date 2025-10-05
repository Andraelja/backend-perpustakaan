-- CreateTable
CREATE TABLE `peminjamanBuku` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_buku` INTEGER NOT NULL,
    `id_peminjaman` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `peminjamanBuku` ADD CONSTRAINT `peminjamanBuku_id_buku_fkey` FOREIGN KEY (`id_buku`) REFERENCES `buku`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peminjamanBuku` ADD CONSTRAINT `peminjamanBuku_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peminjamanBuku` ADD CONSTRAINT `peminjamanBuku_id_peminjaman_fkey` FOREIGN KEY (`id_peminjaman`) REFERENCES `peminjaman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
