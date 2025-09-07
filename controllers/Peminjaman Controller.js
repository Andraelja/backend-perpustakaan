const express = require("express");

const prisma = require("../prisma/client");

const findPeminjaman = async (req, res) => {
  try {
    const peminjaman = await prisma.peminjaman.findMany({
      select: {
        id: true,
        id_buku: true,
        id_user: true,
        tanggal_peminjaman: true,
        tanggal_pengembalian: true,
        buku: {
          select: {
            judul: true,
          },
        },
        users: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).send({
      success: true,
      message: "Data ditemukan!",
      data: peminjaman,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error.message,
    });
  }
};

const createPeminjaman = async (req, res) => {
  try {
    const idBuku = parseInt(req.body.id_buku);
    const buku = await prisma.buku.findUnique({
      where: {
        id: idBuku,
      },
    });

    if (!buku) {
      return res.status(404).send({
        success: false,
        message: "Buku tidak ditemukan!",
      });
    }

    if (buku.stok <= 0) {
      return res.status(400).send({
        success: false,
        message: "Buku sudah habis !",
      });
    }

    const peminjaman = await prisma.$transaction(async (tx) => {
      const newPeminjaman = await tx.peminjaman.create({
        data: {
          id_buku: parseInt(req.body.id_buku),
          id_user: parseInt(req.body.id_user),
          // tanggal_peminjaman: req.body.tanggal_peminjaman, (terisi otomatis)
          tanggal_pengembalian: req.body.tanggal_pengembalian
            ? new Date(req.body.tanggal_pengembalian)
            : null,
        },
        include: {
          buku: {
            select: {
              judul: true,
            },
          },
          users: {
            select: {
              name: true,
            },
          },
        },
      });

      await tx.buku.update({
        where: {
          id: idBuku,
        },
        data: {
          stok: {
            decrement: 1,
          },
        },
      });
      return newPeminjaman;
    });

    return res.status(201).send({
      success: true,
      message: "Data berhasil ditambahkan !",
      data: peminjaman,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error.message,
    });
  }
};

module.exports = { findPeminjaman, createPeminjaman };
