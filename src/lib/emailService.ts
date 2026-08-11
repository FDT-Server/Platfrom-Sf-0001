import prisma from "./db";

interface QueueEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function queueEmail(options: QueueEmailOptions) {
  try {
    await prisma.emailQueue.create({
      data: {
        to: options.to,
        subject: options.subject,
        body: options.html,
        status: "PENDING",
      },
    });
    console.log(`[EmailService] Queued email to ${options.to}`);
  } catch (error) {
    console.error("[EmailService] Failed to queue email:", error);
  }
}
