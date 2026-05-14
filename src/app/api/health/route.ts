import { NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'courses.json');
    const fileExists = existsSync(filePath);
    let courseCount = 0;
    let freeCount = 0;

    if (fileExists) {
      const raw = readFileSync(filePath, 'utf-8');
      const courses = JSON.parse(raw);
      courseCount = courses.length;
      freeCount = courses.filter((c: any) => c.isVipOnly === false).length;
    }

    return NextResponse.json({
      status: 'ok',
      env: {
        hasAppId: !!process.env.WECHAT_APPID,
        hasAppSecret: !!process.env.WECHAT_APP_SECRET,
        hasMchId: !!process.env.WECHAT_MCHID,
        nodeVersion: process.version,
      },
      courses: {
        fileExists,
        total: courseCount,
        free: freeCount,
      },
      cwd: process.cwd(),
    });
  } catch (e: any) {
    return NextResponse.json({
      status: 'error',
      message: e.message,
      stack: e.stack,
    }, { status: 500 });
  }
}
