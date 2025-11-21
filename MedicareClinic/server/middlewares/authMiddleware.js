const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ erro: 'Token não fornecido.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token inválido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};