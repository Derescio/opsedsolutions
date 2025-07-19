# Database Setup Guide

## 📊 **Database Status: FULLY OPERATIONAL** ✅

### **Recent Schema Updates** (July 18, 2025)
- ✅ Added `quoteNotes` field to Projects table for admin quote customization
- ✅ All payment workflows tested and working correctly  
- ✅ Project relationships (services, add-ons, payments) fully functional
- ✅ Metadata JSON fields properly utilized for customer information
- ✅ Prisma migrations and generation working smoothly

### **Schema Health**: All models and relationships working correctly

## Overview
This project uses PostgreSQL with Prisma ORM for database management. The database is designed to support a ticket management system with user authentication via Clerk.

## Prerequisites
- PostgreSQL database (local or hosted)
- Node.js 18+ installed
- Clerk account for authentication

## Database Schema
The database includes the following tables:

### Users
- Stores user information integrated with Clerk authentication
- Includes roles (ADMIN, CLIENT, SUPPORT, MODERATOR)
- Tracks user status and metadata

### Tickets
- Main ticket entity with status, priority, and category tracking
- Links to users (creator and assignee)
- Supports ticket lifecycle management

### Ticket Updates
- Comments, status changes, and internal notes
- Audit trail for all ticket modifications
- Supports different update types

### Roles & Sessions
- Role-based access control
- Session management (optional - Clerk handles most auth)

## Setup Steps

### 1. Environment Configuration
Make sure your `.env.local` file contains:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
```

### 2. Database Migration
Run the following command to create your database tables:
```bash
npx prisma migrate dev --name init
```

This will:
- Create migration files in `prisma/migrations/`
- Apply the schema to your database
- Generate the Prisma client

### 3. Database Seeding (Optional)
You can create a seed file to populate initial data:
```bash
# Create seed file
touch prisma/seed.ts

# Add seed script to package.json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}

# Run seeding
npx prisma db seed
```

### 4. Viewing Database
To open Prisma Studio (database GUI):
```bash
npx prisma studio
```

## Database Utilities

### Basic Usage
```typescript
import { db, userHelpers, ticketHelpers } from '@/lib/db'

// Create a user (from Clerk webhook)
const user = await userHelpers.upsertUser('clerk_user_id', {
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe'
})

// Create a ticket
const ticket = await ticketHelpers.createTicket({
  title: 'Need help with login',
  description: 'Cannot access my account',
  category: 'TECHNICAL',
  priority: 'HIGH',
  createdById: user.id
})
```

### Helper Functions Available

#### User Helpers
- `upsertUser()` - Create or update user from Clerk
- `getUserByClerkId()` - Get user by Clerk ID
- `updateUserRole()` - Update user role

#### Ticket Helpers
- `createTicket()` - Create new ticket
- `getTickets()` - Get tickets with pagination/filtering
- `updateTicketStatus()` - Update ticket status
- `assignTicket()` - Assign ticket to user
- `addComment()` - Add comment to ticket

## Common Operations

### Working with Tickets
```typescript
// Get all open tickets
const openTickets = await ticketHelpers.getTickets({
  status: 'OPEN',
  page: 1,
  limit: 10
})

// Update ticket status
await ticketHelpers.updateTicketStatus(
  'ticket_id', 
  'IN_PROGRESS', 
  'user_id'
)

// Add comment
await ticketHelpers.addComment(
  'ticket_id',
  'user_id',
  'This is a comment'
)
```

### Database Connection
```typescript
import { dbUtils } from '@/lib/db'

// Test connection
const isConnected = await dbUtils.testConnection()

// Health check
const health = await dbUtils.healthCheck()
```

## Migration Commands

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Apply Migrations
```bash
npx prisma migrate deploy
```

### Reset Database
```bash
npx prisma migrate reset
```

### Generate Client
```bash
npx prisma generate
```

## Troubleshooting

### Common Issues

1. **Connection Issues**
   - Check DATABASE_URL in `.env.local`
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Migration Errors**
   - Check for schema syntax errors
   - Ensure database is accessible
   - Check for conflicting data

3. **Type Errors**
   - Run `npx prisma generate` after schema changes
   - Restart TypeScript server in VS Code

### Useful Commands
```bash
# View database status
npx prisma migrate status

# View database schema
npx prisma db pull

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

## Next Steps
1. Run the migration to create your database tables
2. Set up Clerk authentication
3. Create API endpoints for ticket management
4. Install and configure ArcJet for security

## Resources
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Clerk Documentation](https://clerk.com/docs) 