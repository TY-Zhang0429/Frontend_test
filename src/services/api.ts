import type { TopicRequest, TopicResponse, ZhihuTopicRequest } from '../types';

// API endpoints
const DOUYIN_XHS_API = 'https://popularzer-blue-uvpzmhjoqt.cn-shanghai.fcapp.run/';
const ZHIHU_API = 'https://popularzer-blue-ktsnmowhtm.cn-shanghai.fcapp.run/';

function isZhihuRequest(request: TopicRequest): request is ZhihuTopicRequest {
  return 'domain' in request || !('platform' in request);
}

export const fetchTopicData = async (request: TopicRequest): Promise<TopicResponse> => {
  // Determine which API to use
  const isZhihu = isZhihuRequest(request);
  const targetAPI = isZhihu ? ZHIHU_API : DOUYIN_XHS_API;
  
  // Direct API call without proxy
  console.log('Direct API call to:', targetAPI);
  
  try {
    const response = await fetch(targetAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
