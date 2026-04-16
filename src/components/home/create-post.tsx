'use client';

import { useState, useEffect } from 'react';
import { Image, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
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

  const handleSubmit = () => {
    if (!content.trim()) return;
    console.log('发布动态:', content);
    setContent('');
    setIsFocused(false);
  };

  return (
    <div className={cn(
      "relative rounded-2xl p-4 transition-all duration-300",
      isDark
        ? isFocused
          ? "bg-[#1a1a2e] border border-indigo-500/30"
          : "bg-[#18181b] border border-white/5 hover:border-white/10"
        : isFocused
          ? "bg-white border border-indigo-200 shadow-lg shadow-indigo-100"
          : "bg-white border border-slate-200/50 hover:border-slate-200"
    )}>
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11 rounded-xl">
          <AvatarFallback className={cn(
            "rounded-xl text-sm font-semibold",
            isDark 
              ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" 
              : "bg-gradient-to-br from-indigo-400 to-purple-400 text-white"
          )}>
            你
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !content && setIsFocused(false)}
            placeholder="分享你的 AI 学习心得..."
            className={cn(
              "min-h-[44px] resize-none rounded-xl border-0 p-3 text-sm transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0",
              isDark
                ? "bg-transparent text-white placeholder:text-slate-500 focus:bg-transparent"
                : "bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:bg-slate-50"
            )}
          />
          
          <div className={cn(
            "flex items-center justify-between pt-3 transition-all duration-300",
            isFocused ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          )}>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-lg transition-all duration-200",
                  isDark 
                    ? "hover:bg-white/10 text-slate-400 hover:text-indigo-400" 
                    : "hover:bg-slate-100 text-slate-400 hover:text-indigo-600"
                )}
              >
                <Image className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-lg transition-all duration-200",
                  isDark 
                    ? "hover:bg-white/10 text-slate-400 hover:text-indigo-400" 
                    : "hover:bg-slate-100 text-slate-400 hover:text-indigo-600"
                )}
              >
                <Sparkles className="h-5 w-5" />
              </Button>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className={cn(
                "h-9 px-5 rounded-xl font-medium transition-all duration-200",
                content.trim()
                  ? isDark
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg shadow-indigo-500/10"
                  : isDark
                    ? "bg-slate-700 text-slate-500"
                    : "bg-slate-200 text-slate-400"
              )}
            >
              <Send className="h-4 w-4 mr-2" />
              发布
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
