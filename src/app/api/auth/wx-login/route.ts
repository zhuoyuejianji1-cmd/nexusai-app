import { NextRequest, NextResponse } from 'next/server';
import { getVipStatus } from '@/lib/redis';

export const runtime = 'nodejs';

// POST /api/auth/wx-login - 微信小程序登录
export async function POST(request: NextRequest) {
  try {
    const { code, nickname, avatarUrl } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: '缺少临时 code' },
        { status: 400 }
      );
    }

    const appid = process.env.WECHAT_APPID;
    const secret = process.env.WECHAT_APP_SECRET;

    if (!appid || !secret) {
      console.error('微信登录配置缺失: WECHAT_APPID 或 WECHAT_APP_SECRET 未设置');
      return NextResponse.json(
        { error: '服务器配置错误' },
        { status: 500 }
      );
    }

    const wxRes = await fetch(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
      { method: 'GET' }
    );

    const wxData = await wxRes.json();

    if (wxData.errcode) {
      console.error('微信登录失败:', wxData);
      return NextResponse.json(
        { error: '微信登录失败: ' + (wxData.errmsg || '未知错误') },
        { status: 400 }
      );
    }

    const { openid, session_key } = wxData;

    if (!openid) {
      return NextResponse.json(
        { error: '获取 openid 失败' },
        { status: 400 }
      );
    }

    // 查询 VIP 状态
    let isVip = false;
    let vipExpire = '';
    try {
      const vip = await getVipStatus(openid);
      const now = new Date().toISOString().split('T')[0];
      isVip = vip.isVip && vip.expire >= now;
      vipExpire = vip.expire || '';
    } catch { /* Redis不可用则降级 */ }

    const tokenData = {
      openid,
      userId: openid,
      nickname: nickname || '微信用户',
      avatar: avatarUrl || null,
      is_vip: isVip,
      vip_expire: vipExpire,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      user: {
        openid,
        nickname: nickname || '微信用户',
        avatar: avatarUrl || null,
        is_vip: isVip,
        vip_expire: vipExpire,
      },
    });

  } catch (error: any) {
    console.error('微信登录错误 - name:', error?.name, 'message:', error?.message, 'stack:', error?.stack?.slice(0, 500));
    return NextResponse.json(
      { error: '服务器错误: ' + (error?.message || '未知错误') },
      { status: 500 }
    );
  }
}
