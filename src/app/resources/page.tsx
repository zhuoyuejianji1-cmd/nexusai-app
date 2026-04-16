'use client';

import { useState } from 'react';
import { Search, Sparkles, Code, Image, Video, FileText, BookOpen, Database, FolderGit2, ExternalLink, Lock, Star, TrendingUp, Music, MessageSquare, Tv, Clapperboard, Film, Gamepad2, Cpu, Headphones, Music2, Radio, GraduationCap, Download, Wrench, Cloud, Play, Globe } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { resourceCategories, resources, getResourcesByCategory, searchResources, type Resource } from '@/lib/resources';

// 图标映射
const iconMap: Record<string, any> = {
  Sparkles, Code, Image, Video, FileText, BookOpen, Database, FolderGit2,
  ExternalLink, Lock, Star, TrendingUp, Music, MessageSquare, Tv, Clapperboard,
  Film, Gamepad2, Cpu, Headphones, Music2, Radio, GraduationCap, Download,
  Wrench, Cloud, Play, Globe
};

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 过滤资源
  const filteredResources = searchQuery 
    ? searchResources(searchQuery)
    : getResourcesByCategory(activeCategory);

  // 获取分类名称
  const getCategoryName = (categoryId: string) => {
    const cat = resourceCategories.find(c => c.id === categoryId);
    return cat?.name || categoryId;
  };

  // 获取分类颜色
  const getCategoryColor = (categoryId: string) => {
    const cat = resourceCategories.find(c => c.id === categoryId);
    return cat?.color || 'from-indigo-500 to-purple-500';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI 资源导航</h1>
          <p className="text-slate-400">从 fmhy.net 精选的优质资源，包含 AI工具、视频、游戏、阅读等分类</p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              type="search"
              placeholder="搜索资源..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-xl bg-slate-900/80 border-slate-700/50 text-white placeholder-slate-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-indigo-500/20 text-white' : 'text-slate-400'}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-indigo-500/20 text-white' : 'text-slate-400'}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* 分类导航 */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeCategory === 'all' && !searchQuery
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
              )}
            >
              <Globe className="h-4 w-4" />
              全部
              <Badge variant="secondary" className={cn(
                'ml-1 text-[10px]',
                activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
              )}>
                {resources.length}
              </Badge>
            </button>
            {resourceCategories.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Sparkles;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    activeCategory === cat.id && !searchQuery
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  {cat.name}
                  <Badge variant="secondary" className={cn(
                    'ml-1 text-[10px]',
                    activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
                  )}>
                    {cat.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* 分类描述 */}
        {!searchQuery && activeCategory !== 'all' && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br text-white',
                getCategoryColor(activeCategory)
              )}>
                {(() => {
                  const cat = resourceCategories.find(c => c.id === activeCategory);
                  const IconComponent = iconMap[cat?.icon || 'Sparkles'];
                  return <IconComponent className="h-5 w-5" />;
                })()}
              </div>
              <div>
                <h3 className="text-white font-medium">{getCategoryName(activeCategory)}</h3>
                <p className="text-sm text-slate-400">
                  {resourceCategories.find(c => c.id === activeCategory)?.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 资源列表 - 网格视图 */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <Card 
                key={resource.id} 
                className="group glass border-slate-700/50 hover:border-indigo-500/50 transition-all overflow-hidden"
              >
                <CardHeader className="relative pb-2">
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      'flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br text-white',
                      getCategoryColor(resource.category)
                    )}>
                      {resource.type === 'premium' ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.hot && (
                        <Badge className="bg-red-500/20 text-red-400 border-0 text-[10px]">
                          🔥 热门
                        </Badge>
                      )}
                      <Badge className={cn(
                        'text-[10px]',
                        resource.type === 'premium' 
                          ? 'bg-amber-500/20 text-amber-400 border-0' 
                          : 'bg-emerald-500/20 text-emerald-400 border-0'
                      )}>
                        {resource.type === 'premium' ? '付费' : '免费'}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-base font-semibold text-white mt-3 line-clamp-1">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                    {resource.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400" />
                        {resource.rating}
                      </span>
                      <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-400">
                        {getCategoryName(resource.category)}
                      </Badge>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      访问
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 资源列表 - 列表视图 */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {filteredResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 transition-all group"
              >
                <div className={cn(
                  'flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br text-white shrink-0',
                  getCategoryColor(resource.category)
                )}>
                  {resource.type === 'premium' ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium truncate">{resource.title}</h3>
                    {resource.hot && (
                      <Badge className="bg-red-500/20 text-red-400 border-0 text-[10px] shrink-0">
                        🔥
                      </Badge>
                    )}
                    <Badge className={cn(
                      'text-[10px] shrink-0',
                      resource.type === 'premium' 
                        ? 'bg-amber-500/20 text-amber-400 border-0' 
                        : 'bg-emerald-500/20 text-emerald-400 border-0'
                    )}>
                      {resource.type === 'premium' ? '付费' : '免费'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 truncate">{resource.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="flex items-center gap-1 text-sm text-slate-400">
                    <Star className="h-4 w-4 text-amber-400" />
                    {resource.rating}
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <Globe className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">未找到相关资源</p>
            <Button 
              variant="link" 
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="text-indigo-400"
            >
              清除筛选
            </Button>
          </div>
        )}

        {/* 统计信息 */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <div className="flex flex-wrap justify-around gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{resources.length}+</div>
              <div className="text-sm text-slate-400">精选资源</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{resourceCategories.length}</div>
              <div className="text-sm text-slate-400">资源分类</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{resources.filter(r => r.type === 'free').length}</div>
              <div className="text-sm text-slate-400">免费资源</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{resources.filter(r => r.hot).length}</div>
              <div className="text-sm text-slate-400">热门推荐</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
