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
        <div className="bg-card/50 border border-border/50 rounded-2xl p-4 hover-lift cursor-pointer">
          <div className="flex items-center gap-3">
            <UserAvatar name="我" size="md" />
            <div className="flex-1 px-4 py-2.5 bg-secondary/50 rounded-full text-muted-foreground text-sm">
              分享你的 AI 学习心得...
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading">发布动态</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Textarea
            placeholder="分享你的 AI 学习心得、工具使用体验、或者任何有趣的发现..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] resize-none bg-secondary/50"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                'text-sm',
                content.length > 500 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {content.length}/500
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || content.length > 500}
                className="gap-2"
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
