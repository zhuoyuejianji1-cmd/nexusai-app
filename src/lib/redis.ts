// Redis 客户端 - 使用 Upstash REST API（纯fetch，零依赖）
// 存储用户 VIP 信息

export interface VipInfo {
  isVip: boolean
  expire: string  // YYYY-MM-DD
  since: string   // 开通日期 YYYY-MM-DD
}

const REST_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

export function isConfigured(): boolean {
  return !!REST_URL && !!TOKEN
}

// Upstash REST API 调用（零依赖）
async function redisCmd(command: string, ...args: string[]): Promise<any> {
  if (!isConfigured()) return null
  try {
    const res = await fetch(REST_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([command, ...args]),
    })
    const data = await res.json()
    if (data && typeof data === 'object' && 'result' in data) return data.result
    return data
  } catch (e) {
    console.error('[Redis] 命令失败:', command, e)
    return null
  }
}

// 获取用户 VIP 信息
export async function getVipStatus(openid: string): Promise<VipInfo> {
  if (!isConfigured()) return { isVip: false, expire: '', since: '' }
  const data = await redisCmd('GET', `vip:${openid}`)
  if (!data || data === null) return { isVip: false, expire: '', since: '' }
  try {
    return JSON.parse(data)
  } catch {
    return { isVip: false, expire: '', since: '' }
  }
}

// 设置用户 VIP
export async function setVip(openid: string, expireDate: string): Promise<boolean> {
  if (!isConfigured()) return false
  const now = new Date().toISOString().split('T')[0]
  const vip: VipInfo = { isVip: true, expire: expireDate, since: now }
  const result = await redisCmd('SET', `vip:${openid}`, JSON.stringify(vip))
  return result !== null
}

// 取消 VIP
export async function removeVip(openid: string): Promise<boolean> {
  if (!isConfigured()) return false
  return (await redisCmd('DEL', `vip:${openid}`)) !== null
}

// 获取所有 VIP 用户
export async function getAllVip(): Promise<Record<string, VipInfo>> {
  if (!isConfigured()) return {}
  const keys = await redisCmd('KEYS', 'vip:*')
  if (!Array.isArray(keys)) return {}
  const result: Record<string, VipInfo> = {}
  for (const key of keys) {
    const openid = (key as string).replace('vip:', '')
    const data = await redisCmd('GET', key as string)
    if (data) {
      try { result[openid] = JSON.parse(data) } catch { /* skip */ }
    }
  }
  return result
}
