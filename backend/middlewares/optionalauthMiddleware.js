function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token inválido en optionalAuth, continuando sin autenticación");
      return next();
    }
    
    req.user = decoded;
    next();
  });
}

module.exports = optionalAuthMiddleware;