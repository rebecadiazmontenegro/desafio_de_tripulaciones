const usersModels = require("../models/user.model");
const { changePassword } = require("../services/email_services");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');


const { validationResult } = require("express-validator");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Email que llega al Login:", email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }
    
    const user = await usersModels.getUserModel(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    
    if (user.bloqueado_hasta) {
      const now = new Date();
      const lockDate = new Date(user.bloqueado_hasta);

      if (now < lockDate) {
        return res.status(429).json({ 
          message: "Cuenta bloqueada temporalmente." 
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // Contraseña incorrecta -> Sumar intentos y bloquear
      const currentAttempts = (user.intentos_fallidos || 0) + 1;
      let lockUntil = null;
      let errorMsg = "Contraseña incorrecta";

      // Si llega a 5 intentos, bloqueamos
      if (currentAttempts >= 5) {
        const blockMinutes = 5; // Tiempo de bloqueo
        lockUntil = new Date(Date.now() + blockMinutes * 60000); 
        errorMsg = "Has excedido el numero de intentos. Cuenta bloqueada temporalmente.";
      }

      // Guardamos el fallo en BD
      if(usersModels.updateLoginAttemptsModel) {
          await usersModels.updateLoginAttemptsModel(user.id, currentAttempts, lockUntil);
      }

      return res.status(401).json({ 
        message: errorMsg,
        intentos_restantes: Math.max(0, 5 - currentAttempts)
      });
    }

    
    // Si la contraseña es correcta, limpiamos los fallos anteriores
    if(usersModels.updateLoginAttemptsModel) {
        await usersModels.updateLoginAttemptsModel(user.id, 0, null);
    }


    
    // ¿Está el semáforo rojo activado? 
    if(user.reset_password) {

      const nowDate = new Date();
      const expirationDate = new Date(user.reset_password_expires);

      // Comprobamos si ha caducado el tiempo de la contraseña temporal
      if(nowDate > expirationDate) {
        // Si la contraseña ha caducado:
        return res.status(403).json({
          message: "Su contraseña temporal ha caducado. Pide una nueva.",
        });
      }
      
      // No generamos token hasta cambiar contraseña
      return res.status(200).json({
        message: "Login correcto, pero cambia la contraseña ahora.",
        action: "FORCE_PASSWORD_CHANGE", // Le dice al front qué pantalla mostrar
        user: {
          id: user.id,         
          nombre: user.nombre, 
          apellidos: user.apellidos,
          email: user.email,
          rol: user.rol,
          departamento: user.departamento
        },
      });
    }

    // Generación normal del Token (si no hay reset_password pendiente)
    const token = jwt.sign(
      { 
        id: user.id,            
        email: user.email, 
        rol: user.rol,
        departamento: user.departamento  
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Generamos token
    return res.status(200).json({
      message: "Login correcto.",
      token,
      user: {
        id: user.id,         
        nombre: user.nombre, 
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
        departamento: user.departamento
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
  try {
    const { nombre, apellidos, email } = req.body;

    if (!nombre || !apellidos || !email) {
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
      return res.status(403).json({ msg: "No tienes permisos para crear usuarios" });
    }
    
    // Genera 8 caracteres aleatorios (hexadecimales)
    const defaultPassword = crypto.randomBytes(4).toString('hex');
    // Hasheo de contraseña
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    // Calcular fecha: Hora actual + 15 minutos
    const passwordExpiration = new Date(Date.now() + 30 * 60 * 1000);

    
    const newUser = await usersModels.createUserModel({
      nombre,
      apellidos,
      email,          
      password: hashedPassword,
      reset_password: true, // Semáforo en Rojo
      reset_password_expires: passwordExpiration, // Cuenta atrás Activada
      departamento,
      rol: newUserRole
    });

    // Envío el email al nuevo empleado
    const emailSent = await changePassword(email, nombre, defaultPassword);

    if(!emailSent) {
      return res.status(201).json({
        message: `${newUserRole} creado correctamente, pero falló el envío del email. Avise al admin.`,
        user: newUser
      })
    }

    res.status(201).json({
      msg: `${newUserRole} creado correctamente y notificado por email.`,
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        apellidos: newUser.apellidos,
        email: email,    
        rol: newUserRole,
        departamento: newUser.departamento
      }
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
      return res
        .status(400)
        .json({ msg: "El email del usuario es obligatorio" });
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

// const changePassword = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array(),
//     });
//   }

//   try {
//     const { currentPassword, newPassword } = req.body;
//     const userId = req.user.id;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         message: "Contraseña actual y nueva contraseña son requeridas",
//       });
//     }
//     const user = await usersModels.getUserByIdModel(userId);
//     if (!user) {
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     }

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Contraseña actual incorrecta" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await usersModels.updatePasswordModel(userId, hashedPassword);

//     return res.status(200).json({
//       message: "Contraseña actualizada correctamente",
//     });
//   } catch (error) {
//     console.error("Error al cambiar contraseña:", error);
//     res.status(500).json({
//       message: "Error al cambiar contraseña",
//       error: error.message,
//     });
//   }
// };

const updatePassword = async (req,res) => {
  const { email, defaultPassword, newPassword } = req.body;

  if(!email || !defaultPassword || !newPassword) {
    return res.status(400).json({ message: "Faltan datos obligatorios." });
  }

  try {
    // Buscamos al usuario
    const user = await usersModels.getUserModel(email);
    if(!user) {
      return res.status(400).json({ message: "Usuario no encontrado."});
    }

    // Vemos si la contraseña temporal coincide con la que está guardada
    const verifyPassword = await bcrypt.compare(defaultPassword, user.password);
    console.log("3. Contraseña coincide:", verifyPassword);
    if(!verifyPassword) {
      return res.status(400).json({ message: "La contraseña aleatoria es incorrecta." });
    }

    // Hasheamos la Nueva Contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10);


    // Guardamos en la BBDD
    await usersModels.updatePasswordModel(email, newPasswordHash);

    // if(!userUpdate) {
    //   return res.status(404).json({ message: "No se encontró el usuario. Verifica el email."});
    // }
    res.status(200).json({ message: "Contraseña actualiza! Inicia Sesión." });

  } catch (error) {
        console.error("Error al Cambiar Contraseña:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
}

module.exports = {
  signUp,
  loginUser,
  logOut,
  deleteUser,
  getAllManagers,
  getAllWorkers,
  // changePassword,
  updatePassword
};
