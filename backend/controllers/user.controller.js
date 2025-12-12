const usersModels = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }
    const user = await usersModels.getUserModel(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol,
        departamento: user.departamento,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login correcto",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        departamento: user.departamento,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      message: "Error en login",
      error: error.message,
    });
  }
};

const signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { nombre, apellidos, email, password } = req.body;

    if (!nombre || !apellidos || !email || !password) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    const creatorRole = req.user.rol;
    let newUserRole = "";
    let departamento = req.body.departamento || null;

    if (creatorRole === "admin") {
      newUserRole = "manager";
      if (!departamento) {
        departamento = req.body.departamento;
      }
    } else if (creatorRole === "manager") {
      newUserRole = "worker";
      departamento = req.user.departamento;
    } else {
      return res
        .status(403)
        .json({ msg: "No tienes permisos para crear usuarios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await usersModels.createUserModel({
      nombre,
      apellidos,
      email,
      password: hashedPassword,
      departamento,
      rol: newUserRole,
    });

    return res.status(201).json({
      msg: `${newUserRole} creado correctamente`,
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        apellidos: newUser.apellidos,
        email: email,
        rol: newUserRole,
        departamento: newUser.departamento,
      },
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return res.status(500).json({ msg: error.message });
  }
};

function logOut(req, res) {
  res.clearCookie("token");
  res.redirect("/login");
}

const getAllManagers = async (req, res) => {
  try {
    const managers = await usersModels.getAllManagersModel();
    return res.status(200).json(managers); 
  } catch (error) {
    console.error("Error en getAllManagers:", error);
    return res.status(500).json({ msg: error.message });
  }
};

const getAllWorkers = async (req, res) => {
  try {
    const workers = await usersModels.getAllWorkersModel();
    return res.status(200).json(workers); 
  } catch (error) {
    console.error("Error en getAllWorkers:", error);
    return res.status(500).json({ msg: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const emailToDelete = req.params.email; 

    if (!emailToDelete) {
      return res.status(400).json({ msg: "El email del usuario es obligatorio" });
    }

    const userToDelete = await usersModels.getUserModel(emailToDelete);
    if (!userToDelete) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const requesterRole = req.user.rol; 
    const targetRole = userToDelete.rol;

    if (
      (requesterRole === "admin" && targetRole === "manager") ||
      (requesterRole === "manager" && targetRole === "worker")
    ) {
      const deletedUser = await usersModels.deleteUserByEmail(emailToDelete);
      return res.status(200).json({
        msg: `Usuario ${deletedUser.nombre} ${deletedUser.apellidos} eliminado correctamente`,
        user: deletedUser,
      });
    } else {
      return res.status(403).json({
        msg: "No tienes permisos para eliminar a este usuario",
      });
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ msg: error.message });
  }
};


module.exports = {
  signUp,
  loginUser,
  logOut,
  deleteUser,
  getAllManagers,
  getAllWorkers
};
