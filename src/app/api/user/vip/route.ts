import { NextRequest, NextResponse } from 'next/server';
import { getVipStatus, setVipManual } from '@/lib/redis';

// GET /api/user/vip?openid=xxx - 查询会员状态
export async function GET(request: NextRequest) {
  const openid = request.nextUrl.searchParams.get('openid')
  if (!openid) {
    return NextResponse.json({ error: '缺少 openid 参数' }, { status: 400 })
  }

  const vip = await getVipStatus(openid)
  const now = new Date().toISOString().split('T')[0]
  const isValid = vip.isVip && vip.expire >= now

  return NextResponse.json({
    isVip: isValid,
    expire: vip.expire || null,
    since: vip.since || null,
    daysLeft: isValid ? Math.ceil((new Date(vip.expire).getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 0,
  })
}

// POST /api/user/vip - 设置/续费会员（仅管理员/系统调用）
export async function POST(request: NextRequest) {
  try {
    const { openid, expireDate } = await request.json()

    if (!openid) {
      return NextResponse.json({ error: '缺少 openid' }, { status: 400 })
    }

    const vip = expireDate
      ? await setVipManual(openid, expireDate)
      : await setVipManual(openid, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    return NextResponse.json({ success: true, vip })
  } catch (err) {
    return NextResponse.json({ error: '设置失败' }, { status: 500 })
  }
}
