import { useState } from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import TopicForm from './components/TopicForm';
import TopicResults from './components/TopicResults';
import type { TopicRequest, TopicResponse } from './types';
import { fetchTopicData } from './services/api';

function App() {
  const [results, setResults] = useState<TopicResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (request: TopicRequest) => {
    setIsLoading(true);
    try {
      const data = await fetchTopicData(request);
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-200/30 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Blue+ · 全域内容营销系统
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="space-y-8">
          {/* Search Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-100/50 p-1 border border-white"
          >
            <div className="bg-white rounded-xl p-6">
              <TopicForm onSubmit={handleSearch} isLoading={isLoading} />
            </div>
          </motion.div>

          {/* Results Section */}
          <div className="min-h-[400px]">
            {results ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TopicResults data={results} />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center h-[400px]"
              >
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="mb-6 bg-white p-4 rounded-full shadow-sm"
                >
                  <Sparkles className="w-12 h-12 text-indigo-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">准备开始探索</h3>
                <p className="text-gray-500 max-w-md">
                  选择目标平台并输入核心关键词，AI 将为您挖掘最具潜力的蓝海话题。
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
