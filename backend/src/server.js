const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. Cấu hình CORS để cho phép Frontend gửi Cookie (credentials: true)
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có origin (như Postman hoặc curl) hoặc origin nằm trong danh sách được phép
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true, // BẮT BUỘC để trình duyệt gửi & nhận HttpOnly Cookie
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. Parser Middleware
app.use(express.json());
app.use(cookieParser());

// 3. Request logger đơn giản
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 4. Routes
app.use('/api/auth', authRoutes);

// Endpoint kiểm tra sức khỏe hệ thống
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SimuTech Auth Service',
    timestamp: new Date().toISOString(),
  });
});

// 5. Khởi động server
app.listen(config.port, () => {
  console.log(`Backend server running on http://localhost:${config.port}`);
  console.log(`Client URL: ${config.clientUrl}`);
});
