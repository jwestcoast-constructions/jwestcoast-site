const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })

const safeValue = (value) => (typeof value === 'string' ? value.trim() : '')

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const onRequestPost = async ({ request, env }) => {
  let body = null
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON.' }, 400)
  }

  const name = safeValue(body?.name)
  const phone = safeValue(body?.phone)
  const email = safeValue(body?.email)
  const service = safeValue(body?.service)
  const message = safeValue(body?.message)
  const website = safeValue(body?.website)

  if (website) {
    return jsonResponse({ ok: true })
  }

  if (!name || !message || (!phone && !email)) {
    return jsonResponse(
      { ok: false, error: 'Name, message, and phone or email are required.' },
      400
    )
  }

  if (!env?.RESEND_API_KEY || !env?.CONTACT_TO || !env?.CONTACT_FROM) {
    return jsonResponse({ ok: false, error: 'Email service not configured.' }, 500)
  }

  const recipients = env.CONTACT_TO.split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  if (recipients.length === 0) {
    return jsonResponse({ ok: false, error: 'Missing recipient.' }, 500)
  }

  const serviceLabel = service || 'General'
  const subject = `New quote request - ${serviceLabel}`

  const textBody = [
    'New quote request',
    '',
    `Name: ${name}`,
    `Phone: ${phone || '-'}`,
    `Email: ${email || '-'}`,
    `Service: ${serviceLabel}`,
    '',
    'Message:',
    message,
    '',
    `Website: ${website || '-'}`
  ].join('\n')

  const htmlBody = [
    '<p><strong>New quote request</strong></p>',
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(phone || '-')}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email || '-')}</p>`,
    `<p><strong>Service:</strong> ${escapeHtml(serviceLabel)}</p>`,
    `<p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    `<p><strong>Website:</strong> ${escapeHtml(website || '-')}</p>`
  ].join('')

  const payload = {
    from: env.CONTACT_FROM,
    to: recipients,
    subject,
    text: textBody,
    html: htmlBody,
    // Resend expects reply_to (snake_case) when provided.
    ...(email ? { reply_to: email } : {})
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!resendResponse.ok) {
    return jsonResponse({ ok: false, error: 'Email failed.' }, 502)
  }

  return jsonResponse({ ok: true })
}

export const onRequest = (context) => {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'POST' }
    })
  }

  return onRequestPost(context)
}
