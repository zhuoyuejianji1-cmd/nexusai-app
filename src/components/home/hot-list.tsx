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
  up: 'text-emerald-400',
  down: 'text-red-400',
  stable: 'text-slate-500',
};

export function HotList() {
  return (
    <Card className="glass border-indigo-500/20 overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-heading text-lg text-white">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/30 to-red-500/30">
            <Flame className="h-5 w-5 text-orange-400" />
          </div>
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
              className="group flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-indigo-500/20"
            >
              {/* Rank */}
              <span className={cn(
                'w-7 text-center font-heading font-bold',
                index === 0 && 'text-2xl text-amber-400',
                index === 1 && 'text-xl text-slate-400',
                index === 2 && 'text-lg text-orange-400',
                index >= 3 && 'text-base text-slate-500',
              )}>
                {index + 1}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-300 truncate group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                  <TrendIcon className={cn('h-4 w-4 shrink-0', trendColors[item.trend])} />
                </div>
                {/* Heat Bar */}
                <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Score */}
              <span className="text-sm text-slate-500 tabular-nums font-mono">
                {(item.heat_score / 1000).toFixed(1)}k
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
