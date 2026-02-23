//services/index.js
const { sendRenewalEmail } = require('./email/renewal-email');
const { sendRenewalNoticeEmail} = require('./email/complete-renewal');
const { runRenewalNotices } = require('./scheduled-events/send-renewal-notice');

module.exports = {
    sendRenewalEmail,
    sendRenewalNoticeEmail,
    runRenewalNotices
}