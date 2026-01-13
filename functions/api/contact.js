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

const sanitizeFilename = (name) => {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned || 'photo'
}

const base64UrlEncode = (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const signToken = async (secret, payload) => {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return base64UrlEncode(signature)
}

const extractTextFields = (source) => ({
  name: safeValue(source?.get ? source.get('name') : source?.name),
  phone: safeValue(source?.get ? source.get('phone') : source?.phone),
  email: safeValue(source?.get ? source.get('email') : source?.email),
  service: safeValue(source?.get ? source.get('service') : source?.service),
  message: safeValue(source?.get ? source.get('message') : source?.message),
  website: safeValue(source?.get ? source.get('website') : source?.website)
})

const parseRequestBody = async (request) => {
  const contentType = request.headers.get('content-type') || ''
  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData()
    return { form, json: null }
  }

  try {
    const json = await request.json()
    return { form: null, json }
  } catch {
    return { form: null, json: null }
  }
}

export const onRequestPost = async ({ request, env }) => {
  try {
    const { form, json } = await parseRequestBody(request)
    if (!form && !json) {
      return jsonResponse({ ok: false, error: 'Invalid payload.' }, 400)
    }

    const fields = extractTextFields(form || json)
    const { name, phone, email, service, message, website } = fields

    if (website) {
      return jsonResponse({ ok: true })
    }

    if (!name || !message || (!phone && !email)) {
      return jsonResponse(
        { ok: false, error: 'Name, message, and phone or email are required.' },
        400
      )
    }

    const missingVars = ['RESEND_API_KEY', 'CONTACT_TO', 'CONTACT_FROM'].filter(
      (key) => !env?.[key]
    )
    if (missingVars.length) {
      missingVars.forEach((key) => console.error(`Missing env var: ${key}`))
      return jsonResponse({ ok: false, error: 'Server not configured' }, 500)
    }

    const recipients = env.CONTACT_TO.split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)

    if (recipients.length === 0) {
      console.error('Missing env var: CONTACT_TO')
      return jsonResponse({ ok: false, error: 'Server not configured' }, 500)
    }

    let uploadedKeys = []
    if (form) {
      const files = form.getAll('photos').filter((file) => file instanceof File)
      if (files.length > 6) {
        return jsonResponse({ ok: false, error: 'Maximum 6 photos allowed.' }, 400)
      }

      if (files.length && !env?.UPLOADS) {
        console.error('Missing env var: UPLOADS')
        return jsonResponse({ ok: false, error: 'Server not configured' }, 500)
      }

      const today = new Date().toISOString().slice(0, 10)
      for (const file of files) {
        if (!file.type || !file.type.startsWith('image/')) {
          return jsonResponse({ ok: false, error: 'Only image uploads allowed.' }, 400)
        }
        if (file.size > 10 * 1024 * 1024) {
          return jsonResponse({ ok: false, error: 'Each photo must be under 10MB.' }, 400)
        }

        const originalName = file.name ? file.name.split(/[\\/]/).pop() : 'photo'
        const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/)
        const extension = extMatch ? extMatch[1].toLowerCase() : ''
        const baseName = sanitizeFilename(originalName.replace(/\.[^/.]+$/, ''))
        const random = crypto.randomUUID().slice(0, 8)
        const fileName = extension ? `${baseName}.${extension}` : baseName
        const key = `quotes/${today}/${random}_${fileName}`

        const buffer = await file.arrayBuffer()
        await env.UPLOADS.put(key, buffer, {
          httpMetadata: { contentType: file.type }
        })

        uploadedKeys.push(key)
      }
    }

    const ttlSeconds = Number.parseInt(env?.UPLOAD_LINK_TTL_SECONDS || '', 10)
    const ttl = Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? ttlSeconds : 604800
    const secret = env?.DOWNLOAD_TOKEN_SECRET || ''
    const origin = new URL(request.url).origin
    const signedLinks = []

    if (uploadedKeys.length) {
      if (!secret) {
        console.error('Missing env var: DOWNLOAD_TOKEN_SECRET')
        return jsonResponse({ ok: false, error: 'Server not configured' }, 500)
      }
      const exp = Math.floor(Date.now() / 1000) + ttl
      for (const key of uploadedKeys) {
        const signature = await signToken(secret, `${key}:${exp}`)
        const url = `${origin}/uploads/${encodeURI(key)}?exp=${exp}&sig=${signature}`
        signedLinks.push(url)
      }
    }

    const serviceLabel = service || 'General'
    const subject = `New quote request - ${serviceLabel}`

    const textLines = [
      'New quote request',
      '',
      `Name: ${name}`,
      `Phone: ${phone || '-'}`,
      `Email: ${email || '-'}`,
      `Service: ${serviceLabel}`,
      '',
      'Message:',
      message,
      ''
    ]

    if (signedLinks.length) {
      textLines.push('Photos:')
      signedLinks.forEach((link) => textLines.push(link))
      textLines.push('')
    }

    textLines.push(`Website: ${website || '-'}`)

    const textBody = textLines.join('\n')

    const htmlLines = [
      '<p><strong>New quote request</strong></p>',
      `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Phone:</strong> ${escapeHtml(phone || '-')}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email || '-')}</p>`,
      `<p><strong>Service:</strong> ${escapeHtml(serviceLabel)}</p>`,
      `<p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`
    ]

    if (signedLinks.length) {
      const linksHtml = signedLinks
        .map((link) => `<a href="${escapeHtml(link)}">${escapeHtml(link)}</a>`)
        .join('<br>')
      htmlLines.push(`<p><strong>Photos:</strong><br>${linksHtml}</p>`)
    }

    htmlLines.push(`<p><strong>Website:</strong> ${escapeHtml(website || '-')}</p>`)

    const payload = {
      from: env.CONTACT_FROM,
      to: recipients,
      subject,
      text: textBody,
      html: htmlLines.join(''),
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
      const contentType = resendResponse.headers.get('content-type') || ''
      let bodyText = ''
      try {
        if (contentType.includes('application/json')) {
          const data = await resendResponse.json()
          bodyText = JSON.stringify(data)
        } else {
          bodyText = await resendResponse.text()
        }
      } catch {
        bodyText = 'Unable to read provider response.'
      }

      console.error('Resend error', resendResponse.status, bodyText)
      return jsonResponse({ ok: false, error: 'Email provider error' }, 502)
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    console.error('Contact handler error', error)
    return jsonResponse({ ok: false, error: 'Server error' }, 500)
  }
}

export const onRequest = async (context) => {
  try {
    if (context.request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405)
    }

    return await onRequestPost(context)
  } catch (error) {
    console.error('Contact handler error', error)
    return jsonResponse({ ok: false, error: 'Server error' }, 500)
  }
}
