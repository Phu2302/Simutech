require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  jwtSecret: process.env.JWT_SECRET || 'simutech_secret_jwt_fallback_key',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

if (!config.googleClientId || config.googleClientId.includes('your_google_client_id')) {
  console.warn('[WARNING] GOOGLE_CLIENT_ID chua duoc thiet lap trong backend/.env');
}

module.exports = config;
