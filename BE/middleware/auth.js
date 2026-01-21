import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware xác thực token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Thông tin user từ token
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware kiểm tra admin
export const verifyAdmin = (req, res, next) => {
  // Đảm bảo đã xác thực token trước đó
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }

  next();
};
