# Portfolio & Business Management System

A comprehensive Next.js portfolio website with integrated business management capabilities for web development agencies.

## 🚀 System Overview

This project combines a modern portfolio website with a full-featured business management system including:

- **Client-facing portfolio** with services showcase and contact forms
- **Service pricing calculator** with real-time quote generation
- **Admin project management** with comprehensive dashboards
- **Client dashboard** for project tracking and payments
- **Stripe payment integration** with subscription management
- **Support ticket system** for client communication
- **User role management** with admin/client permissions

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Clerk** for authentication

### Backend
- **Next.js API Routes** for server-side logic
- **Prisma ORM** with PostgreSQL database
- **Stripe** for payment processing
- **Uploadthing** for file uploads

### Key Features
1. **Service-Based Pricing System**
   - 3 main tiers: Starter ($1,500), Professional ($2,800), Enterprise ($12,500)
   - Monthly hosting subscriptions ($20, $45, $150)
   - 25% analytics add-on package
   - Custom quote generation

2. **Project Management**
   - Complete project lifecycle tracking
   - Quote approval workflow
   - Payment processing (deposits, full payments, subscriptions)
   - Progress monitoring

3. **Admin Dashboard**
   - Business metrics and analytics
   - Project overview with filtering
   - Service management (categories, services, add-ons)
   - User role management

4. **Client Portal**
   - Project status tracking
   - Payment processing
   - Support ticket system
   - Document uploads

## 📊 Current Implementation Status

### ✅ Completed Features
- [x] Database schema with all required models
- [x] Service management system (categories, services, add-ons)
- [x] Pricing calculator with real-time quotes
- [x] Client service selector with 3-step wizard
- [x] Admin project overview dashboard
- [x] Quote workflow management
- [x] Payment processing integration
- [x] User authentication and role management
- [x] Support ticket system
- [x] File upload functionality
- [x] Responsive UI components

### 🔄 Partially Implemented
- [ ] Client communication system (emails partially implemented)
- [ ] Revenue analytics dashboard (basic metrics implemented)
- [ ] Project templates (structure exists, needs content)

### ❌ Known Issues
See [KNOWN_ISSUES.md](./docs/KNOWN_ISSUES.md) for detailed list

## 🗂️ Project Structure

```
portfolio/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── admin/               # Admin-only endpoints
│   │   ├── pricing/             # Pricing calculations
│   │   ├── quotes/              # Quote management
│   │   └── webhooks/            # Stripe/Clerk webhooks
│   ├── dashboard/               # Protected dashboard pages
│   └── (public pages)           # Portfolio pages
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   ├── client/                  # Client-specific components
│   ├── dashboard/               # Dashboard components
│   ├── pricing/                 # Pricing calculator
│   └── ui/                      # Base UI components
├── lib/                         # Utilities and configurations
│   ├── actions/                 # Server actions
│   ├── generated/               # Generated Prisma client
│   └── constants/               # Application constants
├── prisma/                      # Database schema and migrations
└── docs/                        # Documentation
```

## 🔧 Quick Start

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Clerk, Stripe, and database credentials
   ```

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 📚 Documentation

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Known Issues](./docs/KNOWN_ISSUES.md)
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- [Development Setup](./docs/DEVELOPMENT_SETUP.md)

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Prisma](https://www.prisma.io/) - Database ORM
- [Clerk](https://clerk.com/) - Authentication
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## 📝 License

This project is private and proprietary.
