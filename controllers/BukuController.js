const express = require("express");

const prisma = require("../prisma/client");

const findBuku = async (req, res) => {
  try {
    const buku = await prisma.buku.findMany({
      select: {
        id: true,
        judul: true,
        penulis: true,
        penerbit: true,
        tahun: true,
        kategori: true,
        stok: true,
        status: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).send({
      success: true,
      message: "Berhasil mendapatkan semua buku!",
      data: buku,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Terjadi kesalahan memuat data!",
    });
  }
};

const createBuku = async (req, res) => {
  try {
    const buku = await prisma.buku.create({
      data: {
        judul: req.body.judul,
        penulis: req.body.penulis,
        penerbit: req.body.penerbit,
        tahun: req.body.tahun ? new Date(req.body.tahun).getFullYear() : null,
        kategori: req.body.kategori,
        stok: req.body.stok ? Number(req.body.stok) : 0,
        status: req.body.status || "tersedia",
      },
    });

    res.status(201).send({
      success: true,
      message: "Berhasil menambahkan data!",
      data: buku,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Terjadi kesalahan internal!",
    });
  }
};

const findBukuById = async (req, res) => {
  const { id } = req.params;
  try {
    const buku = await prisma.buku.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        judul: true,
        penulis: true,
        penerbit: true,
        tahun: true,
        kategori: true,
        stok: true,
      },
    });

    res.status(200).send({
      success: true,
      message: `Buku dengan id ${id} ditemukan!`,
      data: buku,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Terjadi kesalahan internal!",
    });
  }
};

const updateBuku = async (req, res) => {
  const { id } = req.params;

  try {
    const buku = await prisma.buku.update({
      where: {
        id: Number(id),
      },
      data: {
        judul: req.body.judul,
        penulis: req.body.penulis,
        penerbit: req.body.penerbit,
        tahun: req.body.tahun ? new Date(req.body.tahun).getFullYear() : null,
        kategori: req.body.kategori,
        stok: req.body.stok ? Number(req.body.stok) : 0,
      },
    });

    return res.status(200).send({
      success: true,
      message: "Berhasil memperbarui data!",
      data: buku,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Terjadi kesalahan internal!",
    });
  }
};

const deleteBuku = async (req, res) => {
  const { id } = req.params;

  try {
    const buku = await prisma.buku.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).send({
      success: true,
      message: "Berhasil menghapus data!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Terjadi kesalahan internal!",
    });
  }
};

module.exports = { findBuku, createBuku, findBukuById, updateBuku, deleteBuku };
