import React, { useState } from 'react';
import { Search, BookOpen, Video, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TopicRequest, DouyinTopicRequest, ZhihuTopicRequest } from '../types';

interface TopicFormProps {
  onSubmit: (request: TopicRequest) => void;
  isLoading: boolean;
}

interface FormState {
  keyword: string;
  platform: 'xhs' | 'douyin' | 'zhihu';
  domain?: string;
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormState>({
    keyword: "荣耀手机",
    platform: "xhs",
  });

  const handlePlatformChange = (platform: 'xhs' | 'douyin' | 'zhihu') => {
    setFormData(prev => ({ ...prev, platform }));
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, keyword: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build request based on platform
    let request: TopicRequest;
    if (formData.platform === 'zhihu') {
      request = {
        keyword: formData.keyword,
        domain: formData.domain,
      } as ZhihuTopicRequest;
    } else {
      request = {
        keyword: formData.keyword,
        platform: formData.platform,
        limit: 50,
        page: 0,
        sort: "mounth_search_index",
        order: "desc",
        min_growth_rate: 1,
        min_monthly_coverage: 1,
        output_count: 50,
      } as DouyinTopicRequest;
    }
    
    onSubmit(request);
  };

  const platforms = [
    { id: 'xhs' as const, name: '小红书', icon: BookOpen, color: 'text-[#FF2442]', activeBg: 'bg-white' },
    { id: 'douyin' as const, name: '抖音', icon: Video, color: 'text-black', activeBg: 'bg-white' },
    { id: 'zhihu' as const, name: '知乎', icon: MessageSquare, color: 'text-[#0066FF]', activeBg: 'bg-white' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Platform Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <span className="text-sm font-semibold text-gray-500 w-24 uppercase tracking-wider">营销平台</span>
        <div className="flex gap-2 bg-gray-100/80 p-1.5 rounded-xl backdrop-blur-sm">
          {platforms.map((p) => (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => handlePlatformChange(p.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                formData.platform === p.id
                  ? `${p.activeBg} ${p.color} shadow-sm ring-1 ring-black/5`
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              {formData.platform === p.id && (
                <motion.div
                  layoutId="activePlatform"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              )}
              <p.icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{p.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Keyword Input */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <span className="text-sm font-semibold text-gray-500 w-24 uppercase tracking-wider">核心词</span>
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={formData.keyword}
              onChange={handleKeywordChange}
              placeholder="输入关键词..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] outline-none transition-all text-lg group-hover:bg-white group-hover:shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#6366F1] transition-colors" />
          </div>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className={`px-8 py-3 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white rounded-xl font-medium hover:from-[#5558DD] hover:to-[#4338CA] transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 min-w-[160px] justify-center ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" 
                />
                <span>分析中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>一键挖掘</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default TopicForm;
