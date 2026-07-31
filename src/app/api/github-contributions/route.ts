import { NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/apiRateLimit';

export const revalidate = 3600;

/** Only this portfolio’s GitHub user — blocks open-proxy abuse via ?username= */
const CANONICAL = process.env.GITHUB_USERNAME || 'FarhanSayed16';

export async function GET(request: Request) {
  const limited = rateLimit(`gh:${clientIp(request)}`, { limit: 30, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(limited.retryAfterSec) },
      }
    );
  }

  const requested = (new URL(request.url).searchParams.get('username') || CANONICAL).trim();
  if (requested.toLowerCase() !== CANONICAL.toLowerCase()) {
    return NextResponse.json({ error: 'Username not allowed' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://github-contributions-api.deno.dev/${encodeURIComponent(CANONICAL)}.json`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch from Deno API: ${res.status}`);
    }

    const data = await res.json();
    let total = data.totalContributions || 0;

    const rawWeeks: Array<
      Array<{
        date: string;
        contributionCount: number;
        contributionLevel: string;
      }>
    > = data.contributions || [];

    const weeks = rawWeeks.map((week) =>
      week.map((day) => {
        let level = 0;
        if (day.contributionLevel === 'FIRST_QUARTILE') level = 1;
        else if (day.contributionLevel === 'SECOND_QUARTILE') level = 2;
        else if (day.contributionLevel === 'THIRD_QUARTILE') level = 3;
        else if (day.contributionLevel === 'FOURTH_QUARTILE') level = 4;
        else if (day.contributionCount > 0) {
          if (day.contributionCount >= 10) level = 4;
          else if (day.contributionCount >= 6) level = 3;
          else if (day.contributionCount >= 3) level = 2;
          else level = 1;
        }

        return {
          date: day.date,
          count: day.contributionCount || 0,
          level,
        };
      })
    );

    if (!total) {
      total = weeks.reduce((acc, w) => acc + w.reduce((s, d) => s + d.count, 0), 0);
    }

    return NextResponse.json(
      { totalContributions: total, weeks },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching real GitHub contributions:', error);
    return NextResponse.json({ error: 'Failed to fetch real contribution data' }, { status: 500 });
  }
}
