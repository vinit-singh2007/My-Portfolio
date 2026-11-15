import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const username = process.env.GITHUB_USERNAME || 'vinit-singh2007';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        error: 'Contributions currently unavailable',
        totalContributions: null,
        days: [],
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
      }
    }
  `;

  // Current year range
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();
  const yearEnd = now.toISOString();

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-AboutMe',
      },
      body: JSON.stringify({ query, variables: { username, from: yearStart, to: yearEnd } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch contribution data', totalContributions: null, days: [] },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    const data = await res.json();
    const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return NextResponse.json(
        { error: 'Failed to fetch contribution data', totalContributions: null, days: [] },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    // Collect non-zero counts to calculate quartiles
    const nonZeroCounts: number[] = [];
    calendar.weeks?.forEach((w: { contributionDays?: { contributionCount: number }[] }) => {
      w.contributionDays?.forEach((d) => {
        if (d.contributionCount > 0) {
          nonZeroCounts.push(d.contributionCount);
        }
      });
    });

    nonZeroCounts.sort((a, b) => a - b);
    const countLen = nonZeroCounts.length;
    const q1 = countLen > 0 ? nonZeroCounts[Math.floor(countLen * 0.25)] : 1;
    const q2 = countLen > 0 ? nonZeroCounts[Math.floor(countLen * 0.50)] : 2;
    const q3 = countLen > 0 ? nonZeroCounts[Math.floor(countLen * 0.75)] : 3;

    // Flatten weeks into list of day items (each with level 0-4)
    const days: { date: string; count: number; level: number; weekday: number }[] = [];
    calendar.weeks?.forEach(
      (w: { contributionDays?: { contributionCount: number; date: string; weekday: number }[] }) => {
        w.contributionDays?.forEach((d) => {
          let level = 0;
          if (d.contributionCount > 0) {
            if (d.contributionCount <= q1) level = 1;
            else if (d.contributionCount <= q2) level = 2;
            else if (d.contributionCount <= q3) level = 3;
            else level = 4;
          }
          days.push({
            date: d.date,
            count: d.contributionCount,
            level,
            weekday: d.weekday,
          });
        });
      }
    );

    return NextResponse.json(
      {
        totalContributions: calendar.totalContributions,
        days,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch contribution data', totalContributions: null, days: [] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }
}
