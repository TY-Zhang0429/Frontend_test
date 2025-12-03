// Douyin/XHS Request
export interface DouyinTopicRequest {
  keyword: string;
  platform: 'xhs' | 'douyin';
  limit?: number;
  page?: number;
  sort?: string;
  order?: string;
  min_growth_rate?: number;
  min_monthly_coverage?: number;
  output_count?: number;
}

// Zhihu Request
export interface ZhihuTopicRequest {
  keyword: string;
  domain?: string | string[];
}

export type TopicRequest = DouyinTopicRequest | ZhihuTopicRequest;

export interface PricingInfo {
  top10_1: number;
  top10_2: number;
  top10_3: number;
  top10_4: number;
  top20_2: number;
  top20_4: number;
  top20_6: number;
  top20_8: number;
}

export interface ZoneItem {
  mounth_search_index: number;
  competition: number;
  keyword_length: number;
  sug_keyword_count: number;
  record: string;
  keyword: string;
  add_rate: number;
  roi_score: number;
  roi_tags: string[];
  pricing_info: PricingInfo;
}

export interface Zones {
  blue_ocean_zone: ZoneItem[];
  stable_long_tail_zone: ZoneItem[];
  red_ocean_zone: ZoneItem[];
}

export interface Summary {
  total_candidates: number;
  counts: {
    blue_ocean_zone: number;
    stable_long_tail_zone: number;
    red_ocean_zone: number;
  };
}

export interface Meta {
  root_keyword: string;
  ai_suggestions: string[];
  process_time: string;
}

// Douyin/XHS Response
export interface DouyinTopicResponse {
  ret: number;
  msg: string;
  meta: Meta;
  summary: Summary;
  zones: Zones;
  settlement_standard: string;
}

// Zhihu Question
export interface ZhihuQuestion {
  title: string;
  url: string;
  score: number;
  seo_price: number;
  seo_price_display: string;
  metrics: {
    pv_total: string;
    pv_30_growth: string;
    top3_likes: number;
    top1_likes: number;
  };
  tags: string[];
}

// Zhihu Response
export interface ZhihuTopicResponse {
  ret: number;
  msg: string;
  meta: {
    root_keyword: string;
    domain_filter?: string;
    ai_matrix: string[];
    total_analyzed: number;
    time_cost: string;
  };
  questions: ZhihuQuestion[];
}

export type TopicResponse = DouyinTopicResponse | ZhihuTopicResponse;
