const { PrismaClient } = require("../lib/generated/prisma");
require("dotenv").config({ path: ".env" });

const prisma = new PrismaClient();

async function seedPricingPlans() {
  try {
    console.log("Seeding pricing plans...");

    // Clear existing pricing plans
    await prisma.pricingPlan.deleteMany();

    // Create pricing plans
    const pricingPlans = [
      {
        name: "Basic Plan",
        description: "Perfect for small projects",
        price: 9900, // $99.00 in cents
        stripePriceId: "price_1RlLLj4hgKBUixPSQNdpYyDI", // One-time price
        stripeSubscriptionPriceId: "price_1RlLLi4hgKBUixPSFHW3wOWw", // Subscription price
        features: [
          "Basic website development",
          "Email support",
          "Up to 3 revisions",
          "Basic analytics setup",
          "1 month support",
          "Mobile responsive design",
        ],
        isPopular: false,
        isActive: true,
      },
      {
        name: "Premium Plan",
        description: "Best for growing businesses",
        price: 29900, // $299.00 in cents
        stripePriceId: "price_1RlLLj4hgKBUixPSMYmVosAT", // One-time price
        stripeSubscriptionPriceId: "price_1RlLLj4hgKBUixPSRRdYS88x", // Subscription price
        features: [
          "Advanced website development",
          "Priority support",
          "Unlimited revisions",
          "Advanced analytics",
          "SEO optimization",
          "Mobile optimization",
          "3 months support",
          "Custom integrations",
        ],
        isPopular: true,
        isActive: true,
      },
      {
        name: "Enterprise Plan",
        description: "For large scale projects",
        price: 59900, // $599.00 in cents
        stripePriceId: "price_1RlLLk4hgKBUixPSGaaEk0qx", // One-time price
        stripeSubscriptionPriceId: "price_1RlLLk4hgKBUixPSwfdPDbV1", // Subscription price
        features: [
          "Custom development",
          "24/7 dedicated support",
          "Unlimited revisions",
          "Advanced analytics",
          "Full SEO package",
          "Performance optimization",
          "Custom integrations",
          "Ongoing maintenance",
          "6 months support",
          "Priority feature requests",
        ],
        isPopular: false,
        isActive: true,
      },
    ];

    // Create pricing plans
    for (const plan of pricingPlans) {
      const createdPlan = await prisma.pricingPlan.create({
        data: plan,
      });
      console.log(`✓ Created pricing plan: ${createdPlan.name}`);
    }

    console.log("🎉 Pricing plans seeded successfully!");
  } catch (error) {
    console.error("Error seeding pricing plans:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedPricingPlans();
