const { PrismaClient } = require("../lib/generated/prisma");

const prisma = new PrismaClient();

async function resetProjectStatus() {
  try {
    console.log("🔄 Resetting project status for testing...");

    const projectId = "cmd9fzlg3000920zcwadw1w56"; // Your test project

    // Reset project to QUOTE_REQUESTED status
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: "QUOTE_REQUESTED",
        quoteValidUntil: null,
        quoteNotes: null,
        paidAmount: 0, // Reset payment for testing
      },
    });

    console.log("✅ Project reset successfully:");
    console.log({
      projectId: updatedProject.id,
      name: updatedProject.name,
      status: updatedProject.status,
      totalAmount: updatedProject.totalAmount,
      paidAmount: updatedProject.paidAmount,
      quoteValidUntil: updatedProject.quoteValidUntil,
      quoteNotes: updatedProject.quoteNotes,
    });

    console.log("📝 Now you can test the admin quote notes feature!");
    console.log(
      '👉 Go to Admin Dashboard → Projects → Click "Send Quote" on this project'
    );
  } catch (error) {
    console.error("❌ Error resetting project:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetProjectStatus();
