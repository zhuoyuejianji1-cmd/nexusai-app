'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles, ArrowLeft, CheckCircle2, AlertCircle,
  Clock, Loader2, Smartphone, Copy,
  Sun, Moon, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Suspense包装 (因为useSearchParams需要)
function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course_id');

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState<'loading' | 'checking_auth' | 'create_order' | 'show_qr' | 'paid' | 'error'>('loading');
  const [order, setOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [qrCode, setQrCode] = useState<string>('');
  const [countdown, setCountdown] = useState(600); // 10分钟倒计时
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    setTheme(savedTheme || 'light');
    setIsLoaded(true);
  }, []);

  const isDark = theme === 'dark';

  // 检查登录状态
  useEffect(() => {
    if (!isLoaded || !courseId) return;
    
    setStep('checking_auth');
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (!data.user) {
          // 未登录，跳转到登录页，登录后返回支付页
          router.push(`/login?redirect=/payment?course_id=${courseId}`);
          return;
        }
        // 已登录，开始创建订单
        createOrder();
      })
      .catch(() => {
        setErrorMsg('无法验证身份，请重新登录');
        setStep('error');
      });
  }, [isLoaded, courseId]);

  function createOrder() {
    setStep('create_order');
    fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: courseId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.order) {
          setOrder(data.order);
          // 免费订单（VIP用户），直接完成
          if (data.freeOrder) {
            setStep('paid');
            return;
          }
          setStep('show_qr');
          // 生成二维码 (使用qrcode库)
          import('qrcode').then(qr => {
            qr.toDataURL(data.order.codeUrl || data.order.code_url || '', {
              width: 280,
              margin: 2,
              color: { dark: isDark ? '#ffffff' : '#000000', light: 'transparent' },
            }).then(url => setQrCode(url));
          });
        } else {
          setErrorMsg(data.error || '创建订单失败');
          setStep('error');
        }
      })
      .catch(err => {
        setErrorMsg('网络错误，请重试');
        setStep('error');
      });
  }

  // 轮询支付状态
  useEffect(() => {
    if (step !== 'show_qr' || !order) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status?id=${order.id}`);
        const data = await res.json();
        if (data.success && data.order?.status === 'paid') {
          setOrder(data.order);
          setStep('paid');
          clearInterval(interval);
        }
        setPollCount(p => p + 1);
      } catch { }
    }, 3000); // 每3秒轮询

    return () => clearInterval(interval);
  }, [step, order]);

  // 倒计时
  useEffect(() => {
    if (step !== 'show_qr') return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // Mock模拟支付 (开发模式按钮)
  const handleMockPay = async () => {
    if (!order) return;
    try {
      const res = await fetch('/api/payment/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ out_trade_no: order.outTradeNo }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setStep('paid');
      }
    } catch { }
  };

  if (!courseId) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-[#0a0a0f] text-white" : "bg-[#fafbfc] text-slate-900")}>
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
          <h2 className="text-xl font-bold">缺少课程ID</h2>
          <Link href="/premium">
            <Button>返回课程列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen transition-colors duration-500", isDark ? "bg-[#0a0a0f] text-white" : "bg-[#fafbfc] text-slate-900")}>
      {/* 背景装饰 */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/10 via-teal-500/8 to-transparent rounded-full blur-[100px]" />
        </div>
      )}

      {/* 头部 */}
      <header className={cn("sticky top-0 z-50 w-full backdrop-blur-xl border-b", isDark ? "bg-[#0a0a0f]/80 border-white/5" : "bg-white/80 border-slate-200/80")}>
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/premium" className="flex items-center gap-2 group">
            <ArrowLeft className={cn("h-5 w-5", isDark ? "text-slate-400 group-hover:text-white" : "text-slate-500 group-hover:text-indigo-600")} />
            <span className={cn("text-sm font-medium", isDark ? "text-slate-400 group-hover:text-white" : "text-slate-500 group-hover:text-indigo-600")}>返回课程</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className={cn("h-5 w-5", isDark ? "text-indigo-400" : "text-indigo-600")} />
            <span className={cn("font-heading font-bold", isDark ? "text-white" : "text-slate-800")}>NexusAI</span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-md px-4 py-10">
        {/* 加载中 */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>加载中...</p>
          </div>
        )}

        {/* 创建订单中 */}
        {step === 'create_order' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>正在创建订单...</p>
          </div>
        )}

        {/* 显示二维码 */}
        {step === 'show_qr' && order && (
          <div className="space-y-6">
            {/* 订单信息 */}
            <Card className={cn(isDark ? "bg-[#12121a] border-white/5" : "bg-white border-slate-200/80")}>
              <CardContent className="p-6">
                <h2 className={cn("text-center font-heading text-lg font-bold mb-4", isDark ? "text-white" : "text-slate-800")}>
                  微信扫码支付
                </h2>

                {/* 商品信息 */}
                <div className={cn("p-4 rounded-xl mb-6", isDark ? "bg-[#1a1a2e]" : "bg-slate-50")}>
                  <p className={cn("text-sm mb-1", isDark ? "text-slate-400" : "text-slate-500")}>购买课程</p>
                  <p className={cn("text-base font-bold", isDark ? "text-white" : "text-slate-800")}>{order.productName}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed">
                    <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>实付金额</span>
                    <span className={cn("text-2xl font-black", isDark ? "text-amber-400" : "text-amber-600")}>
                      ¥{(order.totalFee / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className={cn("p-4 rounded-2xl", isDark ? "bg-white" : "bg-white shadow-lg")}>
                    {qrCode ? (
                      <img src={qrCode} alt="支付二维码" className="w-[200px] h-[200px]" />
                    ) : (
                      <div className={cn("w-[200px] h-[200px] flex items-center justify-center", isDark ? "text-slate-600" : "text-slate-300")}>
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    )}
                  </div>
                  <p className={cn("text-sm text-center", isDark ? "text-slate-400" : "text-slate-500")}>
                    <Smartphone className="inline h-4 w-4 mr-1" />
                    请使用微信扫一扫完成支付
                  </p>
                </div>

                {/* 倒计时 */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                  <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    订单有效期: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                {/* 订单号 */}
                <div className={cn("flex items-center justify-center gap-2", isDark ? "text-slate-500" : "text-slate-400")}>
                  <span className="text-xs">订单号: {order.outTradeNo}</span>
                </div>
              </CardContent>
            </Card>

            {/* 开发模式: 模拟支付按钮 */}
            <div className={cn("p-4 rounded-xl border", isDark ? "bg-emerald-500/10 border-emerald-500/30" : "bg-emerald-50 border-emerald-200")}>
              <p className={cn("text-xs font-medium mb-2", isDark ? "text-emerald-400" : "text-emerald-600")}>
                🧪 开发模式
              </p>
              <p className={cn("text-xs mb-3", isDark ? "text-emerald-300" : "text-emerald-500")}>
                当前为开发环境，点击下方按钮模拟微信支付
              </p>
              <Button
                onClick={handleMockPay}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                模拟支付完成
              </Button>
            </div>

            {/* 轮询状态 */}
            <p className={cn("text-center text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
              已轮询 {pollCount} 次 · 每3秒自动检测支付状态
            </p>
          </div>
        )}

        {/* 支付成功 */}
        {step === 'paid' && order && (
          <div className="space-y-6">
            <div className="text-center py-10 space-y-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-emerald-500/20 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                </div>
              </div>
              <h2 className={cn("text-2xl font-black", isDark ? "text-white" : "text-slate-800")}>支付成功！🎉</h2>
              <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                你已成功购买 <strong>{order.productName}</strong>
              </p>
              <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                订单号: {order.outTradeNo}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/learn">
                <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                  开始学习 <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/premium">
                <Button variant="outline" className={cn("w-full h-12 rounded-xl", isDark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-600")}>
                  继续浏览课程
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* 错误 */}
        {step === 'error' && (
          <div className="text-center py-20 space-y-4">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
            <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-800")}>下单失败</h2>
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{errorMsg}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()} variant="outline">重新加载</Button>
              <Link href="/premium">
                <Button>返回课程列表</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className={cn("min-h-screen flex items-center justify-center", "bg-[#0a0a0f] text-white")}>
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-400">加载中...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
