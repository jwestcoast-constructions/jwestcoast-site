const jsonResponse = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })

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

export const onRequest = async ({ params, request, env }) => {
  try {
    const rawPath = params?.path
    let key = Array.isArray(rawPath)
      ? rawPath.join('/')
      : typeof rawPath === 'string'
        ? rawPath
        : ''
    if (key.startsWith('/')) {
      key = key.slice(1)
    }
    if (!key) {
      return jsonResponse({ ok: false, error: 'Not found' }, 404)
    }

    console.log('[uploads] raw params.path:', rawPath)
    console.log('[uploads] computed key:', key)

    const url = new URL(request.url)
    const expParam = url.searchParams.get('exp')
    const sig = url.searchParams.get('sig')

    if (!expParam || !sig) {
      return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    }

    const exp = Number.parseInt(expParam, 10)
    if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) {
      return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    }

    if (!env?.DOWNLOAD_TOKEN_SECRET) {
      console.error('Missing env var: DOWNLOAD_TOKEN_SECRET')
      return jsonResponse({ ok: false, error: 'Server not configured' }, 500)
    }

    const expectedSig = await signToken(env.DOWNLOAD_TOKEN_SECRET, `${key}:${exp}`)
    if (sig !== expectedSig) {
      return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    }

    if (!env?.UPLOADS) {
      console.error('Missing env var: UPLOADS')
      return jsonResponse({ ok: false, error: 'Server not configured' }, 500)
    }

    const obj = await env.UPLOADS.get(key)
    console.log('[uploads] exists:', Boolean(obj))
    if (!obj) {
      return jsonResponse({ ok: false, error: 'Not found' }, 404)
    }

    const headers = new Headers()
    if (typeof obj.writeHttpMetadata === 'function') {
      obj.writeHttpMetadata(headers)
    }
    if (!headers.get('Content-Type') && obj.httpMetadata?.contentType) {
      headers.set('Content-Type', obj.httpMetadata.contentType)
    }
    headers.set('Cache-Control', 'private, max-age=0')

    return new Response(obj.body, { headers })
  } catch (error) {
    console.error('Upload link error', error)
    return jsonResponse({ ok: false, error: 'Server error' }, 500)
  }
}
