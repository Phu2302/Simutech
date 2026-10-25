# SimuTech - Google OAuth 2.0 Integration

He thong dang nhap bang Google OAuth 2.0 toi gian cho SimuTech voi React Frontend va Node.js/Express Backend.

---

## Cau truc thu muc

```
simutechLOG/
├── backend/
│   ├── src/
│   │   ├── config/index.js           # Bien moi truong
│   │   ├── controllers/authController.js # Xu ly /google, /me, /logout
│   │   ├── middleware/authMiddleware.js  # Kiem tra JWT tu HttpOnly cookie
│   │   ├── models/userModel.js       # In-memory user store (role mac dinh 'candidate')
│   │   ├── routes/authRoutes.js      # Route xac thuc
│   │   └── server.js                 # Express server & CORS
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header toi gian
│   │   │   ├── GoogleLoginCard.jsx   # Card dang nhap GoogleLogin
│   │   │   └── UserProfile.jsx       # Thong tin user & nut Logout
│   │   ├── context/AuthContext.jsx   # Auth state context
│   │   ├── services/api.js           # API request voi credentials: 'include'
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx                  # GoogleOAuthProvider wrap
│   ├── index.html
│   ├── vite.config.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── package.json
└── README.md
```

---

## Bien moi truong (.env)

### Backend (`backend/.env`):
```ini
PORT=5000
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
JWT_SECRET=simutech_super_secret_jwt_key_2025_change_in_production
NODE_ENV=development
```

### Frontend (`frontend/.env`):
```ini
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:5000
```

---

## Huong dan chay

### 1. Backend:
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```
Truy cap `http://localhost:5173`.
