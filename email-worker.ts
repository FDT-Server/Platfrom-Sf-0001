import prisma from "./src/lib/db";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || "fallback_key_for_typescript");

const DELAY_MS = 6000; // 6 seconds gap as requested

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processQueue() {
  console.log("[EmailWorker] Started queue processor. Checking for pending emails...");
  
  while (true) {
    try {
      // Find oldest pending email
      const email = await prisma.emailQueue.findFirst({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
      });

      if (email) {
        console.log(`[EmailWorker] Sending email to ${email.to} (Subject: ${email.subject})`);
        
        const { data, error } = await resend.emails.send({
          from: "Student Forge <info@studentforge.in>", // Changed to your verified domain
          to: [email.to],
          subject: email.subject,
          html: email.body,
        });

        if (error) {
          console.error(`[EmailWorker] Failed to send to ${email.to}:`, error);
          await prisma.emailQueue.update({
            where: { id: email.id },
            data: { status: "FAILED", error: JSON.stringify(error) },
          });
        } else {
          console.log(`[EmailWorker] Successfully sent to ${email.to}`);
          await prisma.emailQueue.update({
            where: { id: email.id },
            data: { status: "SENT", sentAt: new Date() },
          });
        }

        // Wait strictly 6 seconds between each email
        console.log(`[EmailWorker] Waiting ${DELAY_MS / 1000} seconds before next email...`);
        await sleep(DELAY_MS);
      } else {
        // No emails pending, check again in 2 seconds
        await sleep(2000);
      }
    } catch (err) {
      console.error("[EmailWorker] Unexpected error in processing loop:", err);
      await sleep(5000);
    }
  }
}

// Start processing
processQueue();
