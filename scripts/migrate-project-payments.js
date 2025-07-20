const { PrismaClient } = require("../lib/generated/prisma");

const prisma = new PrismaClient();

async function migrateProjectPayments() {
  try {
    console.log("🔄 Starting project payment migration...");

    // Find all payments in general payments table that have projectId in metadata
    const paymentsToMigrate = await prisma.payment.findMany({
      where: {
        AND: [
          { metadata: { not: null } },
          // Check if metadata contains projectId
          {
            OR: [
              { metadata: { path: ["projectId"], not: null } },
              { metadata: { path: ["projectId"], not: "" } },
            ],
          },
        ],
      },
    });

    console.log(`📊 Found ${paymentsToMigrate.length} payments to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const payment of paymentsToMigrate) {
      const projectId = payment.metadata?.projectId;

      if (!projectId) {
        console.log(
          `⚠️  Skipping payment ${payment.id} - no projectId in metadata`
        );
        skippedCount++;
        continue;
      }

      // Check if project exists
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        console.log(
          `⚠️  Skipping payment ${payment.id} - project ${projectId} not found`
        );
        skippedCount++;
        continue;
      }

      // Check if already migrated (exists in project_payments)
      const existingProjectPayment = await prisma.projectPayment.findUnique({
        where: { stripePaymentIntentId: payment.stripePaymentIntentId },
      });

      if (existingProjectPayment) {
        console.log(
          `⚠️  Skipping payment ${payment.id} - already exists in project_payments`
        );
        skippedCount++;
        continue;
      }

      try {
        // Create record in project_payments table
        await prisma.projectPayment.create({
          data: {
            projectId: projectId,
            stripePaymentIntentId: payment.stripePaymentIntentId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            description: payment.description || "Migrated project payment",
            receiptUrl: payment.receiptUrl,
            metadata: payment.metadata,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
          },
        });

        // Delete from general payments table
        await prisma.payment.delete({
          where: { id: payment.id },
        });

        console.log(
          `✅ Migrated payment ${payment.stripePaymentIntentId} to project ${projectId}`
        );
        migratedCount++;
      } catch (error) {
        console.error(
          `❌ Error migrating payment ${payment.id}:`,
          error.message
        );
        skippedCount++;
      }
    }

    console.log("\n📈 Migration Summary:");
    console.log(`✅ Successfully migrated: ${migratedCount} payments`);
    console.log(`⚠️  Skipped: ${skippedCount} payments`);

    // Now recalculate all project paid amounts
    console.log("\n🔄 Recalculating project paid amounts...");

    const projects = await prisma.project.findMany({
      include: {
        payments: {
          where: { status: "SUCCEEDED" },
        },
      },
    });

    let updatedProjects = 0;

    for (const project of projects) {
      const totalPaid = project.payments.reduce((sum, p) => sum + p.amount, 0);

      if (project.paidAmount !== totalPaid) {
        await prisma.project.update({
          where: { id: project.id },
          data: { paidAmount: totalPaid },
        });

        console.log(
          `✅ Updated project ${project.id} paid amount: $${totalPaid / 100}`
        );
        updatedProjects++;
      }
    }

    console.log(`\n✅ Updated ${updatedProjects} project paid amounts`);
    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateProjectPayments()
  .then(() => {
    console.log("✅ Migration script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration script failed:", error);
    process.exit(1);
  });
