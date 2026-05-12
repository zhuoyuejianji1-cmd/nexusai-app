'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, Zap, Crown, Sun, Moon, Settings, LogOut, User } from 'lucide-react';
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

type TabType = 'home' | 'resources' | 'learn' | 'profile';

interface UserData {
  id: string;
  email: string;
  nickname: string;
  avatar: string | null;
  is_vip: boolean;
  points: number;
}

interface NavbarProps {
  onTabChange?: (tab: TabType) => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
}

const navLinks = [
  { id: 'home' as TabType, label: '首页', href: '/' },
  { id: 'resources' as TabType, label: '资源', href: '/' },
  { id: 'premium' as const, label: '精品课程', href: '/premium' },
  { id: 'learn' as TabType, label: '学习', href: '/learn' },
  { id: 'profile' as TabType, label: '我的', href: '/profile' },
];

export function Navbar({ onTabChange, theme: themeProp, onThemeToggle }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // 使用外部注入的 theme（SPA模式），否则回退到自管理（独立页面模式）
  const theme = themeProp ?? localTheme;
  const toggleTheme = onThemeToggle ?? (() => {
    const newTheme = localTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    setLocalTheme(saved || 'light');
  }, []);

  // 获取用户信息
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); })
      .catch(() => {});
  }, []);

  const isDark = theme === 'dark';

  const handleNavClick = (tabId: TabType | 'premium') => {
    // 有独立页面的导航：直接跳转
    if (tabId === 'premium' || tabId === 'learn' || tabId === 'profile') {
      router.push(`/${tabId === 'premium' ? 'premium' : tabId}`);
      return;
    }
    // SPA tab（首页/资源还在首页用tab切换）
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isDark 
        ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5" 
        : "bg-white/80 backdrop-blur-xl border-b border-slate-200/80"
    )}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 group"
        >
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300",
            isDark 
              ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20" 
              : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/10"
          )}>
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className={cn(
            "font-heading text-lg font-bold tracking-tight transition-all duration-300",
            isDark 
              ? "bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent" 
              : "bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
          )}>
            NexusAI
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg',
                activeTab === link.id
                  ? isDark
                    ? 'text-white bg-white/10'
                    : 'text-indigo-600 bg-indigo-50'
                  : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              )}
            >
              {link.label}
              {activeTab === link.id && (
                <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
              )}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden sm:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="搜索..."
                className={cn(
                  "pl-10 pr-4 h-9 w-48 rounded-lg border text-sm transition-all duration-200",
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
              "h-9 w-9 rounded-lg transition-all duration-200",
              isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
            )}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* User Section */}
          <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "relative h-9 w-9 rounded-lg transition-all duration-200",
                  isDark ? "hover:bg-white/10" : "hover:bg-slate-100"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center rounded-lg text-sm font-semibold",
                  isDark ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                )}>
                  {user?.nickname?.[0]?.toUpperCase() || '登录'}
                </div>
                {user?.is_vip && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-3.5 w-3.5 rounded-full bg-amber-500 text-[8px] text-white font-bold shadow">👑</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className={cn(
                "w-56 p-2 rounded-xl",
                isDark 
                  ? "bg-[#12121a] border border-white/10 backdrop-blur-xl" 
                  : "bg-white border border-slate-200 shadow-xl"
              )}
            >
              <div className={cn(
                "px-3 py-2 rounded-lg mb-1",
                isDark ? "bg-white/5" : "bg-slate-50"
              )}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold" style={{color: isDark ? '#fff' : '#1e293b'}}>{user?.nickname || '游客用户'}</p>
                  {user?.is_vip && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white">VIP</span>
                  )}
                </div>
                <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{user ? `积分: ${user.points || 0}` : '登录解锁更多功能'}</p>
              </div>
              <DropdownMenuSeparator className={isDark ? "bg-white/5 -mx-2 my-2" : "bg-slate-200 -mx-2 my-2"} />
              {user ? (
                <>
                  <DropdownMenuItem 
                    onClick={() => { setShowUserMenu(false); router.push('/profile'); }}
                    className={cn(
                      "cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors",
                      isDark ? "text-slate-300 hover:bg-white/5 hover:text-white focus:bg-white/5" : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600 focus:bg-slate-50"
                    )}
                  >
                    <User className="mr-2 h-4 w-4" />
                    我的主页
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={isDark ? "bg-white/5 -mx-2 my-2" : "bg-slate-200 -mx-2 my-2"} />
                  <DropdownMenuItem 
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      setUser(null);
                      setShowUserMenu(false);
                      window.location.reload();
                    }}
                    className={cn(
                      "cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                    )}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem 
                  onClick={() => { setShowUserMenu(false); router.push('/login'); }}
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors",
                    isDark ? "text-slate-300 hover:bg-white/5 hover:text-white focus:bg-white/5" : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600 focus:bg-slate-50"
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  登录 / 注册
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-lg transition-all duration-200 md:hidden",
                  isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                )}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className={cn(
                "w-72 p-0 pt-16",
                isDark ? "bg-[#0a0a0f] border-l border-white/5" : "bg-white border-l border-slate-200"
              )}
            >
              <div className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      handleNavClick(link.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      'px-4 py-3 text-base font-medium transition-all rounded-xl text-left',
                      activeTab === link.id
                        ? isDark
                          ? 'text-white bg-white/10'
                          : 'text-indigo-600 bg-indigo-50'
                        : isDark
                          ? 'text-slate-400 hover:text-white hover:bg-white/5'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    )}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
