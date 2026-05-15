import { NextRequest, NextResponse } from 'next/server';
import { getVipStatus, isConfigured } from '@/lib/redis';
import { createOrder } from '@/lib/payment';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

// POST /api/courses/activate - VIP用户激活课程（免费获取百度网盘链接）
// 需要认证token，验证VIP身份，创建免费订单记录
export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: '缺少课程ID' }, { status: 400 });
    }

    // 解析token获取用户信息
    let userId: string | undefined;
    let tokenIsVip = false;
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        userId = tokenData.openid || tokenData.userId;
        // token中携带的VIP标识（登录时从Redis写入）
        tokenIsVip = !!tokenData.is_vip;
      } catch { /* ignore */ }
    }
    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    // 验证VIP状态：优先查Redis，Redis不可用时信任token
    let vipValid = false;
    const redisOk = isConfigured();
    if (redisOk) {
      // Redis已配置 → 以Redis为准
      try {
        const vip = await getVipStatus(userId);
        const now = new Date().toISOString().split('T')[0];
        vipValid = vip.isVip && vip.expire >= now;
      } catch {
        // Redis查询异常 → 信任token
        vipValid = tokenIsVip;
      }
    } else {
      // Redis未配置 → 降级：token说VIP就是VIP，否则允许（免费模式）
      vipValid = true;
    }
    if (!vipValid) {
      return NextResponse.json({ error: '需要VIP会员才能激活课程' }, { status: 403 });
    }

    // 读取课程数据获取百度网盘链接
    const filePath = path.join(process.cwd(), 'src', 'data', 'courses.json');
    let baiduLinks: Array<{ link: string; password: string }> = [];
    let courseTitle = '课程';
    if (existsSync(filePath)) {
      const raw = readFileSync(filePath, 'utf-8');
      const courses = JSON.parse(raw);
      const course = courses.find((c: any) => String(c.id) === courseId);
      if (course) {
        baiduLinks = course.baiduLinks || [];
        courseTitle = course.title || '课程';
      }
    }
    if (!baiduLinks.length) {
      return NextResponse.json({ error: '课程暂无下载资源' }, { status: 404 });
    }

    // 创建免费订单记录（标记该课程已被该用户激活）
    const product = { id: courseId, name: courseTitle, price: 0 };
    const order = createOrder(product, { userId });
    order.status = 'paid';
    order.paidAt = Date.now();

    return NextResponse.json({
      success: true,
      activated: true,
      baiduLinks,
      courseTitle,
    });
  } catch (error) {
    console.error('激活课程失败:', error);
    return NextResponse.json(
      { error: '激活失败: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
