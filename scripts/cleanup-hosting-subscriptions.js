const { PrismaClient } = require("../lib/generated/prisma");

const prisma = new PrismaClient();

async function cleanupHostingSubscriptions() {
  try {
    console.log("🧹 Cleaning up incomplete hosting subscriptions...");

    // Delete incomplete subscriptions
    const deletedSubs = await prisma.subscription.deleteMany({
      where: {
        status: "INCOMPLETE",
      },
    });

    console.log(`✅ Deleted ${deletedSubs.count} incomplete subscriptions`);

    // Also clean up any incomplete project subscriptions
    const deletedProjectSubs = await prisma.projectSubscription.deleteMany({
      where: {
        status: "INCOMPLETE",
      },
    });

    console.log(
      `✅ Deleted ${deletedProjectSubs.count} incomplete project subscriptions`
    );

    console.log("📝 Ready to test hosting plan selection again!");
    console.log(
      "👉 Go to Dashboard → Hosting tab → Select plan → Should redirect to Stripe"
    );
  } catch (error) {
    console.error("❌ Error cleaning up subscriptions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupHostingSubscriptions();
