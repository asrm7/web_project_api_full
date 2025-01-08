const jwt = require("jsonwebtoken");
const HttpStatus = require("../utils/httpStatus");

// Middleware de autenticação
function authenticate(req, res, next) {
  const publicRoutes = ["/signin", "/signup"]; // Rotas públicas

  // Verifica se a rota é pública
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: "Acesso negado. Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, '2008');
    req.user = payload; // Anexa os dados do token ao objeto `req`
    next();
  } catch (err) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: "Acesso negado. Token inválido ou expirado." });
  }
}

module.exports = authenticate;
