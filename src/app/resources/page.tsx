'use client';

import { useState } from 'react';
import { Search, Filter, Sparkles, Code, Image, Video, FileText, BookOpen, Database, FolderGit2, ExternalLink, Lock, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// 完整的资源分类
const resourceCategories = [
  { 
    id: 'all', 
    name: '全部', 
    icon: Sparkles, 
    count: 128,
    color: 'from-indigo-500 to-purple-500'
  },
  { 
    id: 'tools', 
    name: 'AI工具', 
    icon: Sparkles, 
    count: 45,
    color: 'from-indigo-500 to-blue-500'
  },
  { 
    id: 'courses', 
    name: 'AI课程', 
    icon: BookOpen, 
    count: 32,
    color: 'from-emerald-500 to-teal-500'
  },
  { 
    id: 'papers', 
    name: 'AI论文', 
    icon: FileText, 
    count: 28,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'videos', 
    name: '视频教程', 
    icon: Video, 
    count: 25,
    color: 'from-red-500 to-pink-500'
  },
  { 
    id: 'programming', 
    name: 'AI编程', 
    icon: Code, 
    count: 18,
    color: 'from-slate-500 to-slate-600'
  },
  { 
    id: 'image', 
    name: 'AI绘画', 
    icon: Image, 
    count: 22,
    color: 'from-amber-500 to-orange-500'
  },
  { 
    id: 'prompts', 
    name: '提示词', 
    icon: TrendingUp, 
    count: 35,
    color: 'from-cyan-500 to-blue-500'
  },
  { 
    id: 'datasets', 
    name: '数据集', 
    icon: Database, 
    count: 15,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'opensource', 
    name: '开源项目', 
    icon: FolderGit2, 
    count: 20,
    color: 'from-green-500 to-emerald-500'
  },
];

// 示例资源数据
const mockResources = [
  {
    id: '1',
    title: 'ChatGPT 中文调教指南',
    description: '最全的ChatGPT使用技巧和prompts集合，包含100+实用场景',
    category: 'prompts',
    type: 'free',
    hot: true,
    rating: 4.9,
    views: 25800,
  },
  {
    id: '2',
    title: 'Midjourney V6 进阶教程',
    description: '从入门到精通的Midjourney完整课程，附带商业应用案例',
    category: 'image',
    type: 'premium',
    hot: true,
    rating: 4.8,
    views: 18600,
  },
  {
    id: '3',
    title: 'Claude 3 API 官方文档',
    description: 'Anthropic官方API文档和SDK使用指南',
    category: 'programming',
    type: 'free',
    hot: false,
    rating: 4.7,
    views: 12500,
  },
  {
    id: '4',
    title: 'Stable Diffusion WebUI 本地部署教程',
    description: 'Windows/Linux/Mac全平台本地部署SD的详细步骤',
    category: 'image',
    type: 'free',
    hot: true,
    rating: 4.9,
    views: 34200,
  },
  {
    id: '5',
    title: 'LLM大模型技术原理课程',
    description: '深入理解GPT/BERT/LLaMA等模型的原理和训练方法',
    category: 'courses',
    type: 'premium',
    hot: false,
    rating: 4.6,
    views: 8900,
  },
  {
    id: '6',
    title: '2024年AI论文必读清单',
    description: '精选50篇必读的AI领域顶级论文，含中文解读',
    category: 'papers',
    type: 'free',
    hot: true,
    rating: 4.8,
    views: 15600,
  },
  {
    id: '7',
    title: 'Cursor AI 编程实战课',
    description: '使用Cursor AI提升10倍编程效率的实战教程',
    category: 'programming',
    type: 'premium',
    hot: false,
    rating: 4.7,
    views: 7200,
  },
  {
    id: '8',
    title: 'B站AI绘画UP主推荐',
    description: '精选20位高质量AI绘画教程UP主，每周更新',
    category: 'videos',
    type: 'free',
    hot: false,
    rating: 4.5,
    views: 9800,
  },
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = mockResources.filter(resource => {
    const matchCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* 背景光效 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <Navbar />
      
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI 资源库</h1>
          <p className="text-slate-400">发现最优质的AI工具、课程、论文和开源项目</p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              type="search"
              placeholder="搜索资源..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-xl bg-slate-900/80 border-slate-700/50 text-white placeholder-slate-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 分类导航 */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {resourceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                )}
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
                <Badge variant="secondary" className={cn(
                  'ml-1 text-[10px]',
                  activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
                )}>
                  {cat.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* 资源列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <Card 
              key={resource.id} 
              className="group glass border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden"
            >
              <CardHeader className="relative pb-2">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    'flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br text-white',
                    resourceCategories.find(c => c.id === resource.category)?.color || 'from-indigo-500 to-purple-500'
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
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" />
                      {resource.rating}
                    </span>
                    <span>{resource.views.toLocaleString()} 阅读</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-400 group-hover:text-indigo-300">
                    查看详情
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 空状态 */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="h-12 w-12 text-slate-600 mx-auto mb-4" />
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
      </main>
    </div>
  );
}
