# Supabase Quick Setup Guide

This is the fastest way to get your School Management System running with an online PostgreSQL database.

## Step 1: Create Supabase Account (2 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new organization (if prompted)

## Step 2: Create New Project (1 minute)

1. Click "New Project"
2. Choose your organization
3. Enter project name: `school-management-system`
4. Enter database password (save this!)
5. Choose region closest to you
6. Click "Create new project"

## Step 3: Get Database Credentials (1 minute)

1. Wait for project to be ready (green status)
2. Go to **Settings** → **Database**
3. Copy these details:
   - **Host**: `db.your-project-ref.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: (the one you set in step 2)

## Step 4: Configure Your Backend (2 minutes)

1. Open `backend/config.env`
2. Comment out the local database settings
3. Uncomment and update the Supabase settings:

```env
# Comment out local settings
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=school_management
# DB_USER=postgres
# DB_PASSWORD=password

# Supabase Configuration
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_SSL=true

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

## Step 5: Initialize Database (1 minute)

```bash
cd backend
npm run init-db
```

You should see:
```
🚀 Initializing School Management System Database...
📡 Testing database connection...
✅ Database connection successful!
📋 Executing database schema...
✅ Statement 1/15 executed successfully
...
🎉 Database initialization completed successfully!
```

## Step 6: Test Your Setup (2 minutes)

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Test the API:
   ```bash
   curl http://localhost:5000/api/health
   ```

4. Open your browser:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Step 7: Verify Everything Works

1. **Dashboard**: Should show real statistics
2. **Students**: Should show 3 sample students
3. **Teachers**: Should show 3 sample teachers
4. **Subjects**: Should show 3 sample subjects
5. **Courses**: Should show 3 sample courses
6. **Assignments**: Should show 3 sample assignments

## Troubleshooting

### Connection Error?
- Double-check your database password
- Ensure `DB_SSL=true` is set
- Verify the host URL is correct

### "Database does not exist" Error?
- Supabase uses `postgres` as the default database name
- Don't change the database name

### "Permission denied" Error?
- Use `postgres` as the username
- Check if your IP is blocked (unlikely for new projects)

### Schema already exists?
- That's fine! The script will skip existing tables
- Your data is safe

## Next Steps

1. **Add Authentication**: Supabase has built-in auth
2. **Real-time Features**: Enable real-time subscriptions
3. **File Storage**: Use Supabase Storage for file uploads
4. **Backup**: Set up automated backups

## Cost

- **Free Tier**: 500MB database, 2 projects
- **Pro Plan**: $25/month for more storage and features

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**Total Setup Time: ~7 minutes** ⚡

Your School Management System is now running with a production-ready online PostgreSQL database!
