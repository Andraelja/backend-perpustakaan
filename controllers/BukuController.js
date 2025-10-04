const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { error } = require("console");
const fs = require("fs");
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
        deskripsi: true,
        foto: true,
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
  if (!req.files || !req.files.foto) {
    return res.status(400).json({ message: "Foto tidak ditemukan!" });
  }

  const foto = req.files.foto;
  const ukuranFoto = foto.data.length;
  const ext = path.extname(foto.name);
  const unikKarakter = crypto.randomBytes(3).toString("hex");
  const namaFoto = unikKarakter + foto.md5 + ext;
  const fotoUrl = `${req.protocol}://${req.get("host")}/images/${namaFoto}`;
  const tipeFoto = [".png", ".jpg", ".jpeg"];

  if (!tipeFoto.includes(ext.toLowerCase())) {
    return res.status(400).json({
      message: "Tipe foto tidak sesuai! Harus png, jpg atau jpeg!",
    });
  }

  if (ukuranFoto > 5000000) {
    return res.status(400).json({
      message: "Ukuran foto terlalu besar! Maksimal 5mb!",
    });
  }

  try {
    await new Promise((resolve, reject) => {
      foto.mv(`./public/images/${namaFoto}`, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const buku = await prisma.buku.create({
      data: {
        judul: req.body.judul,
        penulis: req.body.penulis,
        penerbit: req.body.penerbit,
        tahun: req.body.tahun ? new Date(req.body.tahun).getFullYear() : null,
        kategori: req.body.kategori,
        deskripsi: req.body.deskripsi,
        foto: fotoUrl,
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
    console.error("Error createBuku:", error);

    const filePath = `./public/images/${namaFoto}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).send({
      success: false,
      message: "Terjadi kesalahan internal!",
      error: error.message,
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
        deskripsi: true,
        foto: true,
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
    // cek data lama
    const fotoLama = await prisma.buku.findUnique({
      where: { id: Number(id) },
    });

    if (!fotoLama) {
      return res.status(404).json({ message: "Data tidak ditemukan!" });
    }

    let fotoUrl = fotoLama.foto; // default pakai foto lama

    if (req.files && req.files.foto) {
      const fotoBaru = req.files.foto;
      const ukuranFoto = fotoBaru.data.length;
      const ext = path.extname(fotoBaru.name);
      const unikKarakter = crypto.randomBytes(3).toString("hex");
      const namaFoto = unikKarakter + fotoBaru.md5 + ext;
      fotoUrl = `${req.protocol}://${req.get("host")}/images/${namaFoto}`;
      const tipeFoto = [".png", ".jpg", ".jpeg"];

      if (!tipeFoto.includes(ext.toLowerCase())) {
        return res.status(400).json({
          message: "Tipe foto tidak sesuai! Harus png, jpg atau jpeg!",
        });
      }

      if (ukuranFoto > 5000000) {
        return res.status(400).json({
          message: "Ukuran foto terlalu besar! Maksimal 5mb!",
        });
      }

      // hapus file lama kalau ada
      const oldPath = `./public/images/${path.basename(fotoLama.foto)}`;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      fotoBaru.mv(`./public/images/${namaFoto}`, (error) => {
        if (error) return res.status(500).json({ message: error.message });
      });
    }
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
        deskripsi: req.body.deskripsi,
        foto: fotoUrl,
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
