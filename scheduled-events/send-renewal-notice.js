const cron = require("node-cron");
const { sendRenewalNoticeEmail } = require("../services");
const { clientdb, links } = require("../data/data");

async function runRenewalNotices() {
  for (const client of clientdb) {
    const linkRecord = links.find(
      (l) => l.reference === `client/${client.id}`
    );

    if (!linkRecord) {
      console.log(`No link found for client ${client.id}`);
      continue;
    }

    const linkId = linkRecord.id;

    await sendRenewalNoticeEmail(client, linkId);

    console.log(`Sent renewal notice for ${client.account_name}`);
  }
}

cron.schedule(
  "30 8 * * *",
  async () => {
    console.log("Running renewal job at 3:50 PM CST...");
    await runRenewalNotices();
  },
  {
    timezone: "America/Chicago",
  }
);

console.log("Renewal scheduler started...");