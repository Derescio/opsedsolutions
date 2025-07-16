# ArcJet Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Setup](#basic-setup)
4. [Core Features](#core-features)
5. [Implementation Scenarios](#implementation-scenarios)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Usage](#advanced-usage)

---

## Overview

ArcJet is a developer-first security platform that provides application-level protection with just a few lines of code. Unlike traditional security solutions that require separate infrastructure, ArcJet runs directly within your application.

### Key Benefits
- **Zero Infrastructure**: No Redis, databases, or external services required
- **Developer-Friendly**: Simple API that works locally and in CI
- **Low Latency**: Typically <30ms overhead
- **Fail-Open Design**: Won't block legitimate requests if service is down
- **Real-time Protection**: Instant decision making with local caching

### Core Features
- **Rate Limiting**: Multiple algorithms (token bucket, fixed window, sliding window)
- **Bot Protection**: Intelligent bot detection and management
- **Shield WAF**: Protection against OWASP Top 10 attacks
- **Email Validation**: Disposable email detection and validation
- **Sensitive Information Detection**: PII and sensitive data redaction

---

## Installation

### Requirements
- **Next.js**: 14 or 15 (ESM only, no CommonJS support)
- **Node.js**: 18 or higher

### Next.js
```bash
npm install @arcjet/next
# or
yarn add @arcjet/next
# or
pnpm add @arcjet/next
```

### Other Frameworks
```bash
# Node.js
npm install @arcjet/node

# Bun
npm install @arcjet/bun

# Remix
npm install @arcjet/remix

# SvelteKit
npm install @arcjet/sveltekit

# NestJS
npm install @arcjet/nest
```

---

## Basic Setup

### 1. Get Your API Key
1. Sign up at [https://app.arcjet.com](https://app.arcjet.com)
2. Create a new site
3. Copy your API key

### 2. Environment Configuration
Create a `.env.local` file:
```env
ARCJET_KEY=ajkey_your_key_here
```

### 3. Single Instance Pattern (Recommended)
Create a utility file for reuse across your application:

```typescript
// lib/arcjet.ts
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"]
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10
    })
  ]
});
```

### 4. Basic Implementation

#### Next.js App Router - API Routes
```typescript
// app/api/protected/route.ts
import { aj } from "@/lib/arcjet";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const decision = await aj.protect(req);
  
  if (decision.isDenied()) {
    return NextResponse.json({ 
      error: "Request blocked",
      reason: decision.reason
    }, { status: 403 });
  }
  
  return NextResponse.json({ message: "Success" });
}
```

#### Next.js Pages Router
```typescript
// pages/api/protected.ts
import { aj } from "@/lib/arcjet";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const decision = await aj.protect(req);
  
  if (decision.isDenied()) {
    return res.status(403).json({ 
      error: "Request blocked",
      reason: decision.reason
    });
  }
  
  res.status(200).json({ message: "Success" });
}
```

#### Server Components (Pages)
```typescript
// app/page.tsx
"use server";

import arcjet, { detectBot, request } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});

export default async function Page() {
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  return <h1>Hello, protected page!</h1>;
}
```

#### Server Actions
```typescript
// app/actions.ts
"use server";

import arcjet, { shield, request } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [shield({ mode: "LIVE" })],
});

export async function submitForm(formData: FormData) {
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // Process form data
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  
  // Your form processing logic here
  return { success: true };
}
```

---

## Core Features

### 1. Rate Limiting

#### Token Bucket Algorithm
Best for: Allowing bursts of traffic while maintaining average rate
```typescript
import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,      // 5 tokens per interval
      interval: 10,       // 10 seconds
      capacity: 10,       // Max 10 tokens
      characteristics: ["userId"] // Track per user
    })
  ]
});
```

#### Fixed Window Algorithm
Best for: Simple rate limiting with predictable reset times
```typescript
import arcjet, { fixedWindow } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    fixedWindow({
      mode: "LIVE",
      window: "1h",       // 1 hour window
      max: 100,          // Max 100 requests per hour
      characteristics: ["ip.src"] // Track per IP
    })
  ]
});
```

#### Sliding Window Algorithm
Best for: Smooth rate limiting without burst allowance
```typescript
import arcjet, { slidingWindow } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    slidingWindow({
      mode: "LIVE",
      window: "15m",      // 15 minute window
      max: 50,           // Max 50 requests
      characteristics: ["ip.src"]
    })
  ]
});
```

### 2. Bot Protection

#### Basic Bot Detection
```typescript
import arcjet, { detectBot } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",  // Google, Bing, etc.
        "CATEGORY:MONITOR",        // Uptime monitors
        "CATEGORY:PREVIEW",        // Link previews
        "CATEGORY:SOCIAL"          // Social media crawlers
      ]
    })
  ]
});
```

#### Middleware Bot Protection
```typescript
// middleware.ts
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
      ],
    }),
  ],
});

export default createMiddleware(aj);
```

### 3. Shield WAF Protection

#### Basic Shield Setup
```typescript
import arcjet, { shield } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({
      mode: "LIVE"  // Blocks malicious requests
    })
  ]
});
```

#### Environment-Based Configuration
```typescript
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN"
    })
  ]
});
```

### 4. Email Validation

```typescript
import arcjet, { validateEmail } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    validateEmail({
      mode: "LIVE",
      block: [
        "DISPOSABLE",     // Block disposable emails
        "INVALID",        // Block invalid emails
        "NO_MX_RECORDS"   // Block emails with no MX records
      ]
    })
  ]
});

export async function POST(req: Request) {
  const { email } = await req.json();
  
  const decision = await aj.protect(req, { email });
  
  if (decision.isDenied()) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  
  return NextResponse.json({ message: "Email valid" });
}
```

---

## Implementation Scenarios

### Scenario 1: API Rate Limiting

#### Use Case
Protect your API endpoints from abuse while allowing legitimate traffic.

```typescript
// app/api/data/route.ts
import arcjet, { tokenBucket } from "@arcjet/next";
import { NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,     // 10 requests per minute
      interval: 60,       // 1 minute
      capacity: 20,       // Burst up to 20 requests
      characteristics: ["userId"] // Track per authenticated user
    })
  ]
});

export async function GET(req: Request) {
  // Extract user ID from auth token
  const userId = await extractUserId(req);
  
  const decision = await aj.protect(req, { userId });
  
  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }
  
  // Your API logic here
  const data = await fetchData();
  return NextResponse.json(data);
}
```

### Scenario 2: Form Protection

#### Use Case
Protect contact forms and signup forms from spam and abuse.

```typescript
// app/api/contact/route.ts
import arcjet, { shield, detectBot, validateEmail } from "@arcjet/next";
import { NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [] // Block all bots
    }),
    validateEmail({
      mode: "LIVE",
      block: ["DISPOSABLE", "INVALID"]
    })
  ]
});

export async function POST(req: Request) {
  const { name, email, message } = await req.json();
  
  const decision = await aj.protect(req, { email });
  
  if (decision.isDenied()) {
    // Handle specific denial reasons
    for (const result of decision.results) {
      if (result.reason.isBot()) {
        return NextResponse.json({ 
          error: "Automated requests not allowed" 
        }, { status: 403 });
      }
      
      if (result.reason.isEmail()) {
        return NextResponse.json({ 
          error: "Please use a valid email address" 
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: "Request blocked" }, { status: 403 });
  }
  
  // Process the form
  await sendEmail({ name, email, message });
  return NextResponse.json({ message: "Form submitted successfully" });
}
```

### Scenario 3: User Registration Protection

#### Use Case
Prevent fraudulent account creation and spam registrations.

```typescript
// app/api/register/route.ts
import arcjet, { shield, detectBot, validateEmail, fixedWindow } from "@arcjet/next";
import { NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: [] }),
    validateEmail({
      mode: "LIVE",
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"]
    }),
    fixedWindow({
      mode: "LIVE",
      window: "1h",
      max: 5,           // Max 5 signups per hour per IP
      characteristics: ["ip.src"]
    })
  ]
});

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  
  const decision = await aj.protect(req, { email });
  
  if (decision.isDenied()) {
    for (const result of decision.results) {
      if (result.reason.isEmail()) {
        return NextResponse.json({ 
          error: "Please use a valid email address" 
        }, { status: 400 });
      }
      
      if (result.reason.isRateLimit()) {
        return NextResponse.json({ 
          error: "Too many registration attempts" 
        }, { status: 429 });
      }
    }
    
    return NextResponse.json({ error: "Registration blocked" }, { status: 403 });
  }
  
  // Create user account
  const user = await createUser({ email, password, name });
  return NextResponse.json({ 
    message: "Account created successfully", 
    userId: user.id 
  });
}
```

### Scenario 4: Middleware Protection

#### Use Case
Protect your entire application with middleware.

```typescript
// middleware.ts
import arcjet, { createMiddleware, shield, detectBot } from "@arcjet/next";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR"]
    })
  ]
});

export default createMiddleware(aj);
```

### Scenario 5: AI/LLM Endpoint Protection

#### Use Case
Protect expensive AI endpoints from abuse.

```typescript
// app/api/ai/generate/route.ts
import arcjet, { tokenBucket, shield } from "@arcjet/next";
import { NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 1,      // 1 request per minute
      interval: 60,       // 1 minute
      capacity: 3,        // Allow burst of 3 requests
      characteristics: ["userId"]
    })
  ]
});

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const userId = await extractUserId(req);
  
  const decision = await aj.protect(req, { userId });
  
  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "AI request limit exceeded. Please wait before trying again." },
      { status: 429 }
    );
  }
  
  // Expensive AI operation
  const result = await generateAIResponse(prompt);
  return NextResponse.json({ result });
}
```

### Scenario 6: File Upload Protection

#### Use Case
Protect file upload endpoints from abuse.

```typescript
// app/api/upload/route.ts
import arcjet, { shield, detectBot, fixedWindow } from "@arcjet/next";
import { NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: [] }),
    fixedWindow({
      mode: "LIVE",
      window: "1h",
      max: 10,            // Max 10 uploads per hour
      characteristics: ["userId"]
    })
  ]
});

export async function POST(req: Request) {
  const userId = await extractUserId(req);
  
  const decision = await aj.protect(req, { userId });
  
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ 
        error: "Upload limit exceeded" 
      }, { status: 429 });
    }
    
    return NextResponse.json({ error: "Upload blocked" }, { status: 403 });
  }
  
  // Process file upload
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  
  const uploadResult = await uploadFile(file);
  return NextResponse.json({ url: uploadResult.url });
}
```

---

## Best Practices

### 1. Rule Configuration

#### Use Appropriate Modes
```typescript
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({
      mode: process.env.NODE_ENV === 'production' ? "LIVE" : "DRY_RUN"
    })
  ]
});
```

#### Combine Multiple Rules Effectively
```typescript
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),                    // Always include Shield
    detectBot({ mode: "LIVE", allow: [...] }),   // Bot protection
    tokenBucket({ mode: "LIVE", ... }),          // Rate limiting
    validateEmail({ mode: "LIVE", ... })         // Email validation
  ]
});
```

### 2. Error Handling

#### Comprehensive Error Handling
```typescript
export async function POST(req: Request) {
  try {
    const decision = await aj.protect(req);
    
    // Check for errors
    if (decision.isErrored()) {
      console.error("Arcjet error:", decision.reason);
      // Fail open - continue processing
    }
    
    if (decision.isDenied()) {
      return handleDeniedRequest(decision);
    }
    
    // Continue with your logic
    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
```

#### Specific Error Responses
```typescript
function handleDeniedRequest(decision: ArcjetDecision) {
  // Check individual rule results
  for (const result of decision.results) {
    if (result.reason.isRateLimit()) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: 60 },
        { status: 429 }
      );
    }
    
    if (result.reason.isBot()) {
      return NextResponse.json(
        { error: "Automated requests not allowed" },
        { status: 403 }
      );
    }
    
    if (result.reason.isEmail()) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }
  }
  
  return NextResponse.json(
    { error: "Request blocked" },
    { status: 403 }
  );
}
```

### 3. Performance Optimization

#### Use Characteristics Wisely
```typescript
// Good - Track by user ID for authenticated routes
tokenBucket({
  mode: "LIVE",
  refillRate: 10,
  interval: 60,
  capacity: 20,
  characteristics: ["userId"]
});

// Good - Track by IP for public routes
tokenBucket({
  mode: "LIVE",
  refillRate: 5,
  interval: 60,
  capacity: 10,
  characteristics: ["ip.src"]
});

// Good - Track by combination for more granular control
tokenBucket({
  mode: "LIVE",
  refillRate: 20,
  interval: 60,
  capacity: 40,
  characteristics: ["userId", "ip.src"]
});
```

#### Single Instance Pattern
```typescript
// Good - Create once, reuse
// lib/arcjet.ts
export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [...]
});

// Use across your app
import { aj } from "@/lib/arcjet";

// Bad - Don't create per request
export async function POST(req: Request) {
  const aj = arcjet({ ... }); // Don't do this!
}
```

### 4. Testing and Development

#### Use DRY_RUN Mode for Testing
```typescript
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({
      mode: process.env.NODE_ENV === 'test' ? "DRY_RUN" : "LIVE"
    })
  ]
});
```

#### Test Your Rules
```typescript
// Test with different scenarios
describe("API Protection", () => {
  it("should allow legitimate requests", async () => {
    const response = await request(app)
      .post("/api/protected")
      .send({ data: "legitimate" });
    
    expect(response.status).toBe(200);
  });
  
  it("should block rapid requests", async () => {
    // Make multiple rapid requests
    const requests = Array(10).fill(null).map(() =>
      request(app).post("/api/protected").send({ data: "test" })
    );
    
    const responses = await Promise.all(requests);
    expect(responses.some(r => r.status === 429)).toBe(true);
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. Rate Limit Not Working
```typescript
// Check your characteristics
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 1,
      interval: 60,
      capacity: 1,
      characteristics: ["userId"] // Make sure this is being set
    })
  ]
});

// Make sure you're passing the characteristic
const decision = await aj.protect(req, { userId: "actual-user-id" });
```

#### 2. ARCJET_KEY Not Found
```typescript
// Check environment variables
if (!process.env.ARCJET_KEY) {
  throw new Error("ARCJET_KEY environment variable is required");
}

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [...]
});
```

#### 3. CommonJS vs ESM Issues
```typescript
// Make sure you're using ESM
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@arcjet/next"],
  },
};

module.exports = nextConfig;
```

#### 4. Debugging Decisions
```typescript
export async function POST(req: Request) {
  const decision = await aj.protect(req);
  
  // Log decision details
  console.log("Decision ID:", decision.id);
  console.log("Conclusion:", decision.conclusion);
  console.log("Reason:", decision.reason);
  
  // Log individual rule results
  for (const result of decision.results) {
    console.log("Rule result:", result.reason);
    console.log("Rule conclusion:", result.conclusion);
  }
  
  if (decision.isDenied()) {
    return NextResponse.json({ error: "Blocked" }, { status: 403 });
  }
  
  return NextResponse.json({ message: "Success" });
}
```

### Performance Issues

#### 1. High Latency
- Check your network connection to Arcjet API
- Verify you're using the correct region
- Consider using more aggressive local caching

#### 2. Memory Usage
- Monitor rule creation (don't create new instances per request)
- Use appropriate characteristics to avoid memory leaks
- Consider using different rule sets for different endpoints

---

## Advanced Usage

### Custom Characteristics

```typescript
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 20,
      characteristics: ["userId", "planType"] // Custom combination
    })
  ]
});

export async function POST(req: Request) {
  const userId = await extractUserId(req);
  const planType = await getUserPlan(userId);
  
  const decision = await aj.protect(req, { userId, planType });
  
  if (decision.isDenied()) {
    return NextResponse.json({ 
      error: "Rate limit exceeded" 
    }, { status: 429 });
  }
  
  return NextResponse.json({ message: "Success" });
}
```

### Multiple Rule Sets

```typescript
// Different protection for different endpoints
const publicApiRules = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
    fixedWindow({ mode: "LIVE", window: "1h", max: 100 })
  ]
});

const privateApiRules = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    tokenBucket({ mode: "LIVE", refillRate: 20, interval: 60, capacity: 40 })
  ]
});

// Use different rules for different endpoints
export async function GET(req: Request) {
  const decision = await publicApiRules.protect(req);
  // Handle public API request
}

export async function POST(req: Request) {
  const decision = await privateApiRules.protect(req);
  // Handle private API request
}
```

### Dynamic Rule Configuration

```typescript
function createArcjetRules(userTier: string) {
  const baseRules = [shield({ mode: "LIVE" })];
  
  switch (userTier) {
    case 'premium':
      baseRules.push(tokenBucket({
        mode: "LIVE",
        refillRate: 100,
        interval: 60,
        capacity: 200
      }));
      break;
    case 'standard':
      baseRules.push(tokenBucket({
        mode: "LIVE",
        refillRate: 50,
        interval: 60,
        capacity: 100
      }));
      break;
    default:
      baseRules.push(tokenBucket({
        mode: "LIVE",
        refillRate: 10,
        interval: 60,
        capacity: 20
      }));
  }
  
  return arcjet({
    key: process.env.ARCJET_KEY!,
    rules: baseRules
  });
}
```

### Custom Logging

```typescript
// For detailed logging, you can use Pino
import pino from "pino";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [shield({ mode: "LIVE" })],
  log: logger,
});

// Remember to add Pino as external package in next.config.js
// next.config.js
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
};
```

---

## Conclusion

ArcJet provides a comprehensive security solution that's easy to implement and maintain. By following this guide, you can protect your applications from common threats while maintaining good performance and user experience.

### Key Takeaways
- Start with basic Shield protection and add features as needed
- Use appropriate rate limiting algorithms for your use case
- Implement proper error handling and fail-open strategies
- Test your rules thoroughly in development
- Monitor and adjust rules based on real-world usage
- Use the single instance pattern for optimal performance

### Next Steps
1. Implement basic protection on your most critical endpoints
2. Add rate limiting based on your usage patterns
3. Set up monitoring and alerting in the ArcJet dashboard
4. Gradually expand protection to other parts of your application
5. Consider Pro plan features for advanced bot detection and analytics

### Resources
- [Official ArcJet Documentation](https://docs.arcjet.com)
- [ArcJet Dashboard](https://app.arcjet.com)
- [Example Next.js App](https://github.com/arcjet/example-nextjs)
- [Community Discord](https://discord.gg/arcjet)

For more help, email support@arcjet.com or join the Discord community. 