const { Writable } = require('stream')
const { sendEmail } = require('../../utils')
const { generateRenewalPDF } = require('../generate-docs/generate-renewal-pdf')

async function buildPDFBuffer(enrichedClient, changes, options = {}) {
  return new Promise((resolve, reject) => {
    const chunks = []
    const sink   = new Writable({
      write(chunk, _, cb) { chunks.push(chunk); cb() }
    })
    sink.on('finish', () => resolve(Buffer.concat(chunks)))
    sink.on('error', reject)
    generateRenewalPDF(enrichedClient, changes, sink, options)
  })
}

function buildRenewalBody(clientRecord) {
  return `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:600;color:#111827;">
      Your Completed Annual Coverage Review
    </h2>
    <p style="margin:0 0 28px;color:#6b7280;font-size:14px;">
      ${clientRecord.account_name}
    </p>

    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
      Hi ${clientRecord.first_name},
    </p>
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
      Thank you for completing your annual coverage review, a copy of this has been sent 
      to your agent.
    </p>
    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
      If anything looks incorrect or you'd like to make changes, simply
      <strong>reach out to your agent</strong> and they will help you make 
      any needed changes.
    </p>

    <!-- Callout box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr>
        <td style="background:#f3f9f5;border-left:3px solid #156736;padding:14px 18px;border-radius:0 6px 6px 0;">
          <p style="margin:0;color:#374151;font-size:13px;line-height:1.6;">
            Please do not reply to this email, as this email box is not monitor. Please email your agent directly or
            email us at proassuranceagency.com
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:#374151;font-size:15px;">
      Best regards,
    </p>
    <p style="margin-top: 16px;color:#374151;font-size:15px;">
      <strong>ProAssurance Agency</strong>
    </p>
  `
}

function getRenewalRecipients(clientRecord) {
  return {
    to:  clientRecord?.contact_email,
    bcc: 'kylegriffin@proassurance.com',
    replyTo: clientRecord?.account_manager_email
  }
}

async function sendRenewalEmail(enrichedClient, changes, options = {}) {
  const {
    isOnline    = false,
    submittedAt = new Date().toISOString(),
    logoPath    = null,
  } = options

  const pdfBuffer = await buildPDFBuffer(enrichedClient, changes, {
    isOnline,
    submittedAt,
    logoPath,
  })

  const pdfName = `annual-review-${enrichedClient.account_name.replace(/\s+/g, '-')}.pdf`

  const bodyHtml = buildRenewalBody(enrichedClient)

  const { to, cc, bcc, replyTo } = getRenewalRecipients(enrichedClient)

  const result = await sendEmail({
    to,
    ...(cc  && { cc }),
    ...(bcc && { bcc }),
    ...(replyTo && { replyTo }),
    subject: `Your Annual Coverage Review — ${enrichedClient.account_name}`,
    bodyHtml,
    attachments: [{
      filename:    pdfName,
      content:     pdfBuffer,
      contentType: 'application/pdf',
    }],
  })

  return { ...result, replyAddress: replyTo }
}

module.exports = { sendRenewalEmail }