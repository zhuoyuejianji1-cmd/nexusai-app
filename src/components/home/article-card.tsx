'use client';

import { Heart, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber, truncateText, cn } from '@/lib/utils';
import { UserAvatar } from '@/components/common/user-avatar';

interface Article {
  id: string;
  title: string;
  summary: string;
  cover_url?: string;
  author: {
    nickname: string;
    avatar_url?: string;
  };
  likes: number;
  views: number;
  category: string;
}

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: '1',
    title: '如何在 30 天内从零基础到熟练使用 AI 工具',
    summary: '本文分享了我作为一个产品经理，如何在 30 天内系统学习并熟练使用各类 AI 工具的经验，包括 ChatGPT、Midjourney、Notion AI 等。',
    cover_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format',
    author: { nickname: 'AI探险家', avatar_url: '' },
    likes: 2340,
    views: 15600,
    category: '学习指南',
  },
  {
    id: '2',
    title: 'Claude vs GPT-4：深度对比测评',
    summary: '从多个维度对比了 Claude 和 GPT-4 的能力表现，包括写作、编程、推理等方面。',
    cover_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format',
    author: { nickname: '技术观察员', avatar_url: '' },
    likes: 1890,
    views: 12300,
    category: '深度测评',
  },
  {
    id: '3',
    title: 'Prompt Engineering 进阶技巧',
    summary: '深入探讨如何编写更有效的 Prompt，包括 Chain of Thought、Few-shot 等高级技巧。',
    cover_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format',
    author: { nickname: 'AI研究者', avatar_url: '' },
    likes: 3200,
    views: 21000,
    category: '技术教程',
  },
  {
    id: '4',
    title: 'AI 绘图工具完全指南',
    summary: '全面介绍当前主流的 AI 绘图工具，包括 Midjourney、Stable Diffusion、DALL-E 3 等。',
    cover_url: 'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=800&auto=format',
    author: { nickname: '创意设计师', avatar_url: '' },
    likes: 1560,
    views: 9800,
    category: '工具评测',
  },
  {
    id: '5',
    title: '用 AI 自动化你的工作流',
    summary: '分享如何利用 AI 工具打造高效的自动化工作流，提升 300% 的工作效率。',
    cover_url: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&auto=format',
    author: { nickname: '效率达人', avatar_url: '' },
    likes: 2780,
    views: 18400,
    category: '效率提升',
  },
  {
    id: '6',
    title: '大语言模型原理浅析',
    summary: '用通俗易懂的语言解释 Transformer、Attention 机制等核心概念。',
    cover_url: 'https://images.unsplash.com/photo-1627384113710-424c9181ebbb?w=800&auto=format',
    author: { nickname: '学术派', avatar_url: '' },
    likes: 4100,
    views: 28500,
    category: '原理解析',
  },
];

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Card className={cn(
      'bg-card/50 border-border/50 hover-lift overflow-hidden group',
      featured && 'md:col-span-2'
    )}>
      {article.cover_url && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.cover_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary">
            {article.category}
          </Badge>
        </div>
      )}
      <CardContent className={cn('p-4', !article.cover_url && 'pt-4')}>
        <h3 className={cn(
          'font-heading font-bold leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors',
          featured ? 'text-lg' : 'text-base'
        )}>
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {truncateText(article.summary, featured ? 120 : 80)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserAvatar
            name={article.author.nickname}
            avatarUrl={article.author.avatar_url}
            size="sm"
          />
          <span className="text-sm text-muted-foreground">
            {article.author.nickname}
          </span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1 text-xs">
            <Heart className="h-3.5 w-3.5" />
            {formatNumber(article.likes)}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Eye className="h-3.5 w-3.5" />
            {formatNumber(article.views)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export function ArticleGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockArticles.map((article, index) => (
        <ArticleCard
          key={article.id}
          article={article}
          featured={index === 0}
        />
      ))}
    </div>
  );
}
