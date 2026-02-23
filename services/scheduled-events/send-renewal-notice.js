//services/scheduled-events/send-renewal-notice.js
const { sendRenewalNoticeEmail } = require("../email/complete-renewal");
const { clientdb, links } = require("../../data/data");

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

module.exports = { runRenewalNotices };