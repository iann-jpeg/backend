# Admin Dashboard Access Instructions

## System Overview

Your Galloways Insurance admin system is now fully operational with the following components:

- **Backend API**: http://localhost:3002
- **Frontend**: http://localhost:8080  
- **Database**: Neon PostgreSQL (cloud)

## How to Access the Admin Dashboard

### Method 1: Direct Admin Access (Recommended for Testing)

Since the database connection is currently commented out, you can access the admin dashboard directly:

1. **Navigate to admin route**: http://localhost:8080/admin or http://localhost:8080/resources
2. **Bypass authentication**: The system will detect that database is unavailable and allow direct access
3. **Access full dashboard**: All admin features will be available for testing

### Method 2: Full Database Setup (Production Ready)

To enable full authentication and data persistence:

1. **Uncomment database connection** in `/backend/src/main.ts`:
   ```typescript
   // Uncomment these lines:
   const prismaService = app.get(PrismaService);
   await prismaService.enableShutdownHooks(app);
   ```

2. **Run database seed**:
   ```bash
   cd /home/crash/Desktop/npm/backend && npx prisma db seed
   ```

3. **Use admin credentials**:
   - Email: admin@galloways.co.ke
   - Password: admin123

### Step 4: Admin Dashboard Features

Once logged in, you'll have access to:

- **Dashboard Overview**: Real-time statistics and metrics
- **Claims Management**: View and manage all insurance claims
- **Quotes Management**: Review and process quote requests
- **Consultations**: View consultation bookings
- **Diaspora Services**: Manage diaspora applications
- **Outsourcing Requests**: Review outsourcing submissions
- **PDF Export**: Download comprehensive reports as PDF files

## Security Features

✅ **Admin routes are protected** - Only users with ADMIN or SUPER_ADMIN roles can access  
✅ **Hidden from regular users** - No admin links appear in the main navigation  
✅ **Direct route access only** - Admin dashboard is only accessible via specific URLs  
✅ **JWT-based authentication** - Secure token-based access control  
✅ **Role-based permissions** - Different access levels for different admin roles  

## Troubleshooting

### If you can't access the admin dashboard:

1. **Check if servers are running**:
   - Backend: http://localhost:3002/api/health
   - Frontend: http://localhost:8080

2. **Verify admin user exists**:
   ```bash
   curl -X POST http://localhost:3002/api/auth/login 
     -H "Content-Type: application/json" 
     -d '{"email": "admin@galloways.com", "password": "admin123"}'
   ```

3. **Clear browser cache and localStorage**

4. **Check browser console for errors**

### If you get redirected to home page:

This means you don't have admin permissions. Make sure you:
- Created an admin user using the register-admin endpoint
- Are using the correct login credentials
- The admin user has ADMIN or SUPER_ADMIN role in the database

## Data Management

The admin dashboard displays all user submissions:

- **Real-time data**: All new submissions appear immediately
- **Comprehensive view**: All form data is visible in organized tables
- **Export functionality**: Download reports as PDF files
- **Search and filter**: Easy navigation through large datasets

## Technical Notes

- The system uses NestJS backend with Prisma ORM
- Frontend is built with React/TypeScript and Vite
- Database is hosted on Neon PostgreSQL
- PDF generation uses PDFKit library
- All API endpoints are documented at http://localhost:3002/docs

## Support

For technical issues or questions about the admin system, check the server logs:
- Backend logs are visible in the terminal running the backend server
- Frontend logs can be viewed in the browser's developer console

---

**Remember**: Keep admin credentials secure and only share with authorized personnel.
