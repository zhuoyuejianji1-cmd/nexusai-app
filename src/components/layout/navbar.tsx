'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/resources', label: '资源' },
  { href: '/learn', label: '学习' },
  { href: '/profile', label: '我的' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          {/* User Avatar */}
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-indigo-500/20">
              <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
                U
              </div>
            </Button>
          </Link>

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
