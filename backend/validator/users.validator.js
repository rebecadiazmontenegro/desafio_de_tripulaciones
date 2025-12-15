const { body, param } = require("express-validator");

const validateCreateUser = [

  body("nombre")
    .exists().withMessage("El nombre es obligatorio")
    .isString().withMessage("El nombre debe ser un texto")
    .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),

  body("apellidos")
    .exists().withMessage("Los apellidos son obligatorios")
    .isString().withMessage("Los apellidos deben ser texto"),

  body("email")
    .exists().withMessage("El email es obligatorio")
    .isEmail().withMessage("Debe ser un email válido"),

  body("password")
    .exists().withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/(?=.*[a-z])/).withMessage("La contraseña debe tener al menos una minúscula")
    .matches(/(?=.*[A-Z])/).withMessage("La contraseña debe tener al menos una mayúscula")
    .matches(/(?=.*\d)/).withMessage("La contraseña debe tener al menos un número")
    .matches(/(?=.*[\W_])/).withMessage("La contraseña debe tener al menos un carácter especial"),

  body("departamento")
    .optional()
    .isString().withMessage("El departamento debe ser texto"),

  body("rol")
    .optional()
    .isString().withMessage("El rol debe ser un texto"),
];

const validateLoginUser = [

  body("email")
    .exists().withMessage("El email es obligatorio")
    .isEmail().withMessage("Debe ser un email válido"),

  body("password")
    .exists().withMessage("La contraseña es obligatoria")
];


module.exports = {
  validateCreateUser,
  validateLoginUser
};
