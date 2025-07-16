# Clerk Authentication Setup Guide

## Overview
This guide explains how to complete the Clerk authentication setup for your portfolio project with PostgreSQL database integration.

## Prerequisites
- Clerk account and application created
- PostgreSQL database with Prisma setup completed
- Environment variables configured

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database (already configured)
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
```

## Clerk Dashboard Configuration

### 1. Basic Setup
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Copy the API keys to your `.env.local` file

### 2. Configure Sign-In/Sign-Up URLs
In your Clerk dashboard:
- **Sign-in URL**: `http://localhost:3000/sign-in`
- **Sign-up URL**: `http://localhost:3000/sign-up`
- **After sign-in URL**: `http://localhost:3000/dashboard`
- **After sign-up URL**: `http://localhost:3000/dashboard`

### 3. Configure Webhooks
1. Go to **Webhooks** in your Clerk dashboard
2. Click **Add Endpoint**
3. **Endpoint URL**: `http://localhost:3000/api/webhooks/clerk`
4. **Events to subscribe to**:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the **Signing Secret** and add it to your `.env.local` as `CLERK_WEBHOOK_SECRET`

### 4. User Metadata Configuration
To enable role-based access:
1. Go to **User Management** > **Metadata**
2. Enable **Public metadata** for roles
3. You can set user roles programmatically or through the dashboard

## Authentication Features Implemented

### 1. Pages Created
- `/sign-in` - User sign-in page
- `/sign-up` - User registration page
- Custom styled to match your app theme

### 2. Components Created
- `AuthButton` - Shows sign-in/sign-up buttons or user profile
- Integrates with your existing navbar
- Shows user role badges

### 3. Middleware Protection
Routes protected by authentication:
- `/dashboard/*` - User dashboard
- `/admin/*` - Admin-only routes  
- `/tickets/*` - Ticket management
- `/profile/*` - User profile
- `/api/tickets/*` - Ticket API endpoints
- `/api/users/*` - User API endpoints

### 4. Database Integration
- **Webhook handler**: Syncs Clerk users with your database
- **User helpers**: Functions for user management
- **Role-based access**: Admin, Client, Support, Moderator roles

## Authentication Utilities

### Server-Side Functions
```typescript
import { getCurrentUser, requireAuth, isAdmin, requireSupport } from '@/lib/auth'

// Get current user with database info
const user = await getCurrentUser()

// Require authentication
await requireAuth()

// Check roles
const canManage = await isAdmin()
const canSupport = await requireSupport()
```

### Client-Side Components
```typescript
import { useUser, useAuth } from '@clerk/nextjs'

function MyComponent() {
  const { user } = useUser()
  const { isSignedIn } = useAuth()
  
  if (!isSignedIn) return <div>Please sign in</div>
  
  return <div>Welcome, {user.firstName}!</div>
}
```

## User Role Management

### Setting User Roles
1. **Through Clerk Dashboard**:
   - Go to Users > Select user > Public metadata
   - Add: `{"role": "ADMIN"}`

2. **Programmatically**:
   ```typescript
   import { clerkClient } from '@clerk/nextjs/server'
   
   await clerkClient.users.updateUserMetadata(userId, {
     publicMetadata: { role: 'ADMIN' }
   })
   ```

### Role Permissions
- **CLIENT**: Can create and view own tickets
- **SUPPORT**: Can view all tickets, assign tickets, view reports
- **MODERATOR**: Can view all tickets, assign tickets
- **ADMIN**: Full access to all features

## Testing Your Setup

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Authentication Flow
1. Visit `http://localhost:3000`
2. Click "Sign Up" to create an account
3. Complete the sign-up process
4. Check your database - user should be created automatically
5. Try signing out and signing back in

### 3. Test Role-Based Access
1. Set a user's role to ADMIN in Clerk dashboard
2. Try accessing admin routes
3. Verify permissions work correctly

## Webhook Testing

### Using ngrok for Local Development
```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Update webhook URL in Clerk dashboard to ngrok URL
# Example: https://abc123.ngrok.io/api/webhooks/clerk
```

### Manual Testing
1. Create a user in Clerk dashboard
2. Check your database for the new user
3. Update user in Clerk dashboard
4. Verify changes sync to database

## Common Issues & Solutions

### 1. Webhook Not Working
- Check `CLERK_WEBHOOK_SECRET` is correct
- Verify webhook endpoint URL
- Check server logs for errors
- Ensure svix package is installed

### 2. Database User Not Created
- Check webhook is configured correctly
- Verify database connection
- Check webhook handler logs

### 3. Role-Based Access Issues
- Verify user has correct role in public metadata
- Check middleware configuration
- Ensure auth utilities are working

### 4. Styling Issues
- Clerk components use custom appearance configuration
- Check Tailwind classes are correct
- Verify theme provider is working

## Security Best Practices

1. **Environment Variables**: Never commit secrets to version control
2. **Webhook Security**: Always verify webhook signatures
3. **Role Validation**: Always check user roles server-side
4. **Database Security**: Use parameterized queries (Prisma handles this)
5. **HTTPS**: Use HTTPS in production

## Deployment Considerations

### Environment Variables
Update your production environment with:
- Production Clerk keys
- Production database URL
- Production webhook URL

### Clerk Dashboard
Update URLs in Clerk dashboard for production:
- Sign-in URL: `https://yourdomain.com/sign-in`
- Sign-up URL: `https://yourdomain.com/sign-up`
- Webhook URL: `https://yourdomain.com/api/webhooks/clerk`

## Next Steps
1. Create a dashboard page for authenticated users
2. Build ticket management UI
3. Set up ArcJet for additional security
4. Add email notifications
5. Implement analytics and reporting

## Troubleshooting Commands
```bash
# Check database connection
npx prisma studio

# View database tables
npx prisma db pull

# Reset database if needed
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

## Resources
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs) 