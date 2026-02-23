const nodemailer = require('nodemailer')
const { EmailTemplate } = require('./email-body')


const transporter = nodemailer.createTransport({
  host:   'smtp.mail.me.com',
  port:   587,
  secure: false,
  auth: {
    user: process.env.ICLOUD_EMAIL,
    pass: process.env.ICLOUD_APP_PASSWORD,
  },
})


const FROM_NAME = process.env.EMAIL_FROM_NAME  ?? 'No-Reply-[GLATESTING]'
const FROM_ADDRESS = 'hello@glacode.com'
const INBOUND_DOMAIN = process.env.INBOUND_DOMAIN

function generateReplyAddress(clientId) {
  const padded = String(clientId).padStart(4, '0')
  return `GLA-${padded}@${INBOUND_DOMAIN}`
}

async function sendEmail({ to, subject, bodyHtml, text, replyTo, attachments = [] }) {
  const message = {
    from:    `"${FROM_NAME}" <${FROM_ADDRESS}>`,
    to,
    subject,
    html: EmailTemplate(bodyHtml),
    text: text ?? stripHtml(bodyHtml),
    ...(replyTo && { replyTo }),
    ...(attachments.length && { attachments }),
  }

  try {
    const info = await transporter.sendMail(message)
    console.log(`✅ Email sent: ${subject} → ${to} (${info.messageId})`)
    return { success: true, messageId: info.messageId }
  } catch (err) {
    console.error(`❌ Email failed: ${subject} → ${to}`, err.message)
    return { success: false, error: err.message }
  }
}

function stripHtml(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

module.exports = { sendEmail, generateReplyAddress }