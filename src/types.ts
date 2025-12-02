export interface TopicRequest {
  keyword: string;
  platform: string;
  limit: number;
  page: number;
  sort: string;
  order: string;
  min_growth_rate: number;
  min_monthly_coverage: number;
  output_count: number;
}

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

export interface TopicResponse {
  ret: number;
  msg: string;
  meta: Meta;
  summary: Summary;
  zones: Zones;
  settlement_standard: string;
}
