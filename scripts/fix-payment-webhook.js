const { PrismaClient } = require("../lib/generated/prisma");

const prisma = new PrismaClient();

async function fixPaymentWebhook() {
  try {
    console.log("🔧 Fixing payment webhook issue...");

    // Find the successful payment that wasn't processed by webhook
    const payment = await prisma.payment.findFirst({
      where: {
        status: "SUCCEEDED",
        stripePaymentIntentId: "pi_3RmO1Y4hgKBUixPS17akN3PR", // From your data
      },
    });

    if (!payment) {
      console.error("❌ Payment not found");
      return;
    }

    console.log("✅ Found payment:", {
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      metadata: payment.metadata,
    });

    // Extract project ID from payment metadata
    const metadata = payment.metadata;
    const projectId = metadata?.projectId;

    if (!projectId) {
      console.error("❌ No project ID found in payment metadata");
      return;
    }

    console.log("✅ Project ID found:", projectId);

    // Get current project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      console.error("❌ Project not found:", projectId);
      return;
    }

    console.log("✅ Current project status:", {
      totalAmount: project.totalAmount,
      paidAmount: project.paidAmount,
      status: project.status,
    });

    // Calculate new paid amount (current + this payment)
    const newPaidAmount = project.paidAmount + payment.amount;

    console.log("📊 Calculation:", {
      currentPaid: project.paidAmount,
      paymentAmount: payment.amount,
      newPaidAmount: newPaidAmount,
    });

    // Update project with correct paid amount
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        paidAmount: newPaidAmount,
        // If 50%+ paid and currently QUOTE_APPROVED, move to IN_PROGRESS
        ...(newPaidAmount >= project.totalAmount * 0.5 &&
          project.status === "QUOTE_APPROVED" && {
            status: "IN_PROGRESS",
          }),
      },
    });

    console.log("🎉 Project updated successfully:", {
      projectId: updatedProject.id,
      totalAmount: updatedProject.totalAmount,
      paidAmount: updatedProject.paidAmount,
      status: updatedProject.status,
      percentPaid: Math.round(
        (updatedProject.paidAmount / updatedProject.totalAmount) * 100
      ),
    });

    console.log("✅ Payment webhook fix completed!");
  } catch (error) {
    console.error("❌ Error fixing payment webhook:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixPaymentWebhook();
