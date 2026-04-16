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

const navLinks = [
  { href: '/', label: '首页' },
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    setTheme(saved || 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

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

  useEffect(() => {
    const handleLogin = () => {
      setUser(null);
      setShowUserMenu(true);
    };
    window.addEventListener('user:login', handleLogin);
    return () => window.removeEventListener('user:login', handleLogin);
  }, []);

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
      "sticky top-0 z-50 w-full transition-all duration-300",
      isDark 
        ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5" 
        : "bg-white/80 backdrop-blur-xl border-b border-slate-200/80"
    )}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
              isDark 
                ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20 group-hover:shadow-xl group-hover:shadow-indigo-500/30" 
                : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/10 group-hover:shadow-xl group-hover:shadow-indigo-500/20"
            )}>
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className={cn(
            "font-heading text-xl font-bold tracking-tight transition-all duration-300",
            isDark 
              ? "bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent" 
              : "bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
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
                'relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg',
                isDark
                  ? pathname === link.href
                    ? 'text-white bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  : pathname === link.href
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className={cn(
                  "absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full",
                  isDark 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500" 
                    : "bg-gradient-to-r from-indigo-500 to-purple-500"
                )} />
              )}
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
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="搜索资源、话题..."
                className={cn(
                  "pl-10 pr-4 h-10 rounded-xl border text-sm transition-all duration-200",
                  isDark 
                    ? "bg-white/5 border-white/10 focus:bg-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50" 
                    : "bg-slate-50 border-slate-200 focus:bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-300"
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
              "h-10 w-10 rounded-xl transition-all duration-200",
              isDark 
                ? "hover:bg-white/10 text-slate-400 hover:text-white" 
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
              "h-10 w-10 rounded-xl transition-all duration-200",
              isDark 
                ? "hover:bg-white/10 text-slate-400 hover:text-white" 
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
                  "h-10 w-10 rounded-xl transition-all duration-200 md:hidden",
                  isDark 
                    ? "hover:bg-white/10 text-slate-400 hover:text-white" 
                    : "hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className={cn(
                "w-80 p-0 transition-all",
                isDark ? "bg-[#0a0a0f] border-l border-white/5" : "bg-white border-l border-slate-200"
              )}
            >
              <div className="flex flex-col gap-1 p-4 mt-16">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 text-base font-medium transition-all rounded-xl',
                      pathname === link.href
                        ? isDark
                          ? 'text-white bg-white/10'
                          : 'text-indigo-600 bg-indigo-50'
                        : isDark
                          ? 'text-slate-400 hover:text-white hover:bg-white/5'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "relative h-10 w-10 rounded-xl transition-all duration-200",
                    isDark ? "hover:bg-white/10" : "hover:bg-slate-100"
                  )}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.nickname}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className={cn(
                      "flex items-center justify-center rounded-xl text-sm font-semibold shadow-md",
                      isDark 
                        ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" 
                        : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                    )}>
                      {user.nickname?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  {user.is_vip && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className={cn(
                  "w-64 p-2 rounded-xl",
                  isDark 
                    ? "bg-[#12121a] border border-white/10 backdrop-blur-xl" 
                    : "bg-white border border-slate-200 shadow-xl"
                )}
              >
                <div className={cn(
                  "px-3 py-2 rounded-lg mb-1",
                  isDark ? "bg-white/5" : "bg-slate-50"
                )}>
                  <p className="text-sm font-semibold text-white">{user.nickname}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-600"
                    )}>
                      {user.points} 积分
                    </span>
                    {user.is_vip && (
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400"
                      )}>
                        VIP
                      </span>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator className={isDark ? "bg-white/5 -mx-2 my-2" : "bg-slate-200 -mx-2 my-2"} />
                <DropdownMenuItem 
                  asChild 
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isDark ? "text-slate-300 hover:bg-white/5 hover:text-white focus:bg-white/5" : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600 focus:bg-slate-50"
                  )}
                >
                  <Link href="/profile">
                    <User className="mr-2.5 h-4 w-4" />
                    个人中心
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDark ? "bg-white/5 -mx-2 my-2" : "bg-slate-200 -mx-2 my-2"} />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-colors text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                  )}
                >
                  <LogOut className="mr-2.5 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className={cn(
                "h-10 px-5 rounded-xl font-medium shadow-lg transition-all duration-200",
                isDark 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-indigo-500/20" 
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-indigo-500/10"
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
