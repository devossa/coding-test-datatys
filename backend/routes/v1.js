const express = require("express");
const {
  createUser,
  getUsersList,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const router = express.Router();

// router.post("/auth/login", login);
router.get("/users", getUsersList);
router.post("/users/create", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Exporter le sous-routeur
module.exports = router;
