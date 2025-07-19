const { PrismaClient } = require("../lib/generated/prisma");
require("dotenv").config();

const prisma = new PrismaClient();

async function seedWebAgencyServices() {
  try {
    console.log("🌱 Seeding web agency services...");

    // Clear existing data (in order to avoid foreign key constraints)
    console.log("🗑️  Clearing existing data...");
    await prisma.projectAddOn.deleteMany();
    await prisma.projectService.deleteMany();
    await prisma.projectPayment.deleteMany();
    await prisma.projectSubscription.deleteMany();
    await prisma.project.deleteMany();
    await prisma.serviceAddOn.deleteMany();
    await prisma.service.deleteMany();
    await prisma.serviceCategory.deleteMany();

    // Create Service Categories
    console.log("📂 Creating service categories...");
    const websiteCategory = await prisma.serviceCategory.create({
      data: {
        name: "Website Development",
        description: "Professional website development services",
        sortOrder: 1,
      },
    });

    const hostingCategory = await prisma.serviceCategory.create({
      data: {
        name: "Hosting Services",
        description: "Web hosting and maintenance services",
        sortOrder: 2,
      },
    });

    const analyticsCategory = await prisma.serviceCategory.create({
      data: {
        name: "Data Analytics",
        description: "Data analysis and business intelligence services",
        sortOrder: 3,
      },
    });

    // Create Website Development Services
    console.log("🌐 Creating website development services...");
    const smallWebsite = await prisma.service.create({
      data: {
        categoryId: websiteCategory.id,
        name: "Small Website",
        description: "Perfect for small businesses and personal projects",
        basePrice: 150000, // $1,500 in cents
        priceType: "ONE_TIME",
        features: [
          "Up to 5 pages",
          "Responsive design",
          "Basic SEO setup",
          "Contact form",
          "3 rounds of revisions",
          "Mobile optimization",
          "SSL certificate setup",
          "Basic analytics integration",
        ],
        sortOrder: 1,
      },
    });

    const mediumWebsite = await prisma.service.create({
      data: {
        categoryId: websiteCategory.id,
        name: "Medium Website",
        description: "Information + E-commerce functionality",
        basePrice: 280000, // $2,800 in cents
        priceType: "ONE_TIME",
        features: [
          "Up to 15 pages",
          "E-commerce functionality",
          "Payment integration (Stripe, PayPal)",
          "Inventory management",
          "Advanced SEO optimization",
          "5 rounds of revisions",
          "Product catalog",
          "Customer accounts",
          "Order management",
          "Analytics dashboard",
        ],
        sortOrder: 2,
      },
    });

    const enterpriseWebsite = await prisma.service.create({
      data: {
        categoryId: websiteCategory.id,
        name: "Enterprise Website",
        description: "Custom builds with advanced functionality",
        basePrice: 1250000, // $12,500 in cents (middle of $10-15K range)
        priceType: "CUSTOM",
        features: [
          "Unlimited pages",
          "Custom functionality",
          "Advanced integrations",
          "Custom design system",
          "Unlimited revisions",
          "Priority support",
          "Multi-language support",
          "Advanced security",
          "Custom API development",
          "Performance optimization",
          "Database design",
          "Admin dashboard",
        ],
        sortOrder: 3,
      },
    });

    // Create Hosting Services
    console.log("🏠 Creating hosting services...");
    const basicHosting = await prisma.service.create({
      data: {
        categoryId: hostingCategory.id,
        name: "Basic Hosting",
        description: "Perfect for small websites",
        basePrice: 2000, // $20 in cents
        priceType: "RECURRING",
        billingInterval: "month",
        features: [
          "10GB storage",
          "100GB bandwidth",
          "SSL certificate",
          "Daily backups",
          "Email support",
          "99.9% uptime guarantee",
          "Basic security monitoring",
        ],
        sortOrder: 1,
      },
    });

    const professionalHosting = await prisma.service.create({
      data: {
        categoryId: hostingCategory.id,
        name: "Professional Hosting",
        description: "For medium websites with e-commerce",
        basePrice: 4500, // $45 in cents
        priceType: "RECURRING",
        billingInterval: "month",
        features: [
          "50GB storage",
          "500GB bandwidth",
          "SSL certificate",
          "Daily backups",
          "Priority support",
          "99.9% uptime guarantee",
          "Advanced security",
          "CDN integration",
          "Performance optimization",
          "Staging environment",
        ],
        sortOrder: 2,
      },
    });

    const enterpriseHosting = await prisma.service.create({
      data: {
        categoryId: hostingCategory.id,
        name: "Enterprise Hosting",
        description: "High-performance hosting for enterprise",
        basePrice: 15000, // $150 in cents
        priceType: "RECURRING",
        billingInterval: "month",
        features: [
          "Unlimited storage",
          "Unlimited bandwidth",
          "SSL certificate",
          "Hourly backups",
          "24/7 support",
          "99.99% uptime guarantee",
          "Advanced security suite",
          "Global CDN",
          "Load balancing",
          "Dedicated resources",
          "Custom server configuration",
          "Priority phone support",
        ],
        sortOrder: 3,
      },
    });

    // Create Data Analytics Services
    console.log("📊 Creating data analytics services...");
    const biDashboard = await prisma.service.create({
      data: {
        categoryId: analyticsCategory.id,
        name: "Business Intelligence Dashboard",
        description: "Custom BI dashboard with real-time insights",
        basePrice: 500000, // $5,000 in cents
        priceType: "CUSTOM",
        features: [
          "Custom dashboard design",
          "Real-time data integration",
          "Interactive charts and graphs",
          "Automated reporting",
          "Data visualization",
          "KPI tracking",
          "Custom metrics",
          "Export capabilities",
        ],
        sortOrder: 1,
      },
    });

    const analyticsConsulting = await prisma.service.create({
      data: {
        categoryId: analyticsCategory.id,
        name: "Data Analysis Consulting",
        description: "Expert data analysis and insights",
        basePrice: 25000, // $250 in cents
        priceType: "RECURRING",
        billingInterval: "month",
        features: [
          "Monthly analysis reports",
          "Data insights and recommendations",
          "Strategy consultations",
          "Performance tracking",
          "Trend analysis",
          "Competitive analysis",
          "Custom recommendations",
        ],
        sortOrder: 2,
      },
    });

    // Create Service Add-ons
    console.log("🔧 Creating service add-ons...");

    // Data Analytics Package (25% of base price)
    const dataAnalyticsAddOn = await prisma.serviceAddOn.create({
      data: {
        serviceId: smallWebsite.id,
        name: "Data Analytics Package",
        description: "Advanced analytics and reporting for your website",
        priceType: "PERCENTAGE",
        percentage: 25.0,
        features: [
          "Google Analytics 4 setup",
          "Custom conversion tracking",
          "Monthly performance reports",
          "User behavior analysis",
          "Traffic source analysis",
          "Goal tracking setup",
          "Custom dashboard",
        ],
        sortOrder: 1,
      },
    });

    // Create same add-on for medium website
    await prisma.serviceAddOn.create({
      data: {
        serviceId: mediumWebsite.id,
        name: "Data Analytics Package",
        description: "Advanced analytics and reporting for your website",
        priceType: "PERCENTAGE",
        percentage: 25.0,
        features: [
          "Google Analytics 4 setup",
          "E-commerce tracking",
          "Custom conversion tracking",
          "Monthly performance reports",
          "User behavior analysis",
          "Sales funnel analysis",
          "Custom dashboard",
          "ROI tracking",
        ],
        sortOrder: 1,
      },
    });

    // Create same add-on for enterprise website
    await prisma.serviceAddOn.create({
      data: {
        serviceId: enterpriseWebsite.id,
        name: "Data Analytics Package",
        description: "Advanced analytics and reporting for your website",
        priceType: "PERCENTAGE",
        percentage: 25.0,
        features: [
          "Advanced analytics setup",
          "Custom tracking implementation",
          "Real-time dashboard",
          "Automated reporting",
          "Multi-channel attribution",
          "Custom metrics",
          "Data visualization",
          "Advanced segmentation",
        ],
        sortOrder: 1,
      },
    });

    // SEO Premium Add-on
    const seoAddOn = await prisma.serviceAddOn.create({
      data: {
        serviceId: smallWebsite.id,
        name: "SEO Premium Package",
        description: "Advanced SEO optimization and monitoring",
        priceType: "FIXED",
        price: 50000, // $500 in cents
        features: [
          "Comprehensive SEO audit",
          "Keyword research and strategy",
          "On-page optimization",
          "Technical SEO improvements",
          "Local SEO setup",
          "Monthly SEO reports",
          "Competitor analysis",
          "Schema markup",
        ],
        sortOrder: 2,
      },
    });

    // Create SEO add-on for other website types
    await prisma.serviceAddOn.create({
      data: {
        serviceId: mediumWebsite.id,
        name: "SEO Premium Package",
        description: "Advanced SEO optimization and monitoring",
        priceType: "FIXED",
        price: 75000, // $750 in cents
        features: [
          "Comprehensive SEO audit",
          "Keyword research and strategy",
          "On-page optimization",
          "Technical SEO improvements",
          "E-commerce SEO",
          "Product schema markup",
          "Monthly SEO reports",
          "Competitor analysis",
        ],
        sortOrder: 2,
      },
    });

    // Priority Support Add-on
    const prioritySupportAddOn = await prisma.serviceAddOn.create({
      data: {
        serviceId: basicHosting.id,
        name: "Priority Support",
        description: "24/7 priority customer support",
        priceType: "FIXED",
        price: 5000, // $50 in cents
        billingInterval: "month",
        features: [
          "24/7 priority support",
          "Phone support",
          "Live chat priority",
          "Faster response times",
          "Direct access to senior technicians",
          "Proactive monitoring alerts",
        ],
        sortOrder: 1,
      },
    });

    // Create priority support for other hosting tiers
    await prisma.serviceAddOn.create({
      data: {
        serviceId: professionalHosting.id,
        name: "Priority Support Plus",
        description: "Enhanced priority support with dedicated account manager",
        priceType: "FIXED",
        price: 10000, // $100 in cents
        billingInterval: "month",
        features: [
          "Dedicated account manager",
          "24/7 priority support",
          "Phone support",
          "Live chat priority",
          "Faster response times",
          "Proactive monitoring",
          "Monthly check-ins",
        ],
        sortOrder: 1,
      },
    });

    // Maintenance Package
    const maintenanceAddOn = await prisma.serviceAddOn.create({
      data: {
        serviceId: smallWebsite.id,
        name: "Website Maintenance",
        description: "Ongoing website maintenance and updates",
        priceType: "FIXED",
        price: 15000, // $150 in cents
        billingInterval: "month",
        features: [
          "Monthly security updates",
          "Plugin/theme updates",
          "Content updates (2 hours/month)",
          "Performance monitoring",
          "Backup monitoring",
          "Security monitoring",
          "Monthly reports",
        ],
        sortOrder: 3,
      },
    });

    // Create maintenance for other website types
    await prisma.serviceAddOn.create({
      data: {
        serviceId: mediumWebsite.id,
        name: "Website Maintenance Pro",
        description: "Comprehensive website maintenance and updates",
        priceType: "FIXED",
        price: 25000, // $250 in cents
        billingInterval: "month",
        features: [
          "Weekly security updates",
          "Plugin/theme updates",
          "Content updates (4 hours/month)",
          "Performance optimization",
          "Database optimization",
          "Security monitoring",
          "Monthly reports",
          "Priority support",
        ],
        sortOrder: 3,
      },
    });

    console.log("✅ Web agency services seeded successfully!");

    // Display summary
    const categoryCount = await prisma.serviceCategory.count();
    const serviceCount = await prisma.service.count();
    const addOnCount = await prisma.serviceAddOn.count();

    console.log(`\n📊 Summary:`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Services: ${serviceCount}`);
    console.log(`   Add-ons: ${addOnCount}`);

    console.log(
      "\n🎉 Database is ready for the enhanced web agency pricing system!"
    );
  } catch (error) {
    console.error("❌ Error seeding web agency services:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedWebAgencyServices();
