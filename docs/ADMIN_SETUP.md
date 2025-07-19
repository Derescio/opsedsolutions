# Admin System Setup Guide

## 🎯 **Admin System Status: FULLY FUNCTIONAL** ✅

### **Recent Enhancements** (July 18, 2025)
- ✅ **Quote Notes Feature**: Admins can now add personalized notes when sending quotes
- ✅ **Custom Quote Expiration**: Set custom valid-until dates (not just 30 days)
- ✅ **Enhanced Project Management**: Complete project oversight with payment tracking
- ✅ **Service Management**: Full CRUD operations for services, categories, and add-ons
- ✅ **Business Metrics**: Comprehensive dashboard with revenue and project analytics

### **Admin Capabilities**: Complete business management platform operational

## Overview
The admin system allows administrators to manage user roles and permissions through a secure, admin-only interface.

## Default User Roles

When users sign up, they automatically receive the **CLIENT** role as defined in your database schema:

```prisma
role UserRole @default(CLIENT)
```

## User Role Hierarchy

### **CLIENT** (Default)
- Can create and view their own tickets
- Basic user permissions
- Default role for new registrations

### **SUPPORT**
- Can view all tickets
- Can assign tickets to users
- Can view reports and analytics
- Can manage customer inquiries

### **MODERATOR**
- Can view all tickets
- Can assign tickets to users
- Moderate content and user interactions
- Limited admin capabilities

### **ADMIN**
- Full system access
- Can manage all users and roles
- Can access admin dashboard
- Can modify system settings

## Setting Up Your First Admin

### Method 1: Using Debug API (Temporary)
1. Sign up for an account
2. Visit: `http://localhost:3000/api/debug/sync-user` (POST request)
3. Set your role to ADMIN: `http://localhost:3000/api/debug/set-role`
   ```json
   {
     "role": "ADMIN"
   }
   ```

### Method 2: Through Clerk Dashboard
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Users**
3. Select your user account
4. Click **Public metadata** tab
5. Add this JSON:
   ```json
   {
     "role": "ADMIN"
   }
   ```
6. Click **Save**

### Method 3: Direct Database Update
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Using the Admin Dashboard

### Accessing Admin Dashboard
1. Sign in with an admin account
2. You'll see an "Admin" button in the navbar (red button)
3. Click "Admin" to access the admin dashboard
4. URL: `http://localhost:3000/admin`

### Admin Dashboard Features

#### **User Statistics**
- Total registered users
- Count of users by role
- System overview

#### **User Role Management**
- View all users in the system
- See user details (name, email, join date)
- Change user roles with dropdown selection
- Real-time role updates

#### **Role Assignment**
- Select new role from dropdown
- Click to instantly update user role
- Visual feedback with loading states
- Success/error notifications

## Security Features

### **Route Protection**
- Admin routes are protected by middleware
- Only users with ADMIN role can access `/admin/*`
- Automatic redirect to dashboard with error message if unauthorized

### **API Security**
- All admin API endpoints require admin authentication
- Server-side role verification
- Input validation and sanitization

### **Authorization Flow**
1. User accesses admin route
2. Middleware checks authentication
3. `requireAdmin()` function verifies ADMIN role
4. If not admin, redirects to `/dashboard?error=unauthorized`
5. If admin, allows access to admin features

## Managing User Roles

### Changing User Roles
1. Go to Admin Dashboard (`/admin`)
2. Find the user in the list
3. Use the role dropdown next to their name
4. Select new role (CLIENT, SUPPORT, MODERATOR, ADMIN)
5. Role is updated instantly

### Role Change Notifications
- Success message appears when role is updated
- Error messages for failed attempts
- Visual loading indicators during updates

### Best Practices
- **Limit Admin Users**: Only assign ADMIN role to trusted users
- **Use Support Role**: For customer service staff
- **Monitor Role Changes**: Check logs for role modifications
- **Regular Audits**: Review user roles periodically

## API Endpoints

### Admin-Only Endpoints
- `POST /api/admin/set-user-role` - Update user roles
- `GET /admin` - Admin dashboard page

### Required Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer clerk-session-token"
}
```

### Example API Call
```javascript
fetch('/api/admin/set-user-role', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    clerkId: 'user_clerk_id',
    role: 'SUPPORT'
  })
})
```

## Troubleshooting

### Cannot Access Admin Dashboard
- **Check Role**: Ensure your user has ADMIN role
- **Clear Cache**: Refresh page or clear browser cache
- **Check Logs**: Look for authorization errors in console

### Role Updates Not Working
- **Verify Admin Access**: Ensure you're logged in as admin
- **Check Network**: Look for API errors in browser dev tools
- **Database Connection**: Verify database is accessible

### User Not Showing in Admin List
- **Database Sync**: User might not be synced to database
- **Check User Status**: Verify user is active
- **Refresh Page**: Try reloading the admin dashboard

## Environment Variables

Ensure these are set in your `.env.local`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

## Testing Admin Features

### Test User Role Changes
1. Create a test user account
2. Access admin dashboard
3. Change test user's role
4. Verify role change in database
5. Test access permissions for different roles

### Test Access Control
1. Try accessing `/admin` without admin role
2. Verify redirect to dashboard with error
3. Test API endpoints with non-admin user
4. Confirm proper error responses

## Production Considerations

### Security
- Use HTTPS in production
- Implement rate limiting for admin endpoints
- Monitor admin actions
- Regular security audits

### Performance
- Implement pagination for large user lists
- Cache user data appropriately
- Optimize database queries

### Monitoring
- Log all admin actions
- Set up alerts for role changes
- Monitor admin dashboard usage

## Next Steps

1. **Set up your first admin user**
2. **Test the admin dashboard**
3. **Assign appropriate roles to team members**
4. **Set up production security measures**
5. **Install ArcJet for additional security**

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma Database](https://www.prisma.io/docs)
- [Role-Based Access Control](https://auth0.com/intro-to-iam/what-is-role-based-access-control-rbac) 