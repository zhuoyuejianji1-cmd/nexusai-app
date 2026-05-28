import { generateUserId, type UserInfo } from '@/lib/user';
import type { VipInfo } from '@/lib/redis';

interface BuildWxUserPayloadArgs {
  tokenData?: Record<string, any> | null;
  storedUser?: UserInfo | null;
  vip?: VipInfo | null;
}

export interface WxUserPayload {
  user: {
    openid: string;
    userId: string;
    nickname: string;
    avatar: string | null;
    is_vip: boolean;
    vip_expire: string;
    vip_since: string;
  };
  tokenData: Record<string, any>;
}

export function buildWxUserPayload({
  tokenData,
  storedUser,
  vip,
}: BuildWxUserPayloadArgs): WxUserPayload {
  const openid = storedUser?.openid || tokenData?.openid || '';
  const userId = storedUser?.userId || tokenData?.userId || generateUserId(openid);
  const vipExpire = vip?.expire || storedUser?.vip_expire || tokenData?.vip_expire || '';
  const isVip = Boolean(vip?.isVip || storedUser?.is_vip || tokenData?.is_vip);

  const user = {
    openid,
    userId,
    nickname: storedUser?.nickname || tokenData?.nickname || '微信用户',
    avatar: storedUser?.avatar || tokenData?.avatar || null,
    is_vip: isVip,
    vip_expire: vipExpire,
    vip_since: vip?.since || tokenData?.vip_since || '',
  };

  return {
    user,
    tokenData: {
      ...(tokenData || {}),
      ...user,
      exp: tokenData?.exp || Date.now() + 30 * 24 * 60 * 60 * 1000,
    },
  };
}
