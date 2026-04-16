'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, Zap, LogOut, User, Crown } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatar: string | null;
  is_vip: boolean;
  points: number;
}

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/resources', label: '资源' },
  { href: '/learn', label: '学习' },
  { href: '/profile', label: '我的' },
];

// 客户端缓存用户状态
let cachedUser: User | null = null;
let userResolve: ((u: User | null) => void) | null = null;
let isFetching = false;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(cachedUser);
  const [isLoading, setIsLoading] = useState(!cachedUser);

  // 获取用户信息 - 使用单例模式避免重复请求
  const fetchUser = useCallback(async () => {
    if (cachedUser) {
      setUser(cachedUser);
      setIsLoading(false);
      return;
    }

    if (isFetching && userResolve) {
      userResolve = (u: User | null) => {
        cachedUser = u;
        setUser(u);
        setIsLoading(false);
      };
      return;
    }

    isFetching = true;

    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      cachedUser = data.user;
      setUser(data.user);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      cachedUser = null;
      setUser(null);
    } finally {
      isFetching = false;
      if (userResolve) {
        userResolve(cachedUser);
        userResolve = null;
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 监听登录成功事件
  useEffect(() => {
    const handleLogin = () => {
      cachedUser = null; // 清除缓存
      fetchUser(); // 重新获取
    };
    window.addEventListener('user:login', handleLogin);
    return () => window.removeEventListener('user:login', handleLogin);
  }, [fetchUser]);

  // 登出
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      cachedUser = null;
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* 毛玻璃背景 */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border-b border-indigo-500/10" />
      
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-lg shadow-indigo-500/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 opacity-30 blur-md -z-10" />
          </div>
          <span className="font-heading text-xl font-bold gradient-text hidden sm:block">
            NexusAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-all rounded-lg',
                pathname === link.href
                  ? 'text-white bg-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-indigo-500/10'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className={cn(
            'hidden sm:flex items-center',
            isSearchOpen && 'absolute left-0 right-0 px-4 sm:relative sm:px-0'
          )}>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="search"
                placeholder="搜索资源、话题..."
                className="pl-10 glass border-indigo-500/20 focus:border-indigo-500/50 bg-slate-900/50"
              />
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* User Section */}
          {isLoading ? (
            <div className="h-10 w-10 rounded-xl bg-slate-800 animate-pulse" />
          ) : user ? (
            // 已登录 - 显示下拉菜单
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-indigo-500/20">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.nickname}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
                      {user.nickname?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  {user.is_vip && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                      <Crown className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-indigo-500/20 bg-slate-950/95">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-white">{user.nickname}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-cyan-400">{user.points} 积分</span>
                    {user.is_vip && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400">
                        VIP
                      </span>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-indigo-500/20" />
                <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-indigo-500/10 cursor-pointer">
                  <Link href="/profile" prefetch>
                    <User className="h-4 w-4 mr-2" />
                    个人中心
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-indigo-500/10 cursor-pointer">
                  <Link href="/profile/posts" prefetch>
                    <User className="h-4 w-4 mr-2" />
                    我的动态
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-indigo-500/20" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // 未登录 - 显示登录按钮
            <Link href="/login">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                登录
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 glass border-indigo-500/20 bg-slate-950/95">
              <div className="flex flex-col gap-4 mt-8">
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 text-lg font-medium rounded-xl transition-all',
                      pathname === link.href
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                        : 'text-slate-400 hover:bg-indigo-500/10 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="glass border border-indigo-500/20 rounded-xl p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="search"
                placeholder="搜索资源、话题..."
                className="pl-10 glass border-0 bg-transparent"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
