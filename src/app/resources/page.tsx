'use client';

import { useState } from 'react';
import { Search, Grid, List, Star, Eye, ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, categoryLabels, formatNumber } from '@/lib/utils';
import type { Resource } from '@/lib/types';

// 模拟资源数据
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'ChatGPT - OpenAI 官方对话 AI',
    description: '最强大的对话 AI 系统，可以进行自然语言对话、写作、编程等多种任务。支持 GPT-4 模型，拥有强大的推理和创造力。',
    category: 'ai-tools',
    url: 'https://chat.openai.com',
    cover_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format',
    likes_count: 15420,
    views_count: 89000,
    created_at: '',
  },
  {
    id: '2',
    title: 'Claude 3.5 - Anthropic AI 助手',
    description: 'Anthropic 推出的最新 AI 助手，在代码生成、长文本理解等方面表现出色。支持处理长文档，提供更安全的 AI 交互。',
    category: 'ai-tools',
    url: 'https://claude.ai',
    cover_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format',
    likes_count: 12300,
    views_count: 67000,
    created_at: '',
  },
  {
    id: '3',
    title: 'Fast.ai - 深度学习课程',
    description: '由 Jeremy Howard 创建的免费深度学习课程，以实践为导向，专注于让 AI 学习变得简单易懂。',
    category: 'tutorial',
    url: 'https://fast.ai',
    cover_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format',
    likes_count: 8900,
    views_count: 45000,
    created_at: '',
  },
  {
    id: '4',
    title: 'Attention Is All You Need',
    description: 'Transformer 架构的开创性论文，奠定了现代大语言模型的基础。必读的 AI 领域经典文献。',
    category: 'paper',
    url: 'https://arxiv.org/abs/1706.03762',
    cover_url: 'https://images.unsplash.com/photo-1627384113710-424c9181ebbb?w=400&auto=format',
    likes_count: 6700,
    views_count: 32000,
    created_at: '',
  },
  {
    id: '5',
    title: 'Andrej Karpathy 的深度学习教程',
    description: '斯坦福大学博士、OpenAI 创始成员分享的深度学习和神经网络教程，深入浅出，适合初学者。',
    category: 'video',
    url: 'https://www.youtube.com/@AndrejKarpathy',
    cover_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&auto=format',
    likes_count: 11200,
    views_count: 58000,
    created_at: '',
  },
  {
    id: '6',
    title: 'ImageNet 数据集',
    description: '全球最大的图像分类数据集之一，包含超过 1400 万张标注图像，是深度学习图像领域的重要基准。',
    category: 'dataset',
    url: 'https://www.image-net.org',
    cover_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format',
    likes_count: 4500,
    views_count: 23000,
    created_at: '',
  },
  {
    id: '7',
    title: 'LangChain - AI 应用开发框架',
    description: '开源的 AI 应用开发框架，简化了构建 LLM 应用的流程，支持链式调用、记忆模块、工具集成等。',
    category: 'open-source',
    url: 'https://langchain.com',
    cover_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&auto=format',
    likes_count: 9800,
    views_count: 52000,
    created_at: '',
  },
  {
    id: '8',
    title: 'Midjourney - AI 绘图工具',
    description: '强大的 AI 图像生成工具，通过文字描述即可生成精美的艺术作品。支持多种风格和参数调节。',
    category: 'ai-tools',
    url: 'https://midjourney.com',
    cover_url: 'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=400&auto=format',
    likes_count: 18900,
    views_count: 95000,
    created_at: '',
  },
];

const categories = [
  { value: 'all', label: '全部' },
  { value: 'ai-tools', label: 'AI工具' },
  { value: 'tutorial', label: '教程' },
  { value: 'paper', label: '论文' },
  { value: 'video', label: '视频' },
  { value: 'dataset', label: '数据集' },
  { value: 'open-source', label: '开源项目' },
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredResources = mockResources
    .filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.likes_count - a.likes_count;
      if (sortBy === 'recent') return b.views_count - a.views_count;
      return 0;
    });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen gradient-bg tech-grid relative">
      {/* 动态光效 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl aurora-glow" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl aurora-glow-delay" />
      </div>
      
      <Navbar />
      
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-heading text-3xl font-bold mb-2">
            <span className="gradient-text">AI 资源库</span>
          </h1>
          <p className="text-slate-400">
            发现和探索最优质的 AI 工具、教程、论文和开源项目
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 animate-fade-in-up delay-100">
          {/* Search & Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="search"
                placeholder="搜索资源..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 glass border-indigo-500/20 focus:border-indigo-500/50 bg-slate-900/50"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] glass border-indigo-500/20 bg-slate-900/50">
                  <SelectValue placeholder="排序" />
                </SelectTrigger>
                <SelectContent className="glass border-indigo-500/20">
                  <SelectItem value="popular">最受欢迎</SelectItem>
                  <SelectItem value="recent">最新最热</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border border-indigo-500/20 rounded-lg overflow-hidden glass">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'rounded-none h-9 w-9 text-slate-400',
                    viewMode === 'grid' && 'bg-indigo-500/20 text-indigo-400'
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'rounded-none h-9 w-9 text-slate-400',
                    viewMode === 'list' && 'bg-indigo-500/20 text-indigo-400'
                  )}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  'shrink-0 glass',
                  activeCategory === cat.value 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-0' 
                    : 'border-indigo-500/30 text-slate-400 hover:text-white hover:border-indigo-500/50'
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className={cn(
          'mb-6 text-sm text-slate-400',
          'animate-fade-in-up delay-200'
        )}>
          找到 <span className="font-semibold text-white">{filteredResources.length}</span> 个资源
        </div>

        {/* Resource Grid/List */}
        <div className={cn(
          'grid gap-4',
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1',
          'animate-fade-in-up delay-300'
        )}>
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              viewMode={viewMode}
              isFavorite={favorites.has(resource.id)}
              onToggleFavorite={() => toggleFavorite(resource.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl glass mb-4">
              <Search className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2 text-white">未找到资源</h3>
            <p className="text-slate-400">
              尝试调整搜索词或切换分类
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

interface ResourceCardProps {
  resource: Resource;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function ResourceCard({ resource, viewMode, isFavorite, onToggleFavorite }: ResourceCardProps) {
  if (viewMode === 'list') {
    return (
      <Card className="glass border-indigo-500/20 hover-lift card-glow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {resource.cover_url && (
              <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-800">
                <img
                  src={resource.cover_url}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold mb-1 line-clamp-1 text-white">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {resource.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleFavorite}
                  className={cn(
                    'shrink-0',
                    isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                  )}
                >
                  <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-400">
                  {categoryLabels[resource.category]}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Star className="h-3 w-3" />
                  {formatNumber(resource.likes_count)}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Eye className="h-3 w-3" />
                  {formatNumber(resource.views_count)}
                </span>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto"
                >
                  <Button size="sm" variant="outline" className="gap-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                    <ExternalLink className="h-3 w-3" />
                    访问
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-indigo-500/20 hover-lift overflow-hidden group card-glow">
      {resource.cover_url && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={resource.cover_url}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge className="bg-indigo-500/80 hover:bg-indigo-500 backdrop-blur-sm">
              {categoryLabels[resource.category]}
            </Badge>
          </div>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            <Button size="sm" className="gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25">
              <ExternalLink className="h-3 w-3" />
              访问
            </Button>
          </a>
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading font-bold line-clamp-1 flex-1 text-white group-hover:text-indigo-300 transition-colors">
            {resource.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className={cn(
              'shrink-0 h-8 w-8',
              isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
            )}
          >
            <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
          </Button>
        </div>
        <p className="text-sm text-slate-400 line-clamp-2">
          {resource.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center gap-4 text-slate-500">
        <span className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 text-amber-400" />
          {formatNumber(resource.likes_count)}
        </span>
        <span className="flex items-center gap-1 text-xs">
          <Eye className="h-3 w-3" />
          {formatNumber(resource.views_count)}
        </span>
      </CardFooter>
    </Card>
  );
}
