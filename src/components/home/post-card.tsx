'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn, formatTimeAgo } from '@/lib/utils';
import { UserAvatar } from '@/components/common/user-avatar';
import type { Post, Comment } from '@/lib/types';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
}

// 模拟评论数据
const mockComments: Comment[] = [
  {
    id: '1',
    user_id: '1',
    post_id: '1',
    content: '这篇文章写得真好！学到了很多',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: { id: '1', email: 'a@test.com', nickname: 'AI爱好者', points: 100, created_at: '' },
  },
  {
    id: '2',
    user_id: '2',
    post_id: '1',
    content: '同意，确实很有帮助',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user: { id: '2', email: 'b@test.com', nickname: '科技达人', points: 200, created_at: '' },
  },
];

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onLike?.(post.id);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: 'current-user',
      post_id: post.id,
      content: commentText,
      created_at: new Date().toISOString(),
      user: { id: 'current-user', email: 'me@test.com', nickname: '我', points: 50, created_at: '' },
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
    onComment?.(post.id, commentText);
  };

  return (
    <Card className="bg-card/50 border-border/50 hover-lift">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={post.user?.nickname || 'Anonymous'}
              avatarUrl={post.user?.avatar_url}
              size="md"
            />
            <div>
              <span className="font-medium">
                {post.user?.nickname || 'Anonymous'}
              </span>
              <span className="text-muted-foreground text-sm ml-2">
                {formatTimeAgo(post.created_at)}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={cn(
            'grid gap-2 mb-4',
            post.images.length === 1 && 'grid-cols-1',
            post.images.length === 2 && 'grid-cols-2',
            post.images.length >= 3 && 'grid-cols-3',
          )}>
            {post.images.slice(0, 9).map((image, index) => (
              <div
                key={index}
                className={cn(
                  'relative aspect-square rounded-lg overflow-hidden bg-secondary',
                  post.images!.length === 1 && 'aspect-video',
                )}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'gap-2 text-muted-foreground hover:text-primary',
              isLiked && 'text-primary'
            )}
            onClick={handleLike}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-transform',
                isLiked && 'fill-current',
                isAnimating && 'scale-125'
              )}
            />
            <span className="text-xs">{likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments.length}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
            {/* Comment Input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="写下你的评论..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[60px] resize-none bg-secondary/50"
              />
              <Button
                size="sm"
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="self-end"
              >
                发送
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <UserAvatar
                    name={comment.user?.nickname || 'Anonymous'}
                    avatarUrl={comment.user?.avatar_url}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-sm">
                        {comment.user?.nickname || 'Anonymous'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
