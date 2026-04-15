'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { News } from '@/lib/types';

// 模拟新闻数据
const mockNews: News[] = [
  {
    id: '1',
    title: 'GPT-5 即将发布：OpenAI 确认下一代模型训练完成',
    summary: 'OpenAI CEO Sam Altman 在开发者大会上确认 GPT-5 已完成训练，将在明年上半年向公众开放。新模型将具备更强的推理能力和多模态理解。',
    source: 'AI Weekly',
    url: '#',
    week_number: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Anthropic 发布 Claude 3.5 Opus，性能超越 GPT-4',
    summary: 'Anthropic 推出全新 Claude 3.5 系列模型，在多项基准测试中超越 GPT-4，特别是在代码生成和复杂推理任务上表现优异。',
    source: 'TechCrunch',
    url: '#',
    week_number: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Meta 开源 Llama 3.2：支持多模态能力的轻量级模型',
    summary: 'Meta 宣布开源 Llama 3.2 系列，包含 11B 和 90B 两个版本，首次在开源模型中实现图像理解和多模态推理能力。',
    source: 'VentureBeat',
    url: '#',
    week_number: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Google DeepMind 推出 AlphaCode 3，可独立完成完整项目',
    summary: 'DeepMind 发布 AlphaCode 3 新版本，能够根据自然语言描述独立完成整个软件项目的开发，包括代码生成、测试和部署。',
    source: 'The Verge',
    url: '#',
    week_number: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: '斯坦福研究：AI 助手让程序员效率提升 55%',
    summary: '斯坦福大学最新研究表明，使用 AI 编程助手的程序员平均工作效率提升 55%，代码质量也显著提高。',
    source: 'Stanford AI Lab',
    url: '#',
    week_number: 15,
    created_at: new Date().toISOString(),
  },
];

export function NewsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % mockNews.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + mockNews.length) % mockNews.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  return (
    <div 
      className="relative rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Gradient Border */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
      
      {/* Content */}
      <div className="relative bg-card rounded-2xl overflow-hidden">
        {/* News Item */}
        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="gap-1.5 border-primary/50 text-primary">
                  <Calendar className="h-3 w-3" />
                  第{current + 1}条
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {mockNews[current].source}
                </span>
              </div>
              
              <h3 className="font-heading text-xl md:text-2xl font-bold mb-3 leading-tight">
                {mockNews[current].title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed line-clamp-2">
                {mockNews[current].summary}
              </p>
              
              <a
                href={mockNews[current].url}
                className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary-light transition-colors"
              >
                <span className="text-sm font-medium">阅读全文</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-border/50">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {mockNews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === current
                    ? 'w-8 bg-primary'
                    : 'w-1.5 bg-muted hover:bg-muted-foreground/50'
                )}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
