import { createHash } from 'crypto';

// 根据openid生成确定性6位数用户ID（100000-999999）
// 同一openid始终返回相同ID，无需数据库存储
export function generateUserId(openid: string): string {
  const hash = createHash('sha256').update(openid).digest('hex');
  const num = parseInt(hash.slice(0, 8), 16);
  const id = (num % 900000) + 100000;
  return String(id);
}

export interface UserInfo {
  openid: string;
  userId: string;
  nickname: string;
  avatar: string | null;
  is_vip: boolean;
  vip_expire: string;
  created_at: number;
}

// ====== Redis 用户持久化（永久保存，不设TTL） ======
const USER_REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || '';
const USER_REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';

function redisAvailable(): boolean {
  return !!USER_REDIS_URL && !!USER_REDIS_TOKEN;
}

async function redisCmd(command: string, ...args: string[]): Promise<any> {
  if (!redisAvailable()) return null;
  try {
    const res = await fetch(USER_REDIS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${USER_REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([command, ...args]),
    });
    const data = await res.json();
    if (data && typeof data === 'object' && 'result' in data) return data.result;
    return data;
  } catch {
    return null;
  }
}

function userKey(openid: string): string {
  return `user:${openid}`;
}

// 内存缓存（加速频繁查询，Redis 是最终真相源）
const userCache = new Map<string, UserInfo>();

function cacheUser(user: UserInfo): void {
  userCache.set(user.openid, user);
}

// 根据openid从 Redis 获取用户
export async function getUserByOpenid(openid: string): Promise<UserInfo | null> {
  // 先查内存缓存
  const cached = userCache.get(openid);
  if (cached) return cached;

  // 查 Redis
  if (!redisAvailable()) return null;
  try {
    const data = await redisCmd('GET', userKey(openid));
    if (!data || data === null) return null;
    const user: UserInfo = JSON.parse(data);
    cacheUser(user);
    return user;
  } catch (err) {
    console.error('[Redis] 查询用户失败:', err);
    return null;
  }
}

// 保存用户到 Redis（永久保存，不设 TTL）
async function saveUser(user: UserInfo): Promise<void> {
  if (!redisAvailable()) return;
  try {
    await redisCmd('SET', userKey(user.openid), JSON.stringify(user));
  } catch (err) {
    console.error('[Redis] 保存用户失败:', err);
  }
}

// 创建用户（写入 Redis）
export async function createUser(openid: string, nickname?: string, avatar?: string | null): Promise<UserInfo> {
  const userId = generateUserId(openid);
  const user: UserInfo = {
    openid,
    userId,
    nickname: nickname || '微信用户',
    avatar: avatar || null,
    is_vip: false,
    vip_expire: '',
    created_at: Date.now(),
  };

  // 写入 Redis（永久保存，不设 TTL）
  await saveUser(user);

  cacheUser(user);
  return user;
}

// 获取或创建用户（Redis 优先）
export async function getOrCreateUser(openid: string, nickname?: string, avatar?: string | null): Promise<UserInfo> {
  // 先从 Redis 查
  const existing = await getUserByOpenid(openid);
  if (existing) {
    // 如果传入了新的昵称或头像，更新
    let changed = false;
    if (nickname && nickname !== '微信用户' && nickname !== existing.nickname) {
      existing.nickname = nickname;
      changed = true;
    }
    if (avatar && avatar !== existing.avatar) {
      existing.avatar = avatar;
      changed = true;
    }
    if (changed) {
      await saveUser(existing);
      cacheUser(existing);
    }
    return existing;
  }

  // Redis 里没有，创建新用户
  return createUser(openid, nickname, avatar);
}

// 更新用户昵称
export async function updateUserNickname(openid: string, nickname: string): Promise<boolean> {
  try {
    const user = await getUserByOpenid(openid);
    if (!user) return false;
    user.nickname = nickname;
    await saveUser(user);
    cacheUser(user);
    return true;
  } catch (err) {
    console.error('[Redis] 更新昵称失败:', err);
    return false;
  }
}

// 更新用户头像
export async function updateUserAvatar(openid: string, avatar: string): Promise<boolean> {
  try {
    const user = await getUserByOpenid(openid);
    if (!user) return false;
    user.avatar = avatar;
    await saveUser(user);
    cacheUser(user);
    return true;
  } catch (err) {
    console.error('[Redis] 更新头像失败:', err);
    return false;
  }
}

// 设置用户VIP状态（Redis 持久化）
export async function setUserVip(openid: string, isVip: boolean, vipExpire: string): Promise<boolean> {
  try {
    const user = await getUserByOpenid(openid);
    if (!user) return false;
    user.is_vip = isVip;
    user.vip_expire = vipExpire;
    await saveUser(user);
    cacheUser(user);
    return true;
  } catch (err) {
    console.error('[Redis] 更新VIP状态失败:', err);
    return false;
  }
}
