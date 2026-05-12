// Redis 客户端 - 使用 Upstash REST API
// 存储用户 VIP 信息

export interface VipInfo {
  isVip: boolean
  expire: string  // YYYY-MM-DD
  since: string   // 开通日期 YYYY-MM-DD
}

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

// 是否配置了 Redis
function isConfigured(): boolean {
  return !!REST_URL && !!TOKEN
}

// Upstash REST API 调用
async function redisCommand(command: string, ...args: string[]): Promise<any> {
  if (!isConfigured()) return null

  try {
    const res = await fetch(`${REST_URL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command, args }),
    })
    return await res.json()
  } catch {
    return null
  }
}

// 获取用户 VIP 信息
export async function getVipStatus(openid: string): Promise<VipInfo> {
  if (!isConfigured()) return { isVip: false, expire: '', since: '' }

  const data = await redisCommand('GET', `vip:${openid}`)
  if (!data) return { isVip: false, expire: '', since: '' }

  try {
    return JSON.parse(data)
  } catch {
    return { isVip: false, expire: '', since: '' }
  }
}

// 设置用户 VIP（管理员用）
export async function setVip(openid: string, expireDate: string): Promise<boolean> {
  if (!isConfigured()) return false

  const now = new Date().toISOString().split('T')[0]
  const vip: VipInfo = { isVip: true, expire: expireDate, since: now }

  const result = await redisCommand('SET', `vip:${openid}`, JSON.stringify(vip))
  return result !== null
}

// 取消 VIP
export async function removeVip(openid: string): Promise<boolean> {
  if (!isConfigured()) return false

  const result = await redisCommand('DEL', `vip:${openid}`)
  return result !== null
}

// 所有 VIP 列表（管理员用）
export async function getAllVip(): Promise<Record<string, VipInfo>> {
  if (!isConfigured()) return {}

  const keys = await redisCommand('KEYS', 'vip:*')
  if (!keys || !Array.isArray(keys)) return {}

  const result: Record<string, VipInfo> = {}
  for (const key of keys) {
    const openid = key.replace('vip:', '')
    const data = await redisCommand('GET', key)
    if (data) {
      try {
        result[openid] = JSON.parse(data)
      } catch { /* 忽略 */ }
    }
  }
  return result
}
