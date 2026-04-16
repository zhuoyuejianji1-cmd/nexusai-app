'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Heart, MoreHorizontal, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes_count);
  const [isSaved, setIsSaved] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    return '刚刚';
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl p-5 transition-all duration-300",
        isDark
          ? "bg-[#18181b] hover:bg-[#1f1f23] border border-white/5 hover:border-white/10"
          : "bg-white hover:bg-slate-50/80 border border-slate-200/50 hover:border-slate-200"
      )}
    >
      {/* 用户信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-11 w-11 rounded-xl ring-2 ring-offset-2 ring-offset-background transition-all duration-200 group-hover:ring-indigo-500/30">
              <AvatarImage src={post.user?.avatar_url || post.user?.avatar || undefined} />
              <AvatarFallback className={cn(
                "rounded-xl text-sm font-semibold",
                isDark 
                  ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" 
                  : "bg-gradient-to-br from-indigo-400 to-purple-400 text-white"
              )}>
                {post.user?.nickname?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {/* 在线状态指示 */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm font-semibold",
                isDark ? "text-white" : "text-slate-900"
              )}>
                {post.user?.nickname || '匿名用户'}
              </span>
              {post.user?.is_vip && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold",
                  isDark 
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white" 
                    : "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                )}>
                  VIP
                </span>
              )}
            </div>
            <span className={cn(
              "text-xs",
              isDark ? "text-slate-500" : "text-slate-400"
            )}>
              {formatTime(post.created_at)}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200",
                isDark 
                  ? "hover:bg-white/10 text-slate-400 hover:text-white" 
                  : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end"
            className={cn(
              "w-40 rounded-xl p-1.5",
              isDark 
                ? "bg-[#18181b] border border-white/10" 
                : "bg-white border border-slate-200 shadow-xl"
            )}
          >
            <DropdownMenuItem className={cn(
              "rounded-lg px-3 py-2 text-sm cursor-pointer",
              isDark 
                ? "text-slate-300 hover:bg-white/5 hover:text-white focus:bg-white/5" 
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50"
            )}>
              不感兴趣
            </DropdownMenuItem>
            <DropdownMenuItem className={cn(
              "rounded-lg px-3 py-2 text-sm cursor-pointer",
              isDark 
                ? "text-slate-300 hover:bg-white/5 hover:text-white focus:bg-white/5" 
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50"
            )}>
              举报
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 内容 */}
      <p className={cn(
        "text-sm leading-relaxed mb-4",
        isDark ? "text-slate-200" : "text-slate-700"
      )}>
        {post.content}
      </p>

      {/* 图片 */}
      {post.images && post.images.length > 0 && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img
            src={post.images[0]}
            alt="Post image"
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* 操作栏 */}
      <div className="flex items-center gap-1 pt-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            "flex-1 gap-1.5 h-9 rounded-xl transition-all duration-200",
            isLiked
              ? isDark
                ? "bg-pink-500/10 text-pink-400 hover:bg-pink-500/20"
                : "bg-pink-50 text-pink-500 hover:bg-pink-100"
              : isDark
                ? "text-slate-400 hover:bg-white/5 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          )}
        >
          <Heart className={cn(
            "h-4 w-4 transition-all duration-200",
            isLiked && "fill-current scale-110"
          )} />
          <span className="text-xs font-medium">{likeCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 gap-1.5 h-9 rounded-xl transition-all duration-200",
            isDark
              ? "text-slate-400 hover:bg-white/5 hover:text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          )}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs font-medium">{post.comments_count}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSaved(!isSaved)}
          className={cn(
            "h-9 w-9 rounded-xl transition-all duration-200",
            isSaved
              ? isDark
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                : "bg-indigo-50 text-indigo-500 hover:bg-indigo-100"
              : isDark
                ? "text-slate-400 hover:bg-white/5 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          )}
        >
          <Bookmark className={cn(
            "h-4 w-4 transition-all duration-200",
            isSaved && "fill-current"
          )} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 rounded-xl transition-all duration-200",
            isDark
              ? "text-slate-400 hover:bg-white/5 hover:text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          )}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
