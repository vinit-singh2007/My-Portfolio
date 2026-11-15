import { NextResponse } from 'next/server';

export const revalidate = 86400; // Cache for 24 hours

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  const country = searchParams.get('country') || 'IN';
  const limit = searchParams.get('limit') || '5';

  if (!term) {
    return NextResponse.json({ error: 'term query parameter is required' }, { status: 400 });
  }

  try {
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
      term
    )}&entity=song&limit=${limit}&country=${country}`;
    const res = await fetch(itunesUrl, {
      headers: {
        'User-Agent': 'Portfolio/1.0',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'iTunes API response not ok' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'iTunes search failed' }, { status: 500 });
  }
}
