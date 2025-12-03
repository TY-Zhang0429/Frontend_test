// 阿里云函数计算代理函数
const https = require('https');
const http = require('http');

exports.handler = (request, response, context) => {
  // CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Target-API',
    'Content-Type': 'application/json',
  };

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    response.setStatusCode(200);
    response.setHeaders(corsHeaders);
    response.send('');
    return;
  }

  if (request.method === 'POST') {
    try {
      // 获取目标 API
      const targetAPI = request.headers['x-target-api'] || request.headers['X-Target-API'] || 
        'https://popularzer-blue-uvpzmhjoqt.cn-shanghai.fcapp.run/';
      
      console.log('Proxying to:', targetAPI);
      
      // 解析 URL
      const url = new URL(targetAPI);
      const protocol = url.protocol === 'https:' ? https : http;
      
      // 获取请求体
      let body = '';
      if (typeof request.body === 'string') {
        body = request.body;
      } else if (Buffer.isBuffer(request.body)) {
        body = request.body.toString('utf8');
      } else if (typeof request.body === 'object') {
        body = JSON.stringify(request.body);
      }

      // 发起代理请求
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      };

      const proxyReq = protocol.request(options, (proxyRes) => {
        let data = '';

        proxyRes.on('data', (chunk) => {
          data += chunk;
        });

        proxyRes.on('end', () => {
          response.setStatusCode(proxyRes.statusCode);
          response.setHeaders(corsHeaders);
          response.send(data);
        });
      });

      proxyReq.on('error', (error) => {
        console.error('Proxy request error:', error);
        response.setStatusCode(500);
        response.setHeaders(corsHeaders);
        response.send(JSON.stringify({ 
          error: 'Failed to fetch data from backend', 
          details: error.message 
        }));
      });

      proxyReq.write(body);
      proxyReq.end();

    } catch (error) {
      console.error('Handler error:', error);
      response.setStatusCode(500);
      response.setHeaders(corsHeaders);
      response.send(JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }));
    }
  } else {
    response.setStatusCode(405);
    response.setHeaders(corsHeaders);
    response.send(JSON.stringify({ error: 'Method not allowed' }));
  }
};
