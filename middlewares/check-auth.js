const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: 'Authentication failed',
        errorCode: 401
      });
    }

    const token = authHeader.split(' ')[1]; // Assuming "Bearer TOKEN" format
    if (!token) {
      return res.status(401).json({
        message: 'Authentication failed',
        errorCode: 401
      });
    }

    const decodedToken = jwt.verify(token,SECRET_KEY );
    
    next();
  } catch (err) {
    return res.status(500).json({
      message: 'Authentication failed',
      errorCode: 500
    });
  }
};
