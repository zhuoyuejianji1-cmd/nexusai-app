import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'NexusAI - AI 学习社区',
    template: '%s | NexusAI',
  },
  description: 'AI 学习社区，在这里追踪 AI 前沿动态、分享学习心得、完成成长任务',
  keywords: ['AI', '人工智能', '学习社区', 'AI工具', '机器学习', '深度学习'],
  authors: [{ name: 'NexusAI Team' }],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {isDev && <Inspector />}
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </body>
    </html>
  );
}
