const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequests");
const sendEmail = require("./sendEmail");

// ============================================
// CRON JOB: Send pending request reminders
// Runs daily at 7:30 AM IST (Asia/Kolkata)
// ============================================

const CRON_EXPRESSION = "30 7 * * *"; // 7:30 AM every day
const TIMEZONE = "Asia/Kolkata";

// Validate cron expression at startup
if (!cron.validate(CRON_EXPRESSION)) {
  console.error("❌ [CRON] Invalid cron expression:", CRON_EXPRESSION);
  process.exit(1);
}

console.log(`✅ [CRON] Scheduled: "${CRON_EXPRESSION}" (Timezone: ${TIMEZONE})`);
console.log(`📅 [CRON] Next execution will be at 7:30 AM IST daily`);

const task = cron.schedule(
  CRON_EXPRESSION,
  async () => {
    const jobId = `job_${Date.now()}`;
    console.log(`\n🚀 [CRON] [${jobId}] Started at ${new Date().toISOString()}`);

    try {
      // Calculate yesterday's date range
      const yesterday = subDays(new Date(), 1);
      const yesterdayStart = startOfDay(yesterday);
      const yesterdayEnd = endOfDay(yesterday);

      console.log(`📆 [CRON] [${jobId}] Fetching requests from ${yesterdayStart.toISOString()} to ${yesterdayEnd.toISOString()}`);

      // Fetch pending connection requests from yesterday
      const pendingRequests = await ConnectionRequestModel.find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      }).populate("fromUserId toUserId");

      console.log(`📊 [CRON] [${jobId}] Found ${pendingRequests.length} pending requests`);

      if (pendingRequests.length === 0) {
        console.log(`✅ [CRON] [${jobId}] No pending requests to process. Exiting.`);
        return;
      }

      // Extract unique recipient emails (toUserId contains populated user object)
      const uniqueEmails = [
        ...new Set(
          pendingRequests
            .map((req) => req.toUserId?.emailId)
            .filter((email) => email) // Filter out undefined/null
        ),
      ];

      console.log(`📧 [CRON] [${jobId}] Sending emails to ${uniqueEmails.length} unique users:`, uniqueEmails);

      // Send emails with proper error handling
      let successCount = 0;
      let failCount = 0;

      for (const email of uniqueEmails) {
        try {
          await sendEmail({
            to: email,
            subject: "You have pending friend requests! 🚀",
            html: `
              <h2>Hey there!</h2>
              <p>You have pending friend requests on DevTinder.</p>
              <p>Please login to <a href="https://devtinder.in">DevTinder.in</a> to accept or reject them.</p>
              <br/>
              <p>– Team DevConnect</p>
            `,
          });
          successCount++;
          console.log(`✅ [CRON] [${jobId}] Email sent to: ${email}`);
        } catch (emailErr) {
          failCount++;
          console.error(`❌ [CRON] [${jobId}] Failed to send email to ${email}:`, emailErr.message);
        }
      }

      console.log(`\n📈 [CRON] [${jobId}] Summary: ${successCount} sent, ${failCount} failed`);
    } catch (err) {
      console.error(`❌ [CRON] [${jobId}] Job failed with error:`, err.message);
      console.error(err.stack);
    } finally {
      console.log(`🏁 [CRON] [${jobId}] Completed at ${new Date().toISOString()}\n`);
    }
  },
  {
    scheduled: true,
    timezone: TIMEZONE, // IST timezone
  }
);

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("🛑 [CRON] Received SIGTERM, stopping cron job...");
  task.stop();
});

process.on("SIGINT", () => {
  console.log("🛑 [CRON] Received SIGINT, stopping cron job...");
  task.stop();
});

module.exports = task;
