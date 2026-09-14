# 🗄️ Database Setup Guide

Complete guide to set up the database automatically for Mbita Emmanuel website.

## 🚀 Quick Start (One Command)

```bash
./scripts/setup-database.sh
```

This will:
- ✅ Generate Prisma Client
- ✅ Create all database tables
- ✅ Seed initial data (admin user, sample publications, etc.)

---

## 📋 Detailed Setup Steps

### Step 1: Create PostgreSQL Database

If you don't have a database yet, run:

```bash
./scripts/create-postgres-db.sh
```

This interactive script will:
- Check if PostgreSQL is installed
- Prompt for database details (name, user, password, host, port)
- Create the database
- Update your `.env` file automatically

**OR** manually add to `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/professor_website"
```

### Step 2: Run Database Setup

```bash
./scripts/setup-database.sh
```

This will:
1. **Generate Prisma Client** - Creates TypeScript types for your database
2. **Create Tables** - Sets up all database tables (Profile, Publications, Research, etc.)
3. **Seed Data** - Adds:
   - Admin user (email: `admin@example.com`, password: `admin123`)
   - Sample publications
   - Sample research projects
   - Sample courses
   - Sample students
   - Sample events
   - Sample blog posts

---

## 🔄 Reset Database (Delete All Data)

**⚠️ WARNING: This deletes ALL data!**

```bash
./scripts/reset-database.sh
```

Use this when you want to start fresh with a clean database.

---

## 📦 What Gets Created

### Tables Created:
- **Profile** - Professor profile information
- **AdminUser** - Admin login credentials
- **Publication** - Research publications
- **ResearchProject** - Research projects
- **Course** - Teaching courses
- **Student** - Student records
- **Event** - Academic events
- **BlogPost** - Blog articles
- **Award** - Awards and honors
- **Collaborator** - Research collaborators
- **Resource** - Teaching resources
- **GalleryItem** - Photo gallery
- **Announcement** - Site announcements
- **Testimonial** - Student testimonials
- **SiteSettings** - Site configuration
- And 30+ more tables...

### Default Admin User:
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **⚠️ Change this after first login!**

---

## 🛠️ Manual Commands

If you prefer to run commands manually:

### Generate Prisma Client
```bash
npx prisma generate
```

### Create/Update Database Tables
```bash
npx prisma db push
```

### Seed Database
```bash
npx prisma db seed
```

### Open Prisma Studio (Database GUI)
```bash
npx prisma studio
```

### View Database Schema
```bash
npx prisma db pull
```

---

## 🔧 Troubleshooting

### Error: "DATABASE_URL not found"
**Solution:** Create a `.env` file with your database connection:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### Error: "Cannot connect to database"
**Solution:** 
1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify database credentials are correct
3. Test connection: `psql -h localhost -U postgres -d professor_website`

### Error: "Prisma Client not generated"
**Solution:** Run `npx prisma generate`

### Error: "Permission denied"
**Solution:** Make scripts executable:
```bash
chmod +x scripts/*.sh
```

### Error: "Port 5432 already in use"
**Solution:** PostgreSQL is already running. Just run the setup script.

### Database is empty after setup
**Solution:** Run the seed command:
```bash
npx prisma db seed
```

---

## 🌐 For Render/Cloud Deployment

When deploying to Render or other cloud platforms:

1. **Render will provide DATABASE_URL automatically**
2. **Add these commands to your deployment:**
   ```bash
   npm run build
   npx prisma db push
   npx prisma db seed
   ```

3. **Or use the provided `render.yaml` file** - it's already configured!

---

## 📊 Database Status Check

Check if your database is set up correctly:

```bash
# Check tables exist
npx prisma db pull

# Open database GUI
npx prisma studio

# Count records
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"AdminUser\""
```

---

## 🔐 Security Notes

1. **Change default admin password** immediately after first login
2. **Never commit `.env` file** to git (it's already in .gitignore)
3. **Use strong passwords** for production databases
4. **Enable SSL** for production database connections
5. **Backup your database** regularly

---

## 📝 Environment Variables Required

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Session (Required)
SESSION_SECRET="your-32-character-random-string-here"

# Email (Optional - for contact form)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
PROFESSOR_EMAIL="professor@university.edu"

# Base URL (Required)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Optional Features
OPENAI_API_KEY=""           # AI Assistant
STRIPE_SECRET_KEY=""        # Payments
ORCID_ID=""                 # ORCID integration
```

---

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `./scripts/create-postgres-db.sh` | Create new PostgreSQL database |
| `./scripts/setup-database.sh` | Set up tables and seed data |
| `./scripts/reset-database.sh` | Reset database (delete all data) |
| `npx prisma studio` | Open database GUI |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Create/update tables |
| `npx prisma db seed` | Add sample data |

---

## ✅ Success Checklist

After setup, verify:

- [ ] Database tables created
- [ ] Admin user exists
- [ ] Can login at `/login`
- [ ] Sample data visible
- [ ] No error messages
- [ ] Prisma Studio opens correctly

---

## 🚀 Next Steps

1. **Run the app:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Login:**
   ```
   http://localhost:3000/login
   Email: admin@example.com
   Password: admin123
   ```

4. **Update profile** in Admin Dashboard

5. **Change admin password** immediately!

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.
