# Student Authentication Guide

## 🎓 Student Portal Access System

The student portal now requires authentication! Students must login or register before accessing protected resources.

---

## 🔐 Authentication Flow

### **Public Access (No Login Required)**
- `/` - Homepage
- `/publications` - Research publications
- `/research` - Research projects
- `/students` - Student profiles
- `/teaching` - Course listings
- `/blog` - Blog posts
- `/events` - Events calendar
- `/gallery` - Photo and video gallery
- `/cv` - CV and awards
- `/contact` - Contact information
- `/student-portal` - Public portal preview (shows login/register buttons)

### **Protected Access (Login Required)**
- `/student-portal` - Full student portal with personalized content
- `/api/student/*` - All student API endpoints (except auth endpoints)

---

## 📝 Student Registration

**URL:** https://deogratis-mbita.onrender.com/student-register

**Required Fields:**
- **Email Address** - Must be unique and valid email format
- **Password** - Minimum 8 characters
- **Confirm Password** - Must match password
- **First Name** - Student's first name
- **Last Name** - Student's last name
- **Student ID** - Unique student identifier (e.g., STU20260001)
- **Enrollment Year** - Year of enrollment (2000-2050)
- **Program** (Optional) - Program of study (e.g., Computer Science)

**Features:**
- ✅ Email validation and uniqueness check
- ✅ Student ID uniqueness check
- ✅ Password strength validation (min 8 characters)
- ✅ Password confirmation matching
- ✅ Auto-login after successful registration
- ✅ Secure password hashing with bcryptjs
- ✅ Show/hide password toggle

**Example Registration:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "studentId": "STU20260001",
  "enrollmentYear": 2026,
  "program": "Computer Science"
}
```

---

## 🔑 Student Login

**URL:** https://deogratis-mbita.onrender.com/student-login

**Required Fields:**
- **Email Address**
- **Password**

**Features:**
- ✅ Email and password validation
- ✅ Secure bcrypt password verification
- ✅ Session-based authentication (7-day cookies)
- ✅ Last login timestamp tracking
- ✅ Active account check
- ✅ Show/hide password toggle

**Example Login:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response:**
```json
{
  "message": "Login successful.",
  "user": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "studentId": "STU20260001"
  }
}
```

---

## 🚪 Student Logout

**Endpoint:** `POST /api/student/auth/logout`

**Action:**
- Destroys session cookie
- Redirects to login page

**Usage:**
```javascript
await fetch('/api/student/auth/logout', { method: 'POST' });
```

---

## 🛡️ Security Features

### **Password Security**
- ✅ Bcrypt hashing with 10 salt rounds
- ✅ Minimum 8 character requirement
- ✅ No plain text password storage
- ✅ Secure password comparison

### **Session Management**
- ✅ Iron-session with encrypted cookies
- ✅ 7-day cookie expiration
- ✅ 8-hour inactivity timeout
- ✅ HTTP-only cookies (not accessible via JavaScript)
- ✅ Secure flag enabled in production (HTTPS only)
- ✅ SameSite=Lax protection

### **Database Security**
- ✅ SSL/TLS connection to PostgreSQL
- ✅ Parameterized queries (SQL injection protection)
- ✅ Email uniqueness constraint
- ✅ Student ID uniqueness constraint
- ✅ Active account flag

### **Middleware Protection**
- ✅ Automatic redirect to login for unauthorized access
- ✅ Session validation on every protected request
- ✅ Session timeout enforcement
- ✅ Role-based access control (student vs admin)

---

## 🗄️ Database Schema

### **StudentUser Table**
```sql
CREATE TABLE "StudentUser" (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          VARCHAR UNIQUE NOT NULL,
  passwordHash   VARCHAR NOT NULL,
  firstName      VARCHAR NOT NULL,
  lastName       VARCHAR NOT NULL,
  studentId      VARCHAR UNIQUE NOT NULL,
  photoUrl       VARCHAR,
  enrollmentYear INTEGER NOT NULL,
  program        VARCHAR,
  active         BOOLEAN DEFAULT true,
  lastLogin      TIMESTAMP,
  createdAt      TIMESTAMP DEFAULT NOW(),
  updatedAt      TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- Primary key on `id`
- Unique index on `email`
- Unique index on `studentId`

---

## 🔄 Session Data Structure

```typescript
interface SessionData {
  username?: string;      // Admin username (if admin)
  studentId?: string;     // Student UUID (if student)
  role?: "admin" | "student";
  isAdmin?: boolean;
  createdAt?: number;     // Session creation timestamp
}
```

**Student Session Example:**
```json
{
  "studentId": "123e4567-e89b-12d3-a456-426614174000",
  "role": "student",
  "createdAt": 1726057200000
}
```

---

## 🧪 Testing Student Authentication

### **1. Register a New Student**

**Browser:**
1. Go to https://deogratis-mbita.onrender.com/student-register
2. Fill in registration form
3. Click "Create Account"
4. Should auto-login and redirect to `/student-portal`

**API (curl):**
```bash
curl -X POST https://deogratis-mbita.onrender.com/api/student/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.student@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "Student",
    "studentId": "STU20260099",
    "enrollmentYear": 2026,
    "program": "Computer Science"
  }' \
  -c student-cookies.txt -v
```

### **2. Login Existing Student**

**Browser:**
1. Go to https://deogratis-mbita.onrender.com/student-login
2. Enter email and password
3. Click "Sign In"
4. Should redirect to `/student-portal`

**API (curl):**
```bash
curl -X POST https://deogratis-mbita.onrender.com/api/student/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.student@example.com",
    "password": "TestPass123!"
  }' \
  -c student-cookies.txt -v
```

### **3. Access Protected Portal**

**Browser:**
- Navigate to https://deogratis-mbita.onrender.com/student-portal
- If not logged in → redirects to `/student-login`
- If logged in → shows full portal with resources

**API (curl):**
```bash
# With session cookie from login
curl https://deogratis-mbita.onrender.com/student-portal \
  -b student-cookies.txt
```

### **4. Logout**

**Browser:**
- Click "Logout" button on student portal
- Should clear session and redirect to `/student-login`

**API (curl):**
```bash
curl -X POST https://deogratis-mbita.onrender.com/api/student/auth/logout \
  -b student-cookies.txt
```

---

## 🐛 Troubleshooting

### **Issue: "Email already registered"**
**Cause:** Email already exists in database

**Solution:**
1. Use different email address
2. Or login with existing account
3. Or reset password (if implemented)

### **Issue: "Student ID already registered"**
**Cause:** Student ID already exists in database

**Solution:**
1. Use different student ID
2. Check with admin for correct student ID
3. Or login with existing account

### **Issue: "Invalid credentials"**
**Possible Causes:**
1. Wrong email address
2. Wrong password (case-sensitive)
3. Account inactive
4. Account doesn't exist

**Solutions:**
1. Check email spelling
2. Check password (Caps Lock, etc.)
3. Register new account if needed
4. Contact admin if account is inactive

### **Issue: Redirects to login immediately after login**
**Possible Causes:**
1. Session cookies not being saved
2. Browser blocking third-party cookies
3. HTTPS mismatch

**Solutions:**
1. Enable cookies in browser settings
2. Check browser console for cookie errors
3. Clear browser cache and cookies
4. Try incognito/private mode

### **Issue: "Database connection error"**
**Cause:** PostgreSQL connection failure

**Solutions:**
1. Check DATABASE_URL in Render environment variables
2. Verify SSL configuration (`?sslmode=require`)
3. Check PostgreSQL service status
4. Check network connectivity

---

## 📊 API Endpoints Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/student/auth/register` | POST | No | Register new student account |
| `/api/student/auth/login` | POST | No | Login existing student |
| `/api/student/auth/logout` | POST | Yes | Logout current student |
| `/api/student/*` | * | Yes | All other student endpoints require auth |

---

## ✅ Current Status

✅ **Student Registration:** Fully working with validation  
✅ **Student Login:** Fully working with session management  
✅ **Student Logout:** Fully working  
✅ **Protected Routes:** Middleware protecting student portal  
✅ **Session Security:** Iron-session with encryption  
✅ **Password Security:** Bcrypt hashing  
✅ **Database:** SSL-configured PostgreSQL connection  
✅ **UI Pages:** Login, Register, Protected Portal  
✅ **Auto-login:** After registration  
✅ **Role Separation:** Student vs Admin sessions  

---

## 📝 Next Steps for Students

After logging in, students can:

1. ✅ **Access Student Portal** - View personalized dashboard
2. 📚 **Browse Courses** - View course materials and schedules
3. 🎥 **Watch Videos** - Access lecture videos and tutorials
4. 🏆 **View Achievements** - Track progress and badges
5. 📅 **Book Office Hours** - Schedule appointments
6. 🤖 **Use AI Assistant** - Get study help
7. 📜 **View Certificates** - Download earned certificates

---

## 🔗 Quick Links

**Live Website:** https://deogratis-mbita.onrender.com

**Student Pages:**
- Register: https://deogratis-mbita.onrender.com/student-register
- Login: https://deogratis-mbita.onrender.com/student-login
- Portal: https://deogratis-mbita.onrender.com/student-portal

**Admin Pages:**
- Admin Login: https://deogratis-mbita.onrender.com/login
- Admin Dashboard: https://deogratis-mbita.onrender.com/admin

**GitHub Repository:** https://github.com/kabulamoshi3-cloud/Mbita-ya-final

---

## 🎉 Implementation Complete!

The student authentication system is now fully functional and deployed. Students can:
- ✅ Register new accounts
- ✅ Login with credentials
- ✅ Access protected student portal
- ✅ Logout securely

All changes have been committed and pushed to GitHub. Render will automatically deploy the updates.

**Deployment Status:** ✅ Live on Render  
**Last Updated:** 2026-09-11
