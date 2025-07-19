const { PrismaClient } = require("../lib/generated/prisma");

const prisma = new PrismaClient();

async function fixDuplicates() {
  try {
    console.log("🔧 Cleaning up duplicate entries...");

    const projectId = "cmd9fzlg3000920zcwadw1w56"; // Your test project

    // Get current project with all services and add-ons
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        services: {
          include: { service: true },
        },
        addOns: {
          include: { addOn: true },
        },
      },
    });

    if (!project) {
      console.error("❌ Project not found");
      return;
    }

    console.log("📊 Current state:");
    console.log(`  Services: ${project.services.length} entries`);
    console.log(`  Add-ons: ${project.addOns.length} entries`);

    // Find and remove duplicate services
    const uniqueServices = new Map();
    const duplicateServiceIds = [];

    project.services.forEach((ps) => {
      const serviceId = ps.service.id;
      if (uniqueServices.has(serviceId)) {
        duplicateServiceIds.push(ps.id);
        console.log(
          `🔍 Found duplicate service: ${ps.service.name} (${ps.id})`
        );
      } else {
        uniqueServices.set(serviceId, ps);
        console.log(`✅ Keeping service: ${ps.service.name} (${ps.id})`);
      }
    });

    // Find and remove duplicate add-ons
    const uniqueAddOns = new Map();
    const duplicateAddOnIds = [];

    project.addOns.forEach((pa) => {
      const addOnId = pa.addOn.id;
      if (uniqueAddOns.has(addOnId)) {
        duplicateAddOnIds.push(pa.id);
        console.log(`🔍 Found duplicate add-on: ${pa.addOn.name} (${pa.id})`);
      } else {
        uniqueAddOns.set(addOnId, pa);
        console.log(`✅ Keeping add-on: ${pa.addOn.name} (${pa.id})`);
      }
    });

    // Delete duplicate services
    if (duplicateServiceIds.length > 0) {
      await prisma.projectService.deleteMany({
        where: { id: { in: duplicateServiceIds } },
      });
      console.log(
        `🗑️ Deleted ${duplicateServiceIds.length} duplicate service entries`
      );
    }

    // Delete duplicate add-ons
    if (duplicateAddOnIds.length > 0) {
      await prisma.projectAddOn.deleteMany({
        where: { id: { in: duplicateAddOnIds } },
      });
      console.log(
        `🗑️ Deleted ${duplicateAddOnIds.length} duplicate add-on entries`
      );
    }

    // Recalculate total amount
    let newTotal = 0;

    // Add service prices
    uniqueServices.forEach((ps) => {
      newTotal += ps.customPrice || ps.service.basePrice;
    });

    // Add add-on prices
    uniqueAddOns.forEach((pa) => {
      newTotal += pa.customPrice || 0;
    });

    // Update project total
    await prisma.project.update({
      where: { id: projectId },
      data: { totalAmount: newTotal },
    });

    console.log("🎉 Cleanup completed:");
    console.log(`  Removed ${duplicateServiceIds.length} duplicate services`);
    console.log(`  Removed ${duplicateAddOnIds.length} duplicate add-ons`);
    console.log(`  Updated total amount: $${(newTotal / 100).toFixed(2)}`);
  } catch (error) {
    console.error("❌ Error cleaning up duplicates:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDuplicates();
