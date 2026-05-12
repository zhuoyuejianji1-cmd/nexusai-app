'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles, Mail, KeyRound, ArrowLeft, CheckCircle2,
  AlertCircle, Loader2, Sun, Moon, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    setTheme(savedTheme || 'light');
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, isLoaded]);

  // 倒计时
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const isDark = theme === 'dark';

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }
    setError('');
    setSending(true);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'login' }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('code');
        setCountdown(60);
        // 开发模式直接显示验证码
        if (data.code) setDevCode(data.code);
      } else {
        setError(data.error || '发送失败');
      }
    } catch {
      setError('网络错误');
    }
    setSending(false);
  };

  const handleVerify = async () => {
    if (!code || code.length < 4) {
      setError('请输入验证码');
      return;
    }
    setError('');
    setVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, nickname: nickname || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        // 登录成功，返回首页
        router.push('/');
      } else {
        setError(data.error || '验证失败');
      }
    } catch {
      setError('网络错误');
    }
    setVerifying(false);
  };

  if (!isLoaded) return null;

  return (
    <div className={cn("min-h-screen transition-colors duration-500 flex items-center justify-center", isDark ? "bg-[#0a0a0f] text-white" : "bg-[#fafbfc] text-slate-900")}>
      {isDark && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-amber-500/10 via-orange-500/8 to-transparent rounded-full blur-[120px]" />
        </div>
      )}

      <div className="relative w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className={cn("flex items-center justify-center h-10 w-10 rounded-xl", isDark ? "bg-gradient-to-br from-indigo-500 to-purple-500" : "bg-gradient-to-br from-indigo-500 to-purple-500")}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className={cn("font-heading text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent", isDark ? "from-white to-slate-300" : "from-slate-900 via-indigo-600 to-purple-600")}>
              NexusAI
            </span>
          </Link>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
            {step === 'email' ? '登录或注册账号' : '输入验证码'}
          </p>
        </div>

        <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
          <CardContent className="p-8">
            {step === 'email' ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>邮箱地址</label>
                  <div className="relative">
                    <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", isDark ? "text-slate-500" : "text-slate-400")} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入邮箱"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                      className={cn(
                        "w-full h-12 pl-10 pr-4 rounded-xl border text-sm outline-none transition-all",
                        isDark ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500"
                      )}
                    />
                  </div>
                </div>

                {error && (
                  <div className={cn("flex items-center gap-2 p-3 rounded-lg text-sm", isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600")}>
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleSendCode}
                  disabled={sending}
                  className={cn(
                    "w-full h-12 rounded-xl font-bold text-base transition-all",
                    isDark ? "bg-indigo-500 hover:bg-indigo-400 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"
                  )}
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      发送中...
                    </>
                  ) : '发送验证码'}
                </Button>

                <p className={cn("text-xs text-center", isDark ? "text-slate-500" : "text-slate-400")}>
                  验证码将发送到你输入的邮箱，10分钟内有效
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className={cn("text-center p-4 rounded-xl", isDark ? "bg-white/5" : "bg-slate-50")}>
                  <Mail className={cn("h-8 w-8 mx-auto mb-2", isDark ? "text-indigo-400" : "text-indigo-600")} />
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-800")}>{email}</p>
                  <button onClick={() => { setStep('email'); setError(''); }} className={cn("text-xs mt-1", isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500")}>
                    更换邮箱
                  </button>
                </div>

                {devCode && (
                  <div className={cn("p-3 rounded-xl text-center", isDark ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-200")}>
                    <p className={cn("text-xs font-medium mb-1", isDark ? "text-emerald-400" : "text-emerald-600")}>开发模式验证码</p>
                    <p className={cn("text-2xl font-bold tracking-widest", isDark ? "text-emerald-400" : "text-emerald-600")}>{devCode}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>验证码</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="输入6位验证码"
                    maxLength={6}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    className={cn(
                      "w-full h-12 px-4 rounded-xl border text-sm text-center text-lg tracking-widest outline-none transition-all",
                      isDark ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500"
                    )}
                  />
                </div>

                {error && (
                  <div className={cn("flex items-center gap-2 p-3 rounded-lg text-sm", isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600")}>
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleVerify}
                  disabled={verifying || code.length < 4}
                  className={cn(
                    "w-full h-12 rounded-xl font-bold text-base transition-all",
                    isDark ? "bg-indigo-500 hover:bg-indigo-400 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"
                  )}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      验证中...
                    </>
                  ) : '登录 / 注册'}
                </Button>

                <div className="text-center">
                  <button
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className={cn("text-xs", isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-indigo-600")}
                  >
                    {countdown > 0 ? `${countdown}秒后可重新发送` : '重新发送验证码'}
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className={cn("text-xs inline-flex items-center gap-1", isDark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-indigo-600")}>
            <ArrowLeft className="h-3 w-3" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
