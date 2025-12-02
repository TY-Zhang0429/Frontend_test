import type { TopicRequest, TopicResponse } from '../types';

// Use Vite proxy in development, direct API with no-cors in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/' 
  : 'https://popularzer-blue-uvpzmhjoqt.cn-shanghai.fcapp.run/';

export const fetchTopicData = async (request: TopicRequest): Promise<TopicResponse> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      ...(import.meta.env.PROD && { mode: 'cors' as RequestMode }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    // Fallback: try with CORS proxy if direct call fails
    if (import.meta.env.PROD) {
      try {
        const proxyResponse = await fetch('https://corsproxy.io/?' + encodeURIComponent(API_BASE_URL), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });
        if (proxyResponse.ok) {
          return await proxyResponse.json();
        }
      } catch (proxyError) {
        console.error("Proxy fallback also failed:", proxyError);
      }
    }
    throw error;
  }
};
