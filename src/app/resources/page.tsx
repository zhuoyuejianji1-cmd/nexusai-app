'use client';

import { useState, useMemo } from 'react';
import { Search, Sparkles, Globe } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { resourceCategories, resources, type Resource } from '@/lib/resources';

// 预定义的图标组件映射（按需加载）
const IconComponents: Record<string, any> = {
  Sparkles, Globe
};

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    return resourceCategories.find(c => c.id === categoryId) || 
      resourceCategories.find(c => c.name === categoryId);
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

        {/* 分类导航 - 简化版 */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              activeCategory === 'all' && !searchQuery
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            )}
          >
            全部 ({resources.length})
          </button>
          {resourceCategories.slice(0, 10).map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                activeCategory === cat.id && !searchQuery
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              )}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
          {activeCategory !== 'all' && !searchQuery && (
            <span className="px-3 py-1.5 text-xs text-slate-500">
              已选: {getCategoryInfo(activeCategory)?.name}
            </span>
          )}
        </div>

        {/* 资源统计 */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
          <span>共 {filteredResources.length} 个资源</span>
          <div className="flex gap-2">
            <span className="text-emerald-400">{resources.filter(r => r.type === 'free').length} 免费</span>
            <span className="text-amber-400">{resources.filter(r => r.type === 'premium').length} 付费</span>
            <span className="text-red-400">{resources.filter(r => r.hot).length} 热门</span>
          </div>
        </div>

        {/* 资源列表 - 初始只显示热门资源 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {(searchQuery ? filteredResources : filteredResources.filter(r => r.hot).slice(0, 16)).map((resource) => {
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
                <h3 className="text-sm font-medium text-white mb-1 truncate group-hover:text-indigo-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {resource.description}
                </p>
              </a>
            );
          })}
        </div>

        {/* 加载更多提示 */}
        {filteredResources.length > 24 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              显示前 24 个资源，共 {filteredResources.length} 个
            </p>
            <p className="text-xs text-slate-600 mt-1">
              点击资源卡片可直接访问原网站
            </p>
          </div>
        )}

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

        {/* 更多分类 */}
        {activeCategory === 'all' && !searchQuery && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-white mb-3">更多分类</h3>
            <div className="flex flex-wrap gap-2">
              {resourceCategories.slice(10).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
