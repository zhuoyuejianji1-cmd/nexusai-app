import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// 初始化 Resend（使用用户提供的 API key）
const resend = new Resend(process.env.RESEND_API_KEY || 're_PJhhNMKW_EMkmJwBDva3dGyaQ6e6Uhq7X');

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
    
    // TODO: 保存到数据库
    // await db.insert(verification_codes).values({
    //   email,
    //   code,
    //   type,
    //   expires_at: expiresAt,
    // });
    
    // 发送邮件
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
      from: 'NexusAI <noreply@nexusai.com>',
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
    
    // TODO: 保存验证码到数据库（生产环境必须）
    // 这里先打印，实际使用时需要保存
    console.log(`验证码 ${code} 已发送至 ${email}`);
    
    return NextResponse.json({
      success: true,
      message: '验证码已发送',
      // TODO: 开发环境返回验证码方便测试
      ...(process.env.NODE_ENV === 'development' && { code }),
    });
    
  } catch (error) {
    console.error('发送验证码错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
