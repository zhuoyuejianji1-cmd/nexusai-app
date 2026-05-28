import assert from 'node:assert/strict'

process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
process.env.UPSTASH_REDIS_REST_TOKEN = 'token'

const requests: unknown[] = []

globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
  const body = JSON.parse(String(init?.body || '[]'))
  requests.push(body)

  if (body[0] === 'GET' && body[1] === 'vip:openid-abc') {
    return {
      json: async () => ({
        result: JSON.stringify({ isVip: true, expire: '2030-01-01', since: '2026-05-23' }),
      }),
    } as Response
  }

  return {
    json: async () => ({ result: 'OK' }),
  } as Response
}) as typeof fetch

async function main() {
  const { getVipStatus, setVip } = await import('../src/lib/redis')
  const { getProduct } = await import('../src/lib/payment')

  const vip = await getVipStatus('openid-abc')
  assert.equal(vip.isVip, true)
  assert.equal(vip.expire, '2030-01-01')
  assert.equal(vip.since, '2026-05-23')

  const saved = await setVip('openid-abc', '2030-02-01')
  assert.equal(saved, true)

  assert.equal(getProduct('vip_monthly')?.price, 2990)
  assert.equal(getProduct('vip_yearly')?.price, 7900)
  assert.equal(getProduct('vip_forever')?.price, 9900)

  assert.deepEqual(requests[0], ['GET', 'vip:openid-abc'])
  assert.deepEqual(requests[1], [
    'SET',
    'vip:openid-abc',
    JSON.stringify({ isVip: true, expire: '2030-02-01', since: new Date().toISOString().split('T')[0] }),
  ])

  console.log('vip-persistence tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
