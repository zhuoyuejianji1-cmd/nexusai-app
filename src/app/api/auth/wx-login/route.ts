import { NextRequest, NextResponse } from 'next/server';
import { getVipStatus } from '@/lib/redis';
import { getOrCreateUser, setUserVip } from '@/lib/user';
import { buildWxUserPayload } from '@/lib/wx-user-payload';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { code, nickname, avatarUrl } = await request.json();

    if (!code) {
      return NextResponse.json({ error: '缺少临时 code' }, { status: 400 });
    }

    const appid = process.env.WECHAT_APPID;
    const secret = process.env.WECHAT_APP_SECRET;

    if (!appid || !secret) {
      console.error('微信登录配置缺失: WECHAT_APPID 或 WECHAT_APP_SECRET 未设置');
      return NextResponse.json({ error: '服务器配置错误' }, { status: 500 });
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

    const { openid } = wxData;
    if (!openid) {
      return NextResponse.json({ error: '获取 openid 失败' }, { status: 400 });
    }

    const userObj = await getOrCreateUser(openid, nickname, avatarUrl);
    let vip = await getVipStatus(openid);
    const now = new Date().toISOString().split('T')[0];
    let isVip = userObj.is_vip;
    let vipExpire = userObj.vip_expire;

    if (!isVip && vip.isVip && vip.expire >= now) {
      isVip = true;
      vipExpire = vip.expire;
      await setUserVip(openid, true, vipExpire);
    }

    if (isVip && (!vip.isVip || !vip.expire)) {
      vip = { isVip: true, expire: vipExpire, since: vip.since || '' };
    }

    const payload = buildWxUserPayload({
      tokenData: {
        openid,
        is_vip: isVip,
        vip_expire: vipExpire,
        exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
      },
      storedUser: { ...userObj, is_vip: isVip, vip_expire: vipExpire },
      vip,
    });

    const token = Buffer.from(JSON.stringify(payload.tokenData)).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      user: payload.user,
    });
  } catch (error: any) {
    console.error('微信登录错误 - name:', error?.name, 'message:', error?.message, 'stack:', error?.stack?.slice(0, 500));
    return NextResponse.json(
      { error: '服务器错误: ' + (error?.message || '未知错误') },
      { status: 500 }
    );
  }
}
