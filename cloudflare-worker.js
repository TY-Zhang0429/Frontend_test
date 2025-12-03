// Cloudflare Workers 代理
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Target-API',
  }

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (request.method === 'POST') {
    try {
      // Get target API from header
      const targetAPI = request.headers.get('X-Target-API') || 
        'https://popularzer-blue-uvpzmhjoqt.cn-shanghai.fcapp.run/'

      // Forward request
      const body = await request.text()
      const response = await fetch(targetAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      })

      const data = await response.json()

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      })
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Proxy failed', 
        details: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      })
    }
  }

  return new Response('Method not allowed', { 
    status: 405,
    headers: corsHeaders,
  })
}
