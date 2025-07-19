# API Documentation

## Overview

This document provides comprehensive API documentation for the Portfolio 2025 service-based business management system. All APIs are built with Next.js App Router and include proper authentication, validation, and error handling.

## Base URL

```
Development: http://localhost:3000
Production: https://yourdomain.com
```

## Authentication

All API endpoints use Clerk authentication with JWT tokens. Include the session token in requests:

```javascript
// Client-side requests automatically include authentication
fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
```

## Authorization Levels

- **Public** - No authentication required
- **Authenticated** - Requires valid user session
- **Admin** - Requires user with ADMIN role
- **Client** - Requires user with CLIENT role (access to own data only)

---

## Service Management APIs

### Service Categories

#### Get All Categories
```http
GET /api/admin/service-categories
```

**Authorization**: Admin  
**Description**: Retrieve all service categories

**Response**:
```json
{
  "success": true,
  "categories": [
    {
      "id": "cat_123",
      "name": "Website Development",
      "description": "Complete website development services",
      "icon": "globe",
      "isActive": true,
      "sortOrder": 1,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "_count": {
        "services": 3
      }
    }
  ]
}
```

#### Create Category
```http
POST /api/admin/service-categories
```

**Authorization**: Admin  
**Description**: Create a new service category

**Request Body**:
```json
{
  "name": "Data Analytics",
  "description": "Data analysis and reporting services",
  "icon": "chart-bar",
  "sortOrder": 2
}
```

**Response**:
```json
{
  "success": true,
  "category": {
    "id": "cat_456",
    "name": "Data Analytics",
    "description": "Data analysis and reporting services",
    "icon": "chart-bar",
    "isActive": true,
    "sortOrder": 2,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Update Category
```http
PUT /api/admin/service-categories/[id]
```

**Authorization**: Admin  
**Description**: Update an existing service category

**Request Body**:
```json
{
  "name": "Updated Category Name",
  "description": "Updated description",
  "isActive": false
}
```

#### Delete Category
```http
DELETE /api/admin/service-categories/[id]
```

**Authorization**: Admin  
**Description**: Delete a service category (only if no services exist)

**Response**:
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

### Services

#### Get All Services
```http
GET /api/admin/services
```

**Authorization**: Admin  
**Description**: Retrieve all services with categories and add-ons

**Query Parameters**:
- `categoryId` (optional) - Filter by category
- `isActive` (optional) - Filter by active status

**Response**:
```json
{
  "success": true,
  "services": [
    {
      "id": "svc_123",
      "categoryId": "cat_123",
      "name": "Small Website",
      "description": "Basic informational website",
      "basePrice": 150000,
      "priceType": "ONE_TIME",
      "billingInterval": null,
      "features": [
        "Up to 5 pages",
        "Responsive design",
        "Basic SEO setup"
      ],
      "isActive": true,
      "isPopular": false,
      "sortOrder": 1,
      "stripeProductId": "prod_stripe123",
      "stripePriceId": "price_stripe123",
      "category": {
        "id": "cat_123",
        "name": "Website Development"
      },
      "addOns": [],
      "_count": {
        "projectServices": 5
      }
    }
  ]
}
```

#### Create Service
```http
POST /api/admin/services
```

**Authorization**: Admin  
**Description**: Create a new service with optional Stripe integration

**Request Body**:
```json
{
  "categoryId": "cat_123",
  "name": "Medium Website",
  "description": "Information + E-commerce website",
  "basePrice": 280000,
  "priceType": "ONE_TIME",
  "billingInterval": null,
  "features": [
    "Up to 15 pages",
    "E-commerce functionality",
    "Advanced SEO"
  ],
  "isPopular": true,
  "createStripeProduct": true
}
```

#### Update Service
```http
PUT /api/admin/services/[id]
```

**Authorization**: Admin  
**Description**: Update an existing service

#### Delete Service
```http
DELETE /api/admin/services/[id]
```

**Authorization**: Admin  
**Description**: Delete a service (only if not used in projects)

### Service Add-ons

#### Get All Add-ons
```http
GET /api/admin/service-addons
```

**Authorization**: Admin  
**Description**: Retrieve all service add-ons

**Response**:
```json
{
  "success": true,
  "addOns": [
    {
      "id": "addon_123",
      "serviceId": null,
      "categoryId": "cat_123",
      "name": "Data Analytics Package",
      "description": "Advanced analytics and reporting",
      "priceType": "PERCENTAGE",
      "price": null,
      "percentage": 25.0,
      "billingInterval": null,
      "features": [
        "Custom dashboard",
        "Monthly reports",
        "Performance tracking"
      ],
      "isActive": true,
      "service": null,
      "category": {
        "id": "cat_123",
        "name": "Website Development"
      }
    }
  ]
}
```

#### Create Add-on
```http
POST /api/admin/service-addons
```

**Authorization**: Admin  
**Description**: Create a new service add-on

**Request Body**:
```json
{
  "categoryId": "cat_123",
  "name": "SEO Premium",
  "description": "Advanced SEO optimization",
  "priceType": "FIXED",
  "price": 50000,
  "billingInterval": null,
  "features": [
    "Keyword research",
    "On-page optimization",
    "Technical SEO audit"
  ]
}
```

---

## Project Management APIs

### Projects

#### Get All Projects (Admin)
```http
GET /api/admin/projects
```

**Authorization**: Admin  
**Description**: Retrieve all projects with filtering and pagination

**Query Parameters**:
- `status` (optional) - Filter by project status
- `search` (optional) - Search by project name or client
- `page` (optional) - Page number for pagination
- `limit` (optional) - Items per page

**Response**:
```json
{
  "success": true,
  "projects": [
    {
      "id": "proj_123",
      "userId": "user_123",
      "name": "Company Website Redesign",
      "description": "Complete redesign of corporate website",
      "status": "IN_PROGRESS",
      "totalAmount": 280000,
      "paidAmount": 140000,
      "contactEmail": "client@company.com",
      "contactName": "John Doe",
      "companyName": "ABC Company",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "user": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "client@company.com"
      },
      "services": [
        {
          "id": "ps_123",
          "service": {
            "name": "Medium Website",
            "basePrice": 280000
          }
        }
      ],
      "addOns": [],
      "_count": {
        "payments": 1,
        "subscriptions": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### Create Project
```http
POST /api/admin/projects
```

**Authorization**: Admin  
**Description**: Create a new project

**Request Body**:
```json
{
  "userId": "user_123",
  "name": "New Website Project",
  "description": "Building a new e-commerce website",
  "contactEmail": "client@example.com",
  "contactName": "Jane Smith",
  "companyName": "XYZ Corp",
  "services": ["svc_123", "svc_456"],
  "addOns": ["addon_123"]
}
```

#### Send Quote
```http
POST /api/admin/projects/[id]/send-quote
```

**Authorization**: Admin  
**Description**: Send a quote to the client

**Request Body**:
```json
{
  "quoteNotes": "Custom pricing for enterprise client",
  "validUntil": "2025-02-01T00:00:00.000Z"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Quote sent successfully",
  "project": {
    "id": "proj_123",
    "status": "QUOTE_SENT",
    "quoteValidUntil": "2025-02-01T00:00:00.000Z"
  }
}
```

#### Update Project Status
```http
PUT /api/admin/projects/[id]/status
```

**Authorization**: Admin  
**Description**: Update project status

**Request Body**:
```json
{
  "status": "IN_PROGRESS",
  "notes": "Development started"
}
```

### Business Metrics

#### Get Admin Metrics
```http
GET /api/admin/metrics
```

**Authorization**: Admin  
**Description**: Retrieve business analytics and metrics

**Response**:
```json
{
  "success": true,
  "metrics": {
    "revenue": {
      "total": 1250000,
      "thisMonth": 180000,
      "lastMonth": 150000,
      "growth": 20.0
    },
    "projects": {
      "total": 45,
      "active": 12,
      "completed": 30,
      "pending": 3
    },
    "conversion": {
      "quoteToProject": 75.5,
      "avgProjectValue": 350000
    },
    "recentActivity": [
      {
        "type": "project_created",
        "message": "New project created: Company Website",
        "timestamp": "2025-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

---

## Client APIs

### Services (Public)

#### Get Available Services
```http
GET /api/services
```

**Authorization**: Public  
**Description**: Retrieve all active services for client selection

**Response**:
```json
{
  "success": true,
  "categories": [
    {
      "id": "cat_123",
      "name": "Website Development",
      "description": "Complete website development services",
      "services": [
        {
          "id": "svc_123",
          "name": "Small Website",
          "description": "Basic informational website",
          "basePrice": 150000,
          "priceType": "ONE_TIME",
          "features": ["Up to 5 pages", "Responsive design"],
          "isPopular": false
        }
      ],
      "addOns": [
        {
          "id": "addon_123",
          "name": "Data Analytics Package",
          "priceType": "PERCENTAGE",
          "percentage": 25.0
        }
      ]
    }
  ]
}
```

### Pricing Calculator

#### Calculate Quote
```http
POST /api/pricing
```

**Authorization**: Public  
**Description**: Calculate pricing for selected services and add-ons

**Request Body**:
```json
{
  "services": [
    {
      "serviceId": "svc_123",
      "addOns": ["addon_123"]
    }
  ],
  "customizations": {
    "svc_123": {
      "customPrice": 200000
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "quote": {
    "services": [
      {
        "service": {
          "id": "svc_123",
          "name": "Small Website",
          "basePrice": 150000
        },
        "finalPrice": 200000,
        "addOns": [
          {
            "addOn": {
              "id": "addon_123",
              "name": "Data Analytics Package"
            },
            "calculatedPrice": 50000
          }
        ]
      }
    ],
    "totals": {
      "oneTime": 250000,
      "recurring": 2000,
      "total": 250000
    }
  }
}
```

### Quote Submission

#### Submit Quote Request
```http
POST /api/quotes
```

**Authorization**: Public  
**Description**: Submit a quote request from the client interface

**Request Body**:
```json
{
  "services": ["svc_123"],
  "addOns": ["addon_123"],
  "contactInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "ABC Corp"
  },
  "requirements": "Need a website for our new product launch",
  "budget": "5000-10000",
  "timeline": "2-3 months"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Quote request submitted successfully",
  "quoteId": "quote_123",
  "project": {
    "id": "proj_123",
    "status": "QUOTE_REQUESTED"
  }
}
```

### Client Projects

#### Get Client Projects
```http
GET /api/client/projects
```

**Authorization**: Client  
**Description**: Retrieve projects for the authenticated client

**Response**:
```json
{
  "success": true,
  "projects": [
    {
      "id": "proj_123",
      "name": "Company Website Redesign",
      "status": "IN_PROGRESS",
      "totalAmount": 280000,
      "paidAmount": 140000,
      "progress": 50,
      "services": [
        {
          "service": {
            "name": "Medium Website"
          }
        }
      ],
      "nextMilestone": "Design approval",
      "lastUpdate": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

### Add-on Services

#### Get Available Add-ons for Services
```http
GET /api/services/add-ons?serviceIds=svc_123,svc_456
```

**Authorization**: Authenticated  
**Description**: Retrieve available add-ons compatible with specified services

**Query Parameters**:
- `serviceIds` (required) - Comma-separated list of service IDs

**Response**:
```json
{
  "success": true,
  "addOns": [
    {
      "id": "addon_123",
      "name": "Data Analytics Package",
      "description": "Advanced analytics and reporting",
      "priceType": "PERCENTAGE",
      "percentage": 25.0
    },
    {
      "id": "addon_456", 
      "name": "SEO Premium Package",
      "description": "Comprehensive SEO optimization",
      "priceType": "FIXED",
      "price": 75000
    }
  ]
}
```

#### Add Service to Existing Project
```http
POST /api/projects/[id]/add-ons
```

**Authorization**: Client (owner) or Admin  
**Description**: Add an add-on service to an existing project

**Path Parameters**:
- `id` - Project ID

**Request Body**:
```json
{
  "addOnId": "addon_123"
}
```

**Response**:
```json
{
  "success": true,
  "projectAddOn": {
    "id": "pa_123",
    "projectId": "proj_123", 
    "addOnId": "addon_123",
    "customPrice": 70000,
    "createdAt": "2025-01-01T12:00:00.000Z"
  },
  "newTotal": 350000,
  "addOnPrice": 70000,
  "addOnName": "Data Analytics Package",
  "message": "Add-on added successfully"
}
```

**Error Responses**:
- `400` - Add-on ID required or not compatible with project services
- `404` - Project or add-on not found
- `409` - Add-on already exists in project
- `403` - Unauthorized (not project owner)

---

## Payment APIs

### Project Payments

#### Process Project Payment
```http
POST /api/payments/projects/[id]
```

**Authorization**: Client  
**Description**: Process a payment for a project (deposit or full payment)

**Request Body**:
```json
{
  "type": "deposit", // or "full"
  "amount": 140000,
  "returnUrl": "https://yourdomain.com/dashboard"
}
```

**Response**:
```json
{
  "success": true,
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_...",
  "sessionId": "cs_123"
}
```

### Subscription Management

#### Create Hosting Subscription
```http
POST /api/subscriptions/hosting
```

**Authorization**: Client  
**Description**: Create a hosting subscription for a completed project

**Request Body**:
```json
{
  "projectId": "proj_123",
  "hostingPlanId": "svc_hosting_123"
}
```

**Response**:
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123",
    "status": "INCOMPLETE"
  },
  "clientSecret": "pi_123_secret_456"
}
```

---

## Webhook APIs

### Stripe Webhooks

#### Stripe Event Handler
```http
POST /api/webhooks/stripe
```

**Authorization**: Webhook signature verification  
**Description**: Handle Stripe webhook events

**Headers**:
```
stripe-signature: t=1234567890,v1=signature_hash
```

**Supported Events**:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Clerk Webhooks

#### User Sync Handler
```http
POST /api/webhooks/clerk
```

**Authorization**: Webhook signature verification  
**Description**: Sync user data from Clerk

**Supported Events**:
- `user.created`
- `user.updated`  
- `user.deleted`

---

## Error Handling

All APIs return consistent error responses:

### Success Response Format
```json
{
  "success": true,
  "data": {}, // Response data
  "message": "Operation completed successfully"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes

- `AUTHENTICATION_REQUIRED` (401) - User not authenticated
- `AUTHORIZATION_FAILED` (403) - Insufficient permissions
- `VALIDATION_ERROR` (400) - Invalid request data
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `INTERNAL_ERROR` (500) - Server error
- `RATE_LIMITED` (429) - Too many requests

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Admin endpoints**: 100 requests per minute
- **Client endpoints**: 60 requests per minute
- **Public endpoints**: 30 requests per minute
- **Webhook endpoints**: No limit (verified by signature)

Rate limit headers included in responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

---

## Development Testing

### Test Data

Use these test IDs for development:

```javascript
// Test Service IDs
const TEST_SERVICES = {
  smallWebsite: 'svc_small_website_test',
  mediumWebsite: 'svc_medium_website_test',
  basicHosting: 'svc_basic_hosting_test'
}

// Test Category IDs
const TEST_CATEGORIES = {
  websiteDevelopment: 'cat_website_dev_test',
  hosting: 'cat_hosting_test'
}

// Test User IDs
const TEST_USERS = {
  admin: 'user_admin_test',
  client: 'user_client_test'
}
```

### Example Client Usage

```javascript
// Client-side service selection
const selectServices = async (serviceIds, addOnIds) => {
  const response = await fetch('/api/pricing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      services: serviceIds.map(id => ({ serviceId: id, addOns: addOnIds }))
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to calculate pricing')
  }
  
  return response.json()
}

// Admin project management
const updateProjectStatus = async (projectId, status) => {
  const response = await fetch(`/api/admin/projects/${projectId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  
  return response.json()
}
```

---

## 🎉 **Latest Updates & Fixes** (July 19, 2025)

### **New Endpoints Added** 🆕

#### Get Compatible Add-ons
```http
POST /api/services/add-ons
```

**Authorization**: Authenticated  
**Description**: Fetch add-ons compatible with specific service IDs

**Request Body**:
```json
{
  "serviceIds": ["svc_123", "svc_456"]
}
```

**Response**:
```json
{
  "success": true,
  "addOns": [
    {
      "id": "addon_789",
      "name": "SEO Optimization",
      "description": "Advanced SEO package",
      "pricingType": "FIXED",
      "fixedPrice": 500,
      "compatibleServices": ["svc_123"]
    }
  ]
}
```

#### Add Add-ons to Project
```http
POST /api/projects/[id]/add-ons
```

**Authorization**: Client (own projects) / Admin  
**Description**: Add add-ons to existing project with payment processing

**Request Body**:
```json
{
  "addOnId": "addon_789"
}
```

**Response**:
```json
{
  "success": true,
  "project": {
    "id": "proj_123",
    "totalAmount": 1500,
    "addOns": [
      {
        "id": "addon_789",
        "name": "SEO Optimization",
        "price": 500
      }
    ]
  },
  "paymentUrl": "https://checkout.stripe.com/pay/cs_1234..."
}
```

### **Enhanced Endpoints** 🔄

#### Send Quote (Enhanced)
```http
POST /api/admin/projects/[id]/send-quote
```

**Authorization**: Admin  
**Description**: Send quote with custom notes and expiration date

**Request Body**:
```json
{
  "quoteNotes": "Custom project requirements...",
  "validUntil": "2025-08-15T23:59:59.000Z"
}
```

### **All Issues Resolved** ✅
- ✅ **Duplicate Add-on Issue**: Resolved auto-inclusion of service add-ons in packages
- ✅ **Payment Status Display**: Fixed payment status not updating in real-time  
- ✅ **Database Relationship Issues**: Resolved circular reference and query optimization
- ✅ **Add-on Payment Bug**: Fixed $4,295 overcharge issue - now charges correct add-on amounts
- ✅ **Admin Quote Notes**: Added missing quote notes functionality with proper escaping
- ✅ **Hosting Plan Selection**: Complete subscription workflow with Stripe Checkout
- ✅ **Build Errors**: Fixed unescaped quotes causing production build failures
- ✅ **Navigation Security**: Hidden pricing tab for non-authenticated users

### **Testing Status** ✅
- ✅ **Client Add-on Selection**: Fully tested and operational
- ✅ **Payment Processing**: All payment types functional (deposits, full, add-ons, subscriptions)
- ✅ **Admin Quote Management**: Quote notes, expiration dates, and approval working
- ✅ **Hosting Plan Selection**: Complete subscription workflow operational
- ✅ **End-to-End Workflows**: All 5 major business workflows validated

### **Production Status** 🚀
- **Status**: 100% Complete - Ready for Production Launch
- **Build**: Successful with no blocking errors
- **Testing**: All workflows pass end-to-end validation

---

## Summary

The API provides comprehensive coverage for:

- ✅ **Service Management** - Complete CRUD operations for services, categories, and add-ons
- ✅ **Project Lifecycle** - From quote request to completion and payment
- ✅ **Payment Processing** - Stripe integration for various payment types
- ✅ **Admin Operations** - Business metrics, project management, and analytics
- ✅ **Client Interface** - Service selection, project tracking, and payments
- ✅ **Webhook Integration** - Real-time updates from Stripe and Clerk
- ✅ **Add-on Management** - Dynamic add-on selection and payment processing
- ✅ **Hosting Subscriptions** - Complete subscription lifecycle management

All endpoints include proper authentication, validation, error handling, and rate limiting for production use.

---

*Last Updated: July 19, 2025*  
*API Version: 2.1 - All Systems Operational* 
*Status: Production Ready 🚀* 