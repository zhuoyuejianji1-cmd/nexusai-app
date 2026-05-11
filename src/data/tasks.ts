export interface TaskItem {
  id: number;
  title: string;
  desc: string;
  progress: number;
  xp: number;
  completed?: boolean;
}

export const tasksFallback: TaskItem[] = [
  { id: 1, title: '完成 AI 基础课程第 3 章', desc: '学习机器学习核心概念', progress: 80, xp: 50 },
  { id: 2, title: '使用 ChatGPT 写一篇文章', desc: '练习 Prompt 技巧', progress: 100, xp: 30, completed: true },
  { id: 3, title: '阅读 AI 最新资讯', desc: '了解行业动态', progress: 60, xp: 20 },
];
