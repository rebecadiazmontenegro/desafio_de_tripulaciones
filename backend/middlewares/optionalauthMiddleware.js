function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  // Si no hay header de autorización, continuar sin autenticación
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Token inválido, pero NO bloqueamos la petición
      console.log("Token inválido en optionalAuth, continuando sin autenticación");
      return next();
    }

    // Token válido, adjuntamos el usuario
    req.user = decoded;
    next();
  });
}

module.exports = optionalAuthMiddleware;