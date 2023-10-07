const jwt = require("jsonwebtoken");
// const secret = process.env.JWT_SECRET;
const secret = '123'

function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: "5h" });
}

function validateToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error(error);
    return null;
  }
}

function middlewareAuth(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(400).json({ message: "Authorization header missing" });
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(400).json({ message: "Invalid Authorization header format" });
  }
  
  const decoded = validateToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  req.user = decoded.loginUser;
  return next();
}

module.exports = {
  generateToken,
  validateToken,
  middlewareAuth,
};

