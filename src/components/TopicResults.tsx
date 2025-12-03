import React, { useMemo } from 'react';
import { FileText, TrendingUp, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TopicResponse, DouyinTopicResponse, ZhihuTopicResponse } from '../types';

interface TopicResultsProps {
  data: TopicResponse;
}

const TopicResults: React.FC<TopicResultsProps> = ({ data }) => {
  // Check if this is Zhihu data
  const isZhihu = 'questions' in data;
  
  // Combine all zones into one list for the table view (Douyin/XHS)
  const allItems = useMemo(() => {
    if (isZhihu) return [];
    const douyinData = data as DouyinTopicResponse;
    return [
      ...douyinData.zones.blue_ocean_zone,
      ...douyinData.zones.stable_long_tail_zone,
      ...douyinData.zones.red_ocean_zone
    ];
  }, [data, isZhihu]);

  const zhihuQuestions = useMemo(() => {
    if (!isZhihu) return [];
    return (data as ZhihuTopicResponse).questions;
  }, [data, isZhihu]);

  const getCompetitionBadge = (level: number) => {
    switch (level) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            低竞争
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            <TrendingUp className="w-3 h-3" />
            中竞争
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            高竞争
          </span>
        );
      default:
        return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">未知</span>;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Render Zhihu questions
  if (isZhihu) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-100/50 border border-white overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">知乎话题分析</h3>
              <p className="text-sm text-gray-500">共挖掘到 <span className="font-semibold text-indigo-600">{zhihuQuestions.length}</span> 个热门问题</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                  <input type="checkbox" className="rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1] w-4 h-4 cursor-pointer" />
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  问题标题
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  总浏览量
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  30日增长
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  热度分数
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  预估报价
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <motion.tbody 
              variants={container}
              initial="hidden"
              animate="show"
              className="bg-white divide-y divide-gray-50"
            >
              {zhihuQuestions.map((question, index) => (
                <motion.tr 
                  key={index} 
                  variants={item}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1] w-4 h-4 cursor-pointer" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{question.title}</div>
                      {question.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {question.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-600 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-mono">{question.metrics.pv_total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-emerald-600 font-mono">+{question.metrics.pv_30_growth}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{question.score.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">/ 100</span>
                      </div>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(question.score, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full rounded-full ${
                            question.score > 60 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 
                            question.score > 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                            'bg-gradient-to-r from-rose-400 to-rose-500'
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-mono">{question.seo_price_display}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <motion.a 
                      href={question.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-indigo-600 hover:text-indigo-700 flex items-center justify-end gap-1.5 ml-auto px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      查看问题
                    </motion.a>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  // Render Douyin/XHS results
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-100/50 border border-white overflow-hidden"
    >
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">SEO投放分析</h3>
            <p className="text-sm text-gray-500">共挖掘到 <span className="font-semibold text-indigo-600">{allItems.length}</span> 个潜在话题</p>
          </div>
        </div>
        <div className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          请勾选需要投放的关键词
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                <input type="checkbox" className="rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1] w-4 h-4 cursor-pointer" />
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                关键词
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                7日均指
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                竞争度
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                推荐指数
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                预估报价(TOP10)
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <motion.tbody 
            variants={container}
            initial="hidden"
            animate="show"
            className="bg-white divide-y divide-gray-50"
          >
            {allItems.map((dataItem, index) => (
              <motion.tr 
                key={index} 
                variants={item}
                className="hover:bg-indigo-50/30 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1] w-4 h-4 cursor-pointer" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{dataItem.keyword}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 font-mono">{dataItem.mounth_search_index.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getCompetitionBadge(dataItem.competition)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{(dataItem.roi_score * 10).toFixed(0)}</span>
                      <span className="text-xs text-gray-400">/ 100</span>
                    </div>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(dataItem.roi_score * 20, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${
                          dataItem.roi_score > 3 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 
                          dataItem.roi_score > 1.5 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                          'bg-gradient-to-r from-rose-400 to-rose-500'
                        }`}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 font-mono">$ {dataItem.pricing_info.top10_1.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-indigo-600 hover:text-indigo-700 flex items-center justify-end gap-1.5 ml-auto px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    AI创作
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TopicResults;
