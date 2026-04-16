'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, Zap, LogOut, User, Crown, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface UserData {
  id: string;
  email: string;
  nickname: string;
  avatar: string | null;
  is_vip: boolean;
  points: number;
}

type Theme = 'light' | 'dark';

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/resources', label: '资源' },
  { href: '/premium', label: '精品课程' },
  { href: '/learn', label: '学习' },
  { href: '/profile', label: '我的' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  // 初始化主题
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    setTheme(saved || 'light');
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 只在展开菜单时才请求用户信息
  useEffect(() => {
    if (!showUserMenu) return;
    
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };
    fetchUser();
  }, [showUserMenu]);

  // 监听登录成功事件
  useEffect(() => {
    const handleLogin = () => {
      setUser(null);
      setShowUserMenu(true);
    };
    window.addEventListener('user:login', handleLogin);
    return () => window.removeEventListener('user:login', handleLogin);
  }, []);

  // 登出
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const isDark = theme === 'dark';

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full",
      isDark ? "" : "bg-white/80 backdrop-blur-xl border-b border-slate-200"
    )}>
      {/* 深色模式毛玻璃背景 */}
      {isDark && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border-b border-indigo-500/10" />
      )}
      
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl shadow-lg",
              isDark 
                ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-indigo-500/30"
                : "bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-indigo-500/20"
            )}>
              <Zap className="h-5 w-5 text-white" />
            </div>
            {isDark && (
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 opacity-30 blur-md -z-10" />
            )}
          </div>
          <span className={cn(
            "font-heading text-xl font-bold hidden sm:block",
            isDark ? "gradient-text" : "text-indigo-600"
          )}>
            NexusAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-all rounded-lg',
                isDark
                  ? pathname === link.href
                    ? 'text-white bg-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-indigo-500/10'
                  : pathname === link.href
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="搜索资源、话题..."
                className={cn(
                  "pl-10 border focus:border-indigo-500",
                  isDark 
                    ? "glass border-indigo-500/20 focus:border-indigo-500/50 bg-slate-900/50 text-white placeholder:text-slate-500"
                    : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
                )}
              />
            </div>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "rounded-xl",
              isDark 
                ? "hover:bg-indigo-500/20 text-slate-400 hover:text-white"
                : "hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
            )}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={cn(
              "rounded-xl",
              isDark 
                ? "hover:bg-indigo-500/20 text-slate-400 hover:text-white"
                : "hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
            )}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-xl md:hidden",
                  isDark 
                    ? "hover:bg-indigo-500/20 text-slate-400 hover:text-white"
                    : "hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={cn(
              "w-72",
              isDark ? "bg-slate-900 border-slate-800" : "bg-white"
            )}>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 text-base font-medium transition-all rounded-xl',
                      pathname === link.href
                        ? isDark
                          ? 'text-white bg-indigo-500/20'
                          : 'text-indigo-600 bg-indigo-50'
                        : isDark
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-600 hover:text-indigo-600'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* User Section */}
          {user ? (
            <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(
                  "relative h-10 w-10 rounded-xl",
                  isDark ? "hover:bg-indigo-500/20" : "hover:bg-slate-100"
                )}>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.nickname}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className={cn(
                      "flex items-center justify-center rounded-xl text-sm font-semibold shadow-lg",
                      isDark 
                        ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-indigo-500/20"
                        : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                    )}>
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
              <DropdownMenuContent align="end" className={cn(
                "w-56",
                isDark ? "glass border-indigo-500/20 bg-slate-950/95" : "bg-white border-slate-200"
              )}>
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
                <DropdownMenuSeparator className={isDark ? "bg-slate-800" : "bg-slate-200"} />
                <DropdownMenuItem asChild className={cn(
                  "cursor-pointer",
                  isDark ? "text-slate-300 focus:bg-slate-800" : "text-slate-700 focus:bg-slate-50"
                )}>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    个人中心
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDark ? "bg-slate-800" : "bg-slate-200"} />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className={cn(
                    "cursor-pointer text-red-400",
                    isDark ? "focus:bg-slate-800" : "focus:bg-slate-50"
                  )}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className={cn(
                "rounded-xl font-medium",
                isDark 
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
              )}>
                登录
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
