import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// AI 学习社区工具函数

// 生成渐变色头像背景
export function getAvatarGradient(name: string): string {
  const colors = [
    ['#6366f1', '#8b5cf6'],
    ['#22d3ee', '#10b981'],
    ['#f59e0b', '#ef4444'],
    ['#8b5cf6', '#ec4899'],
    ['#10b981', '#22d3ee'],
  ];
  const index = name.charCodeAt(0) % colors.length;
  return `linear-gradient(135deg, ${colors[index][0]} 0%, ${colors[index][1]} 100%)`;
}

// 获取名字首字母
export function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

// 格式化时间
export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  
  return past.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
}

// 格式化数字
export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

// 截断文本
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// 随机 ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// 分类映射
export const categoryLabels: Record<string, string> = {
  'all': '全部',
  'ai-tools': 'AI工具',
  'tutorial': '教程',
  'paper': '论文',
  'video': '视频',
  'dataset': '数据集',
  'open-source': '开源项目',
};

export const categoryColors: Record<string, string> = {
  'ai-tools': '#6366f1',
  'tutorial': '#22d3ee',
  'paper': '#8b5cf6',
  'video': '#10b981',
  'dataset': '#f59e0b',
  'open-source': '#ec4899',
};

// 路径标签
export const pathLabels: Record<number, string> = {
  1: '入门',
  2: '基础',
  3: '进阶',
  4: '实战',
  5: '专家',
};
