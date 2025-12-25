// Vercel Serverless Function
// Fixes Deezer CORS restrictions by calling Deezer server-side.

export default async function handler(req, res) {
  // Allow basic CORS (safe even though the client calls this same-origin on Vercel)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const q = (req.query?.q || '').toString().trim()
  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter: q' })
  }

  try {
    const upstream = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(q)}`
    )

    // Deezer typically returns JSON. If it ever responds with non-JSON,
    // return text for easier debugging.
    const contentType = upstream.headers.get('content-type') || ''
    const body = contentType.includes('application/json')
      ? await upstream.json()
      : await upstream.text()

    // Cache at the edge to reduce rate limits.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')

    if (typeof body === 'string') {
      return res.status(upstream.status).send(body)
    }
    return res.status(upstream.status).json(body)
  } catch (err) {
    return res.status(500).json({ error: 'Upstream request failed' })
  }
}

