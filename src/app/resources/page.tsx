'use client';

import { useState, useMemo } from 'react';
import { Search, Sparkles, Globe, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { resourceCategories, resources, type Resource } from '@/lib/resources';

// 预定义的图标组件映射
const IconComponents: Record<string, any> = {
  Sparkles, Globe
};

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  // 使用 useMemo 缓存过滤结果
  const filteredResources = useMemo(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return resources.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    if (activeCategory === 'all') return resources;
    return resources.filter(r => r.category === activeCategory);
  }, [activeCategory, searchQuery]);

  // 获取分类信息
  const getCategoryInfo = (categoryId: string) => {
    return resourceCategories.find(c => c.id === categoryId);
  };

  // 获取该分类实际资源数
  const getActualCount = (categoryId: string) => {
    return resources.filter(r => r.category === categoryId).length;
  };

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* 背景光效 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <Navbar />
      
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">AI 资源导航</h1>
          <p className="text-sm text-slate-400">{resources.length} 个精选资源，{resourceCategories.length} 个分类</p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="搜索资源..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 py-5 rounded-xl bg-slate-900/80 border-slate-700/50 text-white text-sm"
            />
          </div>
        </div>

        {/* 分类导航 - 全部分类显示 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">分类筛选</span>
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {showAllCategories ? (
                <>收起 <ChevronUp className="h-3 w-3" /></>
              ) : (
                <>展开全部 <ChevronDown className="h-3 w-3" /></>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                activeCategory === 'all' && !searchQuery
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
              )}
            >
              全部 ({resources.length})
            </button>
            {resourceCategories.map((cat) => {
              const actualCount = getActualCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    activeCategory === cat.id && !searchQuery
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                  )}
                  title={cat.description}
                >
                  {cat.name} ({actualCount})
                </button>
              );
            })}
          </div>
        </div>

        {/* 资源统计 */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
          <span>共 {filteredResources.length} 个资源</span>
          <div className="flex gap-3">
            <span className="text-emerald-400">{resources.filter(r => r.type === 'free').length} 免费</span>
            <span className="text-red-400">{resources.filter(r => r.hot).length} 热门</span>
          </div>
        </div>

        {/* 资源列表 - 全部显示 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredResources.map((resource) => {
            const catInfo = getCategoryInfo(resource.category);
            return (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={cn(
                    'flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br text-white text-xs',
                    catInfo?.color || 'from-indigo-500 to-purple-500'
                  )}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex gap-1">
                    {resource.hot && (
                      <span className="text-red-400 text-[10px]">🔥</span>
                    )}
                    <span className={cn(
                      'text-[10px] px-1 rounded',
                      resource.type === 'premium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    )}>
                      {resource.type === 'free' ? '免费' : '付费'}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white mb-1 truncate group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                  {resource.title}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                  {resource.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-full bg-slate-700/50 text-slate-400',
                  )}>
                    {catInfo?.name}
                  </span>
                  {resource.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            );
          })}
        </div>

        {/* 空状态 */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">未找到相关资源</p>
            <Button 
              variant="link" 
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="text-indigo-400 text-sm"
            >
              清除筛选
            </Button>
          </div>
        )}

        {/* 分类概览卡片 */}
        {activeCategory === 'all' && !searchQuery && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-white mb-3">分类概览</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {resourceCategories.map((cat) => {
                const actualCount = getActualCount(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 text-left transition-all"
                  >
                    <div className={cn(
                      'h-6 w-6 rounded-md bg-gradient-to-br mb-1 flex items-center justify-center',
                      cat.color || 'from-indigo-500 to-purple-500'
                    )}>
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-xs text-white truncate">{cat.name}</p>
                    <p className="text-[10px] text-slate-500">{actualCount} 个资源</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
