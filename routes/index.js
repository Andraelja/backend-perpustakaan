//import express
const express = require("express");

//init express router
const router = express.Router();

// import verify toker
const verifyToken = require("../middlewares/auth");

//import register controller
const registerController = require("../controllers/RegisterController");
const loginController = require("../controllers/LoginController");
const userController = require("../controllers/UserController");
const bukuController = require("../controllers/BukuController");
const peminjamanController = require('../controllers/Peminjaman Controller');

//import validate register
const { validateRegister, validateLogin } = require("../utils/validators/auth");
const { validateUser } = require('../utils/validators/user')

// Auth
router.post("/register", validateRegister, registerController.register);
router.post("/login", validateLogin, loginController.login);

// user
router.get("/admin/users", verifyToken, userController.findUsers);
router.post("/admin/users", verifyToken, validateUser, userController.createUser);
router.get("/admin/users/:id", verifyToken, userController.findUserById);
router.put("/admin/users/:id", verifyToken, validateUser, userController.updateUser);
router.delete("/admin/users/:id", verifyToken, userController.deleteUser);

// buku
router.get("/admin/buku", bukuController.findBuku);
router.post("/admin/buku", bukuController.createBuku);
router.get("/admin/buku/:id", bukuController.findBukuById);
router.put("/admin/buku/:id", bukuController.updateBuku);
router.delete("/admin/buku/:id", bukuController.deleteBuku);

// peminjaman
router.get("/admin/peminjaman", peminjamanController.findPeminjaman);
router.post("/admin/peminjaman", peminjamanController.createPeminjaman);

//export router
module.exports = router;
