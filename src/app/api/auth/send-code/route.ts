import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { saveCode } from '@/lib/code-store';

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// 生成6位验证码
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, type = 'login' } = await request.json();
    
    // 验证邮箱格式
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }
    
    // 生成验证码
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分钟有效期
    
    // 保存验证码（文件存储，生产环境需换数据库）
    saveCode(email, code);
    
    // 开发环境：直接返回验证码，不实际发送邮件
    if (process.env.NODE_ENV === 'development') {
      console.log(`【开发环境】验证码 ${code} 已发送至 ${email}`);
      return NextResponse.json({
        success: true,
        message: '验证码已发送（开发模式）',
        code, // 开发环境直接返回验证码方便测试
      });
    }
    
    // 生产环境：发送邮件
    const resend = getResend();
    if (!resend) {
      console.error('RESEND_API_KEY 未配置');
      return NextResponse.json(
        { error: '邮件服务未配置，请联系管理员' },
        { status: 500 }
      );
    }
    try {
      const emailSubject = type === 'register' 
        ? 'NexusAI 注册验证码' 
        : 'NexusAI 登录验证码';
      
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; color: #6366f1; margin: 0;">NexusAI</h1>
          </div>
          <div style="background: #1e1e2e; border-radius: 16px; padding: 32px; border: 1px solid #2e2e3e;">
            <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 24px 0; text-align: center;">
              ${type === 'register' ? '注册验证码' : '登录验证码'}
            </h2>
            <div style="background: #2e2e3e; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px 0;">你的验证码是</p>
              <p style="color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0;">
                ${code}
              </p>
            </div>
            <p style="color: #94a3b8; font-size: 14px; text-align: center; margin: 0;">
              验证码将在 10 分钟后过期，请尽快使用。
            </p>
          </div>
          <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 24px;">
            如果你没有发起这个请求，请忽略此邮件。
          </p>
        </div>
      `;
      
      const { error } = await resend.emails.send({
        from: 'onboarding@resend.dev', // Resend 开发环境发件地址
        to: email,
        subject: emailSubject,
        html: emailHtml,
      });
      
      if (error) {
        console.error('发送邮件失败:', error);
        return NextResponse.json(
          { error: '发送验证码失败，请稍后重试' },
          { status: 500 }
        );
      }
    } catch (emailError) {
      console.error('发送邮件异常:', emailError);
      return NextResponse.json(
        { error: '发送验证码失败，请稍后重试' },
        { status: 500 }
      );
    }
    
    console.log(`验证码 ${code} 已发送至 ${email}`);
    
    return NextResponse.json({
      success: true,
      message: '验证码已发送',
    });

  } catch (error) {
    console.error('发送验证码错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
