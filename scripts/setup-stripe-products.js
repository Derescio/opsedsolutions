const Stripe = require("stripe");
require("dotenv").config({ path: ".env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  try {
    console.log("Setting up Stripe products and prices...");

    // Create products and prices
    const products = [
      {
        name: "Basic Plan",
        description: "Perfect for small projects",
        price: 9900, // $99.00 in cents
        features: [
          "Basic website development",
          "Email support",
          "Up to 3 revisions",
          "Basic analytics setup",
        ],
      },
      {
        name: "Premium Plan",
        description: "Best for growing businesses",
        price: 29900, // $299.00 in cents
        features: [
          "Advanced website development",
          "Priority support",
          "Unlimited revisions",
          "Advanced analytics",
          "SEO optimization",
          "Mobile optimization",
        ],
      },
      {
        name: "Enterprise Plan",
        description: "For large scale projects",
        price: 59900, // $599.00 in cents
        features: [
          "Custom development",
          "24/7 dedicated support",
          "Unlimited revisions",
          "Advanced analytics",
          "Full SEO package",
          "Performance optimization",
          "Custom integrations",
          "Ongoing maintenance",
        ],
      },
    ];

    const createdProducts = [];

    for (const productData of products) {
      console.log(`Creating product: ${productData.name}`);

      // Create product
      const product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        metadata: {
          features: JSON.stringify(productData.features),
        },
      });

      console.log(`✓ Product created: ${product.id}`);

      // Create subscription price
      const subscriptionPrice = await stripe.prices.create({
        currency: "usd",
        product: product.id,
        unit_amount: productData.price,
        recurring: {
          interval: "month",
        },
        metadata: {
          type: "subscription",
        },
      });

      console.log(
        `✓ Monthly subscription price created: ${subscriptionPrice.id}`
      );

      // Create one-time price
      const oneTimePrice = await stripe.prices.create({
        currency: "usd",
        product: product.id,
        unit_amount: productData.price,
        metadata: {
          type: "one-time",
        },
      });

      console.log(`✓ One-time price created: ${oneTimePrice.id}`);

      createdProducts.push({
        product: product,
        subscriptionPrice: subscriptionPrice,
        oneTimePrice: oneTimePrice,
        originalData: productData,
      });

      console.log("---");
    }

    // Display environment variables to add
    console.log(
      "\n📝 Add these environment variables to your .env.local file:"
    );
    console.log("=".repeat(60));

    createdProducts.forEach((item, index) => {
      const planName = item.originalData.name
        .replace(" Plan", "")
        .toUpperCase();
      console.log(
        `STRIPE_${planName}_SUBSCRIPTION_PRICE_ID=${item.subscriptionPrice.id}`
      );
      console.log(
        `STRIPE_${planName}_ONETIME_PRICE_ID=${item.oneTimePrice.id}`
      );
      if (index < createdProducts.length - 1) console.log("");
    });

    console.log("\n🎉 Stripe products and prices created successfully!");
    console.log(
      "Don't forget to update your environment variables and restart your development server."
    );
  } catch (error) {
    console.error("Error setting up Stripe products:", error);
    process.exit(1);
  }
}

// Run the setup
setupStripeProducts();
