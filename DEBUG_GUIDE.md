# Database User Creation & Role Management Debug Guide

## Issue: Users Not Appearing in Database

This guide will help you troubleshoot why users aren't being created in your database and how to set user roles properly.

## Step 1: Test Database Connection

First, let's verify your database connection is working:

### Check Database Health
1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/debug/db-health`
3. You should see a response like:
   ```json
   {
     "success": true,
     "connected": true,
     "health": {
       "status": "healthy",
       "timestamp": "2024-01-15T10:30:00.000Z"
     }
   }
   ```

### If Database Health Check Fails
- Check your `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Run: `npx prisma migrate dev` to ensure tables are created
- Run: `npx prisma studio` to view your database

## Step 2: Manual User Sync

If the webhook isn't working, you can manually sync users:

### Sync Current User
1. Sign in to your application
2. Make a POST request to: `http://localhost:3000/api/debug/sync-user`
3. Or use this curl command:
   ```bash
   curl -X POST http://localhost:3000/api/debug/sync-user \
     -H "Content-Type: application/json" \
     -H "Cookie: your-session-cookie"
   ```

### Expected Response
```json
{
  "success": true,
  "message": "User synced successfully",
  "user": {
    "id": "user_123",
    "clerkId": "user_clerk_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Step 3: Set User Roles

### Method 1: Using Debug API (Recommended for Testing)
1. Sign in to your application
2. Make a POST request to: `http://localhost:3000/api/debug/set-role`
3. Send this JSON body:
   ```json
   {
     "role": "ADMIN"
   }
   ```

### Method 2: Through Clerk Dashboard
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Users**
3. Select a user
4. Click **Public metadata** tab
5. Add this JSON:
   ```json
   {
     "role": "ADMIN"
   }
   ```
6. Click **Save**

### Method 3: Programmatically
```typescript
import { clerkClient } from '@clerk/nextjs/server'

// Set user role
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: { role: 'ADMIN' }
})
```

## Step 4: Configure Clerk Webhook

The webhook syncs users automatically when they sign up or update their profile.

### 1. Get Webhook URL
For local development, you need to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose port 3000
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

### 2. Configure Webhook in Clerk Dashboard
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **Webhooks**
4. Click **Add Endpoint**
5. **Endpoint URL**: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
6. **Events**: Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
7. Click **Create**
8. Copy the **Signing Secret**

### 3. Add Webhook Secret to Environment
Add to your `.env.local`:
```env
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Test Webhook
1. Create a new user through your sign-up page
2. Check your server logs for webhook messages
3. Check your database for the new user

## Step 5: Troubleshooting Common Issues

### Issue: Webhook Not Receiving Events
**Solution:**
- Verify webhook URL is correct
- Check ngrok is running
- Ensure events are selected in Clerk dashboard
- Check server logs for webhook messages

### Issue: Webhook Signature Verification Failed
**Solution:**
- Verify `CLERK_WEBHOOK_SECRET` is correct
- Check the secret matches the one in Clerk dashboard
- Ensure no extra spaces in the secret

### Issue: Database Connection Errors
**Solution:**
- Check `DATABASE_URL` in `.env.local`
- Run `npx prisma migrate dev`
- Verify PostgreSQL is running
- Check database credentials

### Issue: Users Created but Roles Not Set
**Solution:**
- Set roles through Clerk dashboard public metadata
- Use the debug API to set roles
- Ensure webhook is processing user updates

## Testing Commands

### Check Database Tables
```bash
# Open Prisma Studio
npx prisma studio

# Check migration status
npx prisma migrate status

# View database schema
npx prisma db pull
```

### Test Webhook Locally
```bash
# Install webhook testing tool
npm install -g webhook-test

# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -H "svix-id: test" \
  -H "svix-timestamp: 1234567890" \
  -H "svix-signature: test" \
  -d '{"type":"user.created","data":{"id":"test"}}'
```

### Check Server Logs
Look for these log messages:
- `🔄 Clerk webhook received`
- `✅ Webhook signature verified`
- `✅ User synced successfully`
- `❌ Error messages` (if any)

## Quick Fix Steps

1. **Immediate Fix**: Use the manual sync API
   ```bash
   curl -X POST http://localhost:3000/api/debug/sync-user
   ```

2. **Set Admin Role**:
   ```bash
   curl -X POST http://localhost:3000/api/debug/set-role \
     -H "Content-Type: application/json" \
     -d '{"role":"ADMIN"}'
   ```

3. **Check Database**:
   ```bash
   npx prisma studio
   ```

## Available User Roles

- **CLIENT**: Default role, can create and view own tickets
- **SUPPORT**: Can view all tickets, assign tickets, view reports
- **MODERATOR**: Can view all tickets, assign tickets
- **ADMIN**: Full access to all features

## Environment Variables Checklist

Ensure these are set in your `.env.local`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

## Next Steps

Once users are being created and roles are set:
1. Test the authentication flow
2. Verify role-based access works
3. Set up production webhook URL
4. Configure user roles for your team
5. Test ticket creation and management

## Support

If you're still having issues:
1. Check server logs for detailed error messages
2. Use the debug endpoints to test each component
3. Verify all environment variables are set correctly
4. Test database connection separately from authentication 