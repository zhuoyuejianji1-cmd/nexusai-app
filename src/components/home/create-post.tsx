'use client';

import { useState } from 'react';
import { Image, Smile, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/common/user-avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CreatePostProps {
  onPost?: (content: string, images: string[]) => void;
}

export function CreatePost({ onPost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onPost?.(content, []);
    setContent('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="glass border-indigo-500/20 rounded-2xl p-5 hover-lift cursor-pointer group">
          <div className="flex items-center gap-4">
            <UserAvatar name="我" size="md" />
            <div className="flex-1 px-5 py-3 bg-slate-900/50 rounded-full text-slate-500 text-sm group-hover:bg-slate-800/50 transition-colors">
              分享你的 AI 学习心得...
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="glass border-indigo-500/20 bg-slate-950/95 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-white">发布动态</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Textarea
            placeholder="分享你的 AI 学习心得、工具使用体验、或者任何有趣的发现..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] resize-none glass border-indigo-500/20 bg-slate-900/50 focus:border-indigo-500/50"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-amber-400 hover:bg-amber-500/10">
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                'text-sm font-mono',
                content.length > 500 ? 'text-red-400' : 'text-slate-500'
              )}>
                {content.length}/500
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || content.length > 500}
                className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25"
              >
                <Send className="h-4 w-4" />
                发布
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
