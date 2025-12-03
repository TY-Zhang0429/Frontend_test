import type { TopicRequest, TopicResponse, DouyinTopicRequest, ZhihuTopicRequest } from '../types';

// API endpoints
const DOUYIN_XHS_API = 'https://popularzer-blue-uvpzmhjoqt.cn-shanghai.fcapp.run/';
const ZHIHU_API = 'https://popularzer-blue-ktsnmowhtm.cn-shanghai.fcapp.run/';
const VERCEL_PROXY = 'https://seo-topic-analyzer.vercel.app/api/proxy';

function isZhihuRequest(request: TopicRequest): request is ZhihuTopicRequest {
  return 'domain' in request || !('platform' in request);
}

export const fetchTopicData = async (request: TopicRequest): Promise<TopicResponse> => {
  // Determine which API to use
  const isZhihu = isZhihuRequest(request);
  const targetAPI = isZhihu ? ZHIHU_API : DOUYIN_XHS_API;
  
  // Use Vite proxy in development, Vercel proxy in production
  const apiURL = import.meta.env.DEV ? '/api/' : VERCEL_PROXY;
  
  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Target-API': targetAPI, // Pass target API to Vercel proxy
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
