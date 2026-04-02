import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect tracks URLs with spaces (decoded from %20) to dashed versions
  if (pathname.startsWith('/tracks/')) {
    const segments = pathname.split('/');
    let hasSpace = false;
    const fixedSegments = segments.map((seg) => {
      if (seg.includes(' ')) {
        hasSpace = true;
        return seg.replace(/ /g, '-');
      }
      return seg;
    });

    if (hasSpace) {
      const url = request.nextUrl.clone();
      url.pathname = fixedSegments.join('/');
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/tracks/:path*',
};
