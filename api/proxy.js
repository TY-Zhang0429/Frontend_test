// Vercel Serverless Function for API proxy (v2)
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Target-API');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Read target API from header or default to Douyin/XHS
      const targetAPI = req.headers['x-target-api'] || 'https://popularzer-blue-uvpzmhjoqt.cn-shanghai.fcapp.run/';
      
      console.log('Proxying to:', targetAPI);
      
      const response = await fetch(targetAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Failed to fetch data from backend', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
