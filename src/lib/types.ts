// AI 学习社区类型定义

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string;
  bio?: string;
  points: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  images: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  user?: User;
  is_liked?: boolean;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  category: string;
  url: string;
  cover_url?: string;
  likes_count: number;
  views_count: number;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  steps: TaskStep[];
  duration?: string;
  points: number;
  path_id: number;
  created_at: string;
}

export interface TaskStep {
  title: string;
  content: string;
  resources?: string[];
}

export interface UserTaskProgress {
  id: string;
  user_id: string;
  task_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  completed_at?: string;
  notes?: string;
  created_at: string;
  task?: Task;
}

export interface News {
  id: string;
  title: string;
  summary?: string;
  source?: string;
  url?: string;
  week_number: number;
  created_at: string;
}

export interface HotListItem {
  id: string;
  name: string;
  category: string;
  heat_score: number;
  trend: 'up' | 'down' | 'stable';
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  resource_id: string;
  created_at: string;
  resource?: Resource;
}

// 路径节点
export interface PathNode {
  id: number;
  name: string;
  description: string;
  tasks: number;
  completed: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
}
