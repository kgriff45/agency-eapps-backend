const express = require('express');
const router = express.Router();

const { clientdb, links } = require('../data/data');
const policyTypes = require('../data/policy-schema');
const { generateRenewalPDF, generateRenewalPDFBuffer } = require('../services/generate-docs/generate-renewal-pdf')
const { sendRenewalEmail } = require('../services')

router.get('/policy-types', (req, res) => {
    res.json(policyTypes);
})

router.get('/policy-types/:code', (req,res) => {
    const schema = policyTypes[req.params.code.toUpperCase()]
    if (!schema) return res.status(404).json({error: "Unknown policy type"})
    res.json(schema);
})

router.get('/:linkId', (req, res) => {
  const { linkId } = req.params;

  const link = links.find(l => l.id === linkId);
  if (!link) return res.status(404).json({ error: 'Link not found' });

  const clientId = parseInt(link.reference.split('/')[1]);
  const client = clientdb.find(c => c.id === clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const payload = {
    ...client,
    policies: client.policies.map(pol => ({
      ...pol,
      schema: policyTypes[pol.type] ?? null,
    })),
  };

  res.json(payload);
});


router.post('/:linkId/pdf', (req, res) => {
  const { linkId } = req.params
  const { changes, isOnline, submittedAt, sessionId } = req.body 

  console.log("/PDF: cahnges - ", changes)

  const link = links.find(l => l.id === linkId)
  if (!link) return res.status(404).json({ error: 'Link not found' })

  const clientId = parseInt(link.reference.split('/')[1])
  const client   = clientdb.find(c => c.id === clientId)
  if (!client) return res.status(404).json({ error: 'Client not found' })

  const enrichedClient = {
    ...client,
    policies: client.policies.map(pol => ({
      ...pol,
      schema: policyTypes[pol.type] ?? null,
    })),
  }

  if (sessionId) changes.sessionId = sessionId

  try {
    const filename = `annual-review-${client.account_name.replace(/\s+/g, '-')}.pdf`
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.on('error', err => console.error('PDF stream error:', err.message))

    generateRenewalPDF(enrichedClient, changes, res, {
      isOnline:    isOnline ?? false,
      submittedAt: submittedAt ?? new Date().toISOString(),
      logoPath: '/assets/PRA-Icon.png',
    })

  } catch (err) {
    console.error('PDF generation failed:', err.message)
    if (!res.headersSent) {
      res.status(500).json({ error: 'PDF generation failed', detail: err.message })
    }
  }
})

router.post('/:linkId/complete-app', async (req, res) => {
  const { linkId } = req.params
  const { changes, isOnline, submittedAt, sessionId } = req.body

  const link = links.find(l => l.id === linkId)
  if (!link) return res.status(404).json({ error: 'Link not found' })

  const clientId     = parseInt(link.reference.split('/')[1])
  const clientRecord = clientdb.find(c => c.id === clientId)
  if (!clientRecord) return res.status(404).json({ error: 'Client not found' })

  const enrichedClient = {
    ...clientRecord,
    policies: clientRecord.policies.map(pol => ({
      ...pol,
      schema: policyTypes[pol.type] ?? null,
    })),
  }

  console.log('--- EMAIL ROUTE DEBUG ---');
  console.log('Client Policies Count:', enrichedClient.policies.length);
  console.log('Policy IDs in Client:', enrichedClient.policies.map(p => p.id));
  console.log('Changes Keys:', Object.keys(changes || {}));
  if (changes?.policies) {
    console.log('Policy IDs in Changes:', Object.keys(changes.policies));
  }

  if (sessionId) changes.sessionId = sessionId

  try {
    const pdfBuffer = await generateRenewalPDFBuffer(enrichedClient, changes, {
      isOnline:    isOnline ?? true,
      submittedAt: submittedAt ?? new Date().toISOString(),
      logoPath: '/assets/PRA-Icon.png',
    });

    const emailResult = await sendRenewalEmail(clientRecord, pdfBuffer)
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Email send failed', detail: emailResult.error })
    }

    res.json({
      success: true,
      message: `Email sent to ${clientRecord.contact_email}`,
    })

  } catch (err) {
    console.error('Email send failed:', err.message)
    res.status(500).json({ error: 'Email send failed', detail: err.message })
  }
})



module.exports = router;