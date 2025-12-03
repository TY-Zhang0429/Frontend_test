// 阿里云函数计算代理函数（HTTP 触发器）
const https = require('https');
const http = require('http');

exports.handler = (req, resp, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Target-API',
    'Content-Type': 'application/json',
  };

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (req.method === 'POST') {
    return new Promise((resolve, reject) => {
      // 设置总超时
      const timeout = setTimeout(() => {
        console.error('Function timeout');
        resolve({
          statusCode: 504,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Gateway timeout' }),
        });
      }, 55000); // 55秒超时

      try {
        // 获取目标 API
        const headers = req.headers || {};
        const targetAPI = headers['x-target-api'] || headers['X-Target-API'] || 
          'https://popularzer-blue-uvpzmhjoqt.cn-shanghai.fcapp.run/';
        
        console.log('Proxying to:', targetAPI);
        console.log('Request body type:', typeof req.body);
        
        // 解析 URL
        const url = new URL(targetAPI);
        const protocol = url.protocol === 'https:' ? https : http;
        
        // 获取请求体 - 阿里云会自动解析 JSON
        let body = '';
        if (req.body) {
          if (typeof req.body === 'string') {
            body = req.body;
          } else if (Buffer.isBuffer(req.body)) {
            body = req.body.toString('utf8');
          } else if (typeof req.body === 'object') {
            body = JSON.stringify(req.body);
          }
        }
        
        console.log('Request body:', body.substring(0, 200));

        // 发起代理请求
        const options = {
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: url.pathname + url.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
          timeout: 50000, // 50秒超时
        };

        const proxyReq = protocol.request(options, (proxyRes) => {
          console.log('Got response, status:', proxyRes.statusCode);
          let data = '';

          proxyRes.on('data', (chunk) => {
            data += chunk;
          });

          proxyRes.on('end', () => {
            clearTimeout(timeout);
            console.log('Response complete, length:', data.length);
            resolve({
              statusCode: 200,
              headers: corsHeaders,
              body: data,
            });
          });
        });

        proxyReq.on('timeout', () => {
          clearTimeout(timeout);
          proxyReq.destroy();
          console.error('Proxy request timeout');
          resolve({
            statusCode: 504,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Backend timeout' }),
          });
        });

        proxyReq.on('error', (error) => {
          clearTimeout(timeout);
          console.error('Proxy request error:', error);
          resolve({
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ 
              error: 'Failed to fetch data from backend', 
              details: error.message 
            }),
          });
        });

        proxyReq.write(body);
        proxyReq.end();

      } catch (error) {
        clearTimeout(timeout);
        console.error('Handler error:', error);
        resolve({
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: 'Internal server error', 
            details: error.message 
          }),
        });
      }
    });
  } else {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }
};
