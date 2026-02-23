const { sendRenewalEmail } = require('./email/renewal-email');
const { sendRenewalNoticeEmail} = require('./email/complete-renewal');

module.exports = {
    sendRenewalEmail,
    sendRenewalNoticeEmail
}