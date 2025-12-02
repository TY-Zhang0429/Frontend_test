import type { TopicRequest, TopicResponse } from '../types';

// Use Vite proxy in development, Vercel serverless function in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/' 
  : 'https://seo-topic-analyzer.vercel.app/api/proxy';

export const fetchTopicData = async (request: TopicRequest): Promise<TopicResponse> => {
  try {
    const response = await fetch(API_BASE_URL, {
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
