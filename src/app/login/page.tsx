'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

type LoginStep = 'select' | 'email' | 'register' | 'verify' | 'success';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [step, setStep] = useState<LoginStep>('select');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState(''); // 开发环境显示的验证码

  // 发送验证码
  const sendVerifyCode = async () => {
    if (!email) {
      setError('请输入邮箱');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: step === 'register' ? 'register' : 'login' }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || '发送失败');
      }
      
      // 开发环境：保存返回的验证码
      if (data.code) {
        setDevCode(data.code);
      }
      
      setCountdown(60);
      setStep(step === 'register' ? 'register' : 'verify');
      
      // 倒计时
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 验证验证码
  const verifyCodeSubmit = async () => {
    if (!verifyCode) {
      setError('请输入验证码');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verifyCode, nickname: step === 'register' ? nickname : undefined }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || '验证失败');
      }
      
      // 登录成功，立即跳转
      setStep('success');
      // 通知 Navbar 刷新用户状态
      window.dispatchEvent(new Event('user:login'));
      // 延迟一点跳转，让用户看到成功提示
      setTimeout(() => {
        router.push(redirect);
      }, 300);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative flex items-center justify-center p-4">
      {/* 背景光效 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-lg shadow-indigo-500/50">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <span className="font-heading text-3xl font-black bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              NexusAI
            </span>
          </Link>
        </div>

        {/* 登录卡片 */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
          {/* 步骤1：选择登录方式 */}
          {step === 'select' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">欢迎登录</h2>
                <p className="text-sm text-slate-400">选择登录方式</p>
              </div>
              
              {/* Google 登录 */}
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-medium transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google 一键登录</span>
                <span className="text-xs text-slate-500 ml-auto">推荐</span>
              </button>
              
              {/* 邮箱登录 */}
              <button 
                onClick={() => setStep('email')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all"
              >
                <Mail className="w-5 h-5" />
                <span>邮箱 + 验证码登录</span>
              </button>
              
              <p className="text-xs text-center text-slate-500">
                登录即表示同意我们的
                <Link href="/terms" className="text-indigo-400 hover:underline">服务条款</Link>
                和
                <Link href="/privacy" className="text-indigo-400 hover:underline">隐私政策</Link>
              </p>
              
              {/* 跳过按钮 - 不登录直接返回 */}
              <div className="pt-4 border-t border-slate-700/50">
                <button 
                  onClick={() => router.push(redirect !== '/login' ? redirect : '/')}
                  className="w-full text-center text-sm text-slate-500 hover:text-white transition-colors"
                >
                  跳过，暂不登录 →
                </button>
              </div>
            </div>
          )}

          {/* 步骤2：输入邮箱 */}
          {step === 'email' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">邮箱登录</h2>
                <p className="text-sm text-slate-400">输入邮箱地址</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="请输入邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <button
                  onClick={sendVerifyCode}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium transition-all"
                >
                  {loading ? '发送中...' : '发送验证码'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                {/* 跳过按钮 */}
                <button 
                  onClick={() => router.push(redirect !== '/login' ? redirect : '/')}
                  className="w-full text-center text-sm text-slate-500 hover:text-white transition-colors"
                >
                  跳过，暂不登录 →
                </button>
              </div>
              
              <button 
                onClick={() => { setStep('select'); setError(''); }}
                className="w-full text-center text-sm text-slate-400 hover:text-white"
              >
                ← 返回
              </button>
            </div>
          )}

          {/* 步骤3：注册（输入昵称） */}
          {step === 'register' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">注册新账号</h2>
                <p className="text-sm text-slate-400">创建你的账号</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400"
                  />
                </div>
                
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="设置昵称"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="输入验证码"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    maxLength={6}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    onClick={sendVerifyCode}
                    disabled={countdown > 0}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-400 hover:text-indigo-300 disabled:text-slate-500"
                  >
                    {countdown > 0 ? `${countdown}s` : '重新发送'}
                  </button>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <button
                  onClick={verifyCodeSubmit}
                  disabled={loading || !nickname || verifyCode.length < 6}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium transition-all"
                >
                  {loading ? '注册中...' : '完成注册'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              
              <button 
                onClick={() => { setStep('email'); setError(''); }}
                className="w-full text-center text-sm text-slate-400 hover:text-white"
              >
                ← 返回
              </button>
            </div>
          )}

          {/* 步骤4：验证（老用户登录） */}
          {step === 'verify' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">输入验证码</h2>
                <p className="text-sm text-slate-400">已发送至 {email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="输入6位验证码"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-center text-lg tracking-widest"
                  />
                </div>
                
                {/* 开发环境显示验证码 */}
                {devCode && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-emerald-400 mb-1">开发环境验证码</p>
                    <p className="text-2xl font-bold text-emerald-400 tracking-widest">{devCode}</p>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <button
                  onClick={verifyCodeSubmit}
                  disabled={loading || verifyCode.length < 6}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-medium transition-all"
                >
                  {loading ? '验证中...' : '登录'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                <button
                  onClick={sendVerifyCode}
                  disabled={countdown > 0}
                  className="w-full text-center text-sm text-slate-400 hover:text-white disabled:text-slate-500"
                >
                  {countdown > 0 ? `重新发送 (${countdown}s)` : '没收到？重新发送'}
                </button>
              </div>
              
              <button 
                onClick={() => { setStep('email'); setError(''); setVerifyCode(''); }}
                className="w-full text-center text-sm text-slate-400 hover:text-white"
              >
                ← 返回
              </button>
            </div>
          )}

          {/* 步骤5：成功 */}
          {step === 'success' && (
            <div className="text-center space-y-4 py-8">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">登录成功！</h2>
              <p className="text-sm text-slate-400">正在跳转...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 包装器组件处理 useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-bg relative flex items-center justify-center p-4">
        <div className="text-white">加载中...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
