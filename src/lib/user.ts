import { createHash } from 'crypto';

// 根据openid生成确定性6位数用户ID（100000-999999）
// 同一openid始终返回相同ID，无需数据库存储
export function generateUserId(openid: string): string {
  const hash = createHash('sha256').update(openid).digest('hex');
  // 取前8位十六进制转10进制，模900000，加100000保证6位
  const num = parseInt(hash.slice(0, 8), 16);
  const id = (num % 900000) + 100000;
  return String(id);
}

// 用户缓存（内存中，同一次部署内有效）
const userCache = new Map<string, { openid: string; userId: string; nickname: string; avatar: string | null; createdAt: number }>();

export function getUserByOpenid(openid: string) {
  return userCache.get(openid);
}

export function createUser(openid: string, nickname?: string, avatar?: string | null) {
  const userId = generateUserId(openid);
  const user = {
    openid,
    userId,
    nickname: nickname || '微信用户',
    avatar: avatar || null,
    createdAt: Date.now(),
  };
  userCache.set(openid, user);
  return user;
}

export function getOrCreateUser(openid: string, nickname?: string, avatar?: string | null) {
  const existing = getUserByOpenid(openid);
  if (existing) {
    // 更新昵称和头像（用户可能改了）
    if (nickname) existing.nickname = nickname;
    if (avatar) existing.avatar = avatar;
    return existing;
  }
  return createUser(openid, nickname, avatar);
}
