/**
 * 验证码临时存储
 * 
 * 在无数据库环境下使用文件系统存储验证码。
 * 开发环境: 存储在本地 ./tmp/codes.json
 * Vercel: 存储在 /tmp/codes.json（每个 Lambda 实例独立）
 * 
 * 注意：Vercel Serverless 多实例部署时，验证码仅对同一个实例有效。
 * 生产环境建议换用 Redis/数据库方案。
 */

import fs from 'fs';
import path from 'path';

interface CodeRecord {
  code: string;
  email: string;
  expiresAt: number;
  used: boolean;
}

const STORAGE_DIR = process.env.VERCEL ? '/tmp' : 
  path.join(process.cwd(), '.tmp');
const STORAGE_FILE = path.join(STORAGE_DIR, 'verification-codes.json');

function ensureDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function readAll(): Record<string, CodeRecord[]> {
  try {
    ensureDir();
    if (!fs.existsSync(STORAGE_FILE)) return {};
    const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, CodeRecord[]>) {
  ensureDir();
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data), 'utf-8');
}

export function saveCode(email: string, code: string): void {
  const data = readAll();
  const key = email.toLowerCase();
  if (!data[key]) data[key] = [];
  // 清理过期 + 旧验证码
  data[key] = data[key].filter(c => c.expiresAt > Date.now());
  data[key].push({
    code,
    email,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10分钟
    used: false,
  });
  writeAll(data);
}

export function verifyCode(email: string, code: string): boolean {
  const data = readAll();
  const key = email.toLowerCase();
  const records = data[key];
  if (!records || records.length === 0) return false;

  const match = records.find(
    c => c.code === code && c.expiresAt > Date.now() && !c.used
  );
  if (!match) return false;

  // 标记已使用
  match.used = true;
  writeAll(data);
  return true;
}

export function cleanupExpired(): void {
  const data = readAll();
  let changed = false;
  for (const key of Object.keys(data)) {
    data[key] = data[key].filter(c => c.expiresAt > Date.now());
    if (data[key].length === 0) {
      delete data[key];
      changed = true;
    }
  }
  if (changed) writeAll(data);
}
