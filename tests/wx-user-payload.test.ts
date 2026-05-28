import assert from 'node:assert/strict'
import { buildWxUserPayload } from '../src/lib/wx-user-payload'

const payload = buildWxUserPayload({
  tokenData: {
    openid: 'openid-abc',
    userId: '123456',
    nickname: 'Token Name',
    avatar: 'token.png',
    exp: Date.now() + 1000,
  },
  storedUser: {
    openid: 'openid-abc',
    userId: '654321',
    nickname: 'Stored Name',
    avatar: 'stored.png',
    is_vip: true,
    vip_expire: '2026-12-31',
    created_at: Date.now(),
  },
  vip: {
    isVip: true,
    expire: '2027-01-01',
    since: '2026-01-01',
  },
})

assert.deepEqual(payload.user, {
  openid: 'openid-abc',
  userId: '654321',
  nickname: 'Stored Name',
  avatar: 'stored.png',
  is_vip: true,
  vip_expire: '2027-01-01',
  vip_since: '2026-01-01',
})

assert.equal(payload.tokenData.openid, 'openid-abc')
assert.equal(payload.tokenData.userId, '654321')
assert.equal(payload.tokenData.nickname, 'Stored Name')
assert.equal(payload.tokenData.avatar, 'stored.png')
assert.equal(payload.tokenData.is_vip, true)
assert.equal(payload.tokenData.vip_expire, '2027-01-01')

const uploadedAvatarPayload = buildWxUserPayload({
  tokenData: {
    openid: 'openid-abc',
    userId: '123456',
    nickname: 'Token Name',
    avatar: 'uploaded.png',
    exp: Date.now() + 1000,
  },
  storedUser: null,
  vip: null,
})

assert.equal(uploadedAvatarPayload.user.avatar, 'uploaded.png')
assert.equal(uploadedAvatarPayload.tokenData.avatar, 'uploaded.png')

console.log('wx-user-payload tests passed')
