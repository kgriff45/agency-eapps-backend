const { sendEmail } = require('../../utils')

const APP_BASE_URL = process.env.APP_BASE_URL ?? 'https://youragency.com'

function buildRenewalNoticeBody(clientRecord, linkId) {
  const onlineUrl  = `${APP_BASE_URL}/?linkId=${linkId}`
  const blankPdfUrl = `${APP_BASE_URL}/renewalapp/${linkId}/pdf`

  return `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:600;color:#111827;">
      It's Time for Your Annual Coverage Review
    </h2>
    <p style="margin:0 0 28px;color:#6b7280;font-size:14px;">
      ${clientRecord.account_name}
    </p>

    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
      Hi ${clientRecord.first_name},
    </p>
    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
      Your annual coverage review is coming up. Please take a few minutes to confirm
      your account details, review your policies, and let us know if anything
      has changed; this helps us make sure your coverage is accurate at renewal.
    </p>

    <!-- Two options -->
    <p style="margin:0 0 14px;color:#111827;font-size:14px;font-weight:600;">
      You have two ways to complete your review:
    </p>

    <!-- Option 1: Online -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;">
      <tr>
        <td style="background:#f3f9f5;border:1px solid #e0eae7;border-radius:8px;padding:18px 20px;">
          <p style="margin:0 0 4px;color:#156736;font-size:13px;font-weight:600;letter-spacing:0.03em;">
            OPTION 1 — COMPLETE ONLINE
          </p>
          <p style="margin:0 0 14px;color:#374151;font-size:13px;line-height:1.6;">
            Use our secure online form to review your details, select any changes,
            and submit directly to your agent. Takes about 5 minutes.
          </p>
          <a href="${onlineUrl}"
             style="display:inline-block;background:#156736;color:#ffffff;font-size:14px;font-weight:600;padding:11px 22px;border-radius:6px;text-decoration:none;">
            Complete My Review Online →
          </a>
        </td>
      </tr>
    </table>

    <!-- Option 2: Print -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr>
        <td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:18px 20px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:13px;font-weight:600;letter-spacing:0.03em;">
            OPTION 2 — PRINT &amp; RETURN
          </p>
          <p style="margin:0 0 14px;color:#374151;font-size:13px;line-height:1.6;">
            Prefer paper? Download a blank copy of your review form, fill it out,
            and email or fax it back to your agent.
          </p>
          <a href="${blankPdfUrl}"
             style="display:inline-block;background:#ffffff;color:#374151;font-size:14px;font-weight:500;padding:10px 22px;border-radius:6px;text-decoration:none;border:1px solid #d1d5db;">
            Download Blank Form
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 4px;color:#374151;font-size:15px;">
      Questions? Reply to this email or reach us at
      <a href="mailto:support@youragency.com" style="color:#156736;">support@youragency.com</a>.
    </p>

    <p style="margin:24px 0 0;color:#374151;font-size:15px;">
      Best regards,<br/>
      <strong>ProAssurance Agency</strong>
    </p>
  `
}

function getRenewalNoticeRecipients(clientRecord) {
  return {
    to:  clientRecord.contact_email,
    bcc: 'clientRecord?.account_manager_email',
    replyTo: clientRecord.account_manager_email
  }
}

async function sendRenewalNoticeEmail(clientRecord, linkId) {
  const bodyHtml = buildRenewalNoticeBody(clientRecord, linkId)
  const { to, cc, bcc, replyTo } = getRenewalNoticeRecipients(clientRecord)

  return sendEmail({
    to,
    ...(cc  && { cc }),
    ...(bcc && { bcc }),
    ...(replyTo && { replyTo }),
    subject:  `Action Required: Your Annual Coverage Review — ${clientRecord.account_name}`,
    bodyHtml,
  })
}

module.exports = { sendRenewalNoticeEmail }