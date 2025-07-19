const { PrismaClient } = require("../lib/generated/prisma");

const prisma = new PrismaClient();

async function setProjectCompleted() {
  try {
    console.log(
      "🔧 Setting test project to COMPLETED status for hosting testing..."
    );

    const projectId = "cmd9fzlg3000920zcwadw1w56"; // Your test project

    // Update project status to COMPLETED
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: "COMPLETED",
      },
    });

    console.log("✅ Project status updated successfully:");
    console.log({
      projectId: updatedProject.id,
      name: updatedProject.name,
      status: updatedProject.status,
      totalAmount: updatedProject.totalAmount,
      paidAmount: updatedProject.paidAmount,
    });

    console.log("📝 Now you can test hosting plan selection!");
    console.log("👉 Go to Dashboard → Hosting tab → Select a hosting plan");
  } catch (error) {
    console.error("❌ Error updating project status:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setProjectCompleted();
