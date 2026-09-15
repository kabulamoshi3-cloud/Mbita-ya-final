# Admin Login Guide

## 🔐 Admin Login Credentials

**Live Website:** https://deogratis-mbita.onrender.com

**Login URL:** https://deogratis-mbita.onrender.com/login

**Default Credentials:**
- **Username:** `Mbita`
- **Password:** `Mbita@2026`

---

## 🚀 How Admin Login Works

### 1. **Login Flow**
- Navigate to `/login` page
- Enter username and password
- System checks credentials against PostgreSQL database
- If valid, creates secure session cookie
- Redirects to `/admin` dashboard

### 2. **Auto-Creation Feature**
The login route includes an auto-creation feature:
- If no admin user exists in the database
- AND you use the default credentials (Mbita / Mbita@2026)
- The system will automatically create the admin account
- This ensures you can always login even on a fresh database

### 3. **Security Features**
- **Password Hashing:** Uses bcryptjs with salt rounds
- **Session Management:** Iron-session with 7-day cookie expiration
- **Failed Login Protection:** Account locks after 5 failed attempts for 15 minutes
- **Two-Factor Authentication:** Optional TOTP support (disabled by default)
- **Session Timeout:** 8-hour inactivity timeout
- **Security Logging:** All login attempts logged to SecurityLog table

### 4. **Protected Routes**
The middleware protects these routes:
- `/admin/*` - Admin dashboard and all admin pages
- `/api/admin/*` - Admin API endpoints

Accessing protected routes without login redirects to `/login`

---

## 🔧 Database Configuration

**Current Database:** PostgreSQL on Render
```
postgresql://mbita_user:UMkuBF9t2w6nrqRk0UuMRrtMNDQCgqrw@dpg-dakhotp594qs73e484p0-a.frankfurt-postgres.render.com/mbita_database?sslmode=require
```

**Key Points:**
- SSL/TLS required (`?sslmode=require`)
- Database initialized with `init-database.mjs` script
- Admin user created during initialization

---

## 🧪 Testing Admin Login

### Method 1: Browser Test
1. Open https://deogratis-mbita.onrender.com/login
2. Enter credentials:
   - Username: `Mbita`
   - Password: `Mbita@2026`
3. Click "Sign In"
4. Should redirect to `/admin` dashboard

### Method 2: API Test (curl)
```bash
curl -X POST https://deogratis-mbita.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Mbita","password":"Mbita@2026"}' \
  -c cookies.txt -v
```

Expected response:
```json
{"message":"Login successful."}
```

### Method 3: Check Database
Run this SQL query to verify admin user exists:
```sql
SELECT id, username, "failedAttempts", "totpEnabled", "createdAt" 
FROM "AdminUser" 
WHERE username = 'Mbita';
```

---

## 🐛 Troubleshooting

### Issue: "Invalid credentials"
**Possible Causes:**
1. Admin user not created in database
2. Wrong password (case-sensitive)
3. Database connection issue

**Solutions:**
1. Run initialization script: `node init-database.mjs`
2. Check password is exactly: `Mbita@2026` (capital M, @ symbol, capital B)
3. Verify DATABASE_URL environment variable in Render

### Issue: "Database connection error"
**Possible Causes:**
1. DATABASE_URL not set in Render environment variables
2. SSL mode not configured
3. Database server down

**Solutions:**
1. Check Render environment variables include DATABASE_URL
2. Ensure `?sslmode=require` is appended to DATABASE_URL
3. Check Render PostgreSQL service status

### Issue: "Account is temporarily locked"
**Cause:** Too many failed login attempts (5+)

**Solution:** Wait 15 minutes, or manually reset in database:
```sql
UPDATE "AdminUser" 
SET "failedAttempts" = 0, "lockedUntil" = NULL 
WHERE username = 'Mbita';
```

### Issue: Session expires immediately
**Possible Causes:**
1. SESSION_SECRET not set
2. Cookie settings incompatible with browser
3. HTTPS issues in production

**Solutions:**
1. Set SESSION_SECRET environment variable in Render
2. Check browser allows cookies from site
3. Ensure site is served over HTTPS (Render handles this)

---

## 🔄 Password Management

### Change Password
After first login, change password through:
1. Admin Dashboard → Settings → Security
2. Or manually update in database:
```javascript
const bcrypt = require('bcryptjs');
const newPassword = 'YourNewPassword123!';
const hash = await bcrypt.hash(newPassword, 10);
// Update AdminUser.passwordHash with this hash
```

### Reset Password
If locked out:
1. Access PostgreSQL database directly
2. Run password reset script
3. Or drop and recreate admin user via init-database.mjs

---

## 📊 Database Tables Used

### AdminUser
- `id`: Primary key
- `username`: Login username
- `passwordHash`: Bcrypt hashed password
- `failedAttempts`: Count of failed login attempts
- `lockedUntil`: Timestamp when account unlocks
- `totpEnabled`: Two-factor auth enabled flag
- `totpSecret`: TOTP secret for 2FA

### SecurityLog
- `id`: UUID primary key
- `event`: Event type (e.g., 'login_success', 'login_failed')
- `username`: Username involved
- `ipAddress`: Request IP address
- `details`: Additional context
- `createdAt`: Timestamp

---

## ✅ Current Status

✅ **Database:** Connected and initialized  
✅ **Admin User:** Created (Mbita / Mbita@2026)  
✅ **Profile:** Created with default data  
✅ **Settings:** Initialized  
✅ **SSL:** Configured with `?sslmode=require`  
✅ **Session:** Iron-session configured  
✅ **Middleware:** Protecting admin routes  
✅ **Auto-creation:** Enabled for default credentials  

**Latest Deployment:** https://deogratis-mbita.onrender.com  
**GitHub Repository:** https://github.com/kabulamoshi3-cloud/Mbita-ya-final  

---

## 📝 Recent Updates

**2024 Fixes:**
1. ✅ Fixed default password from `mbita@!12345` to `Mbita@2026`
2. ✅ Added SSL mode to DATABASE_URL
3. ✅ Created initialization script with correct credentials
4. ✅ Implemented auto-creation feature in login route
5. ✅ Added comprehensive error handling
6. ✅ Configured session management with 8-hour timeout

---

**Need Help?** Check the error logs in Render dashboard or browser console for specific error messages.
