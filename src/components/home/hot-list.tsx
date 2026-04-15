'use client';

import { TrendingUp, TrendingDown, Minus, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { HotListItem } from '@/lib/types';

// 模拟热榜数据
const mockHotList: HotListItem[] = [
  { id: '1', name: 'ChatGPT-5', category: 'AI工具', heat_score: 9850, trend: 'up', created_at: '' },
  { id: '2', name: 'Claude 3.5', category: 'AI工具', heat_score: 8720, trend: 'up', created_at: '' },
  { id: '3', name: 'Midjourney V6', category: 'AI工具', heat_score: 7650, trend: 'stable', created_at: '' },
  { id: '4', name: 'Llama 3.2', category: '开源模型', heat_score: 6540, trend: 'up', created_at: '' },
  { id: '5', name: 'Sora', category: 'AI视频', heat_score: 5980, trend: 'down', created_at: '' },
  { id: '6', name: 'Cursor AI', category: '编程工具', heat_score: 5430, trend: 'up', created_at: '' },
  { id: '7', name: 'Gemini 2.0', category: 'AI工具', heat_score: 4890, trend: 'stable', created_at: '' },
  { id: '8', name: 'Stable Diffusion 3', category: '开源模型', heat_score: 4320, trend: 'down', created_at: '' },
  { id: '9', name: 'Copilot X', category: '编程工具', heat_score: 3980, trend: 'stable', created_at: '' },
  { id: '10', name: 'DALL-E 3', category: 'AI图像', heat_score: 3650, trend: 'down', created_at: '' },
];

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: 'text-success',
  down: 'text-destructive',
  stable: 'text-muted-foreground',
};

export function HotList() {
  return (
    <Card className="bg-card/50 border-border/50 glow-primary">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-heading text-lg">
          <Flame className="h-5 w-5 text-primary" />
          AI 热榜
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {mockHotList.map((item, index) => {
          const TrendIcon = trendIcons[item.trend];
          const maxScore = mockHotList[0].heat_score;
          const percentage = (item.heat_score / maxScore) * 100;

          return (
            <div
              key={item.id}
              className="group flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              {/* Rank */}
              <span className={cn(
                'w-6 text-center font-heading font-bold',
                index < 3 ? 'text-primary' : 'text-muted-foreground',
                index === 0 && 'text-xl',
                index === 1 && 'text-lg',
                index === 2 && 'text-base',
              )}>
                {index + 1}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate group-hover:text-foreground transition-colors">
                    {item.name}
                  </span>
                  <TrendIcon className={cn('h-3.5 w-3.5 shrink-0', trendColors[item.trend])} />
                </div>
                {/* Heat Bar */}
                <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Score */}
              <span className="text-sm text-muted-foreground tabular-nums">
                {(item.heat_score / 1000).toFixed(1)}k
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
