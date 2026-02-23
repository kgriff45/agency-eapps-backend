// server/services/email.js
const postmark = require('postmark')

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY)

const INBOUND_DOMAIN = process.env.INBOUND_DOMAIN || 'inbound.postmarkapp.com'

function generateReplyAddress(clientId) {
  const padded = String(clientId).padStart(4, '0')
  return `GLA-${padded}@${INBOUND_DOMAIN}`
}

async function sendRenewalEmail(clientRecord, pdfBuffer) {
  const replyAddress = generateReplyAddress(clientRecord.id)

  await client.sendEmail({
    From:     process.env.POSTMARK_FROM,
    To:       clientRecord.contact_email,
    ReplyTo:  replyAddress,
    Subject:  `Your Annual Coverage Review — ${clientRecord.account_name}`,
    TextBody: [
      `Hi ${clientRecord.first_name},`,
      '',
      `Your Annual Coverage Review is attached. Please review it and reply to this email`,
      `with any corrections, or contact your agent directly.`,
      '',
      `This email is monitored — any reply will be routed directly to your account.`,
      '',
      `PRA Agency`,
    ].join('\n'),
    HtmlBody: `
      <p>Hi ${clientRecord.first_name},</p>
      <p>Your Annual Coverage Review is attached. Please review it and reply to this email
      with any corrections, or contact your agent directly.</p>
      <p style="color:#6B7280;font-size:13px;">
        This email is monitored — any reply will be routed directly to your account.
      </p>
      <p>PRA Agency</p>
    `,
    Attachments: [{
      Name:        `annual-review-${clientRecord.account_name.replace(/\s+/g, '-')}.pdf`,
      Content:     pdfBuffer.toString('base64'),
      ContentType: 'application/pdf',
    }],
    MessageStream: 'outbound',
  })

  return replyAddress
}

module.exports = { sendRenewalEmail, generateReplyAddress }