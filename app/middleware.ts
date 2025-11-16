import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const publicRoutes = ['/login', '/register', '/'];

const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') {
      return pathname === route;
    }
    return pathname.startsWith(route);
  });

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (isPublicRoute) {
    if (token && (pathname === '/login' || pathname === '/register')) {
      const decoded = verifyToken(token);
      if (decoded) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.id);
    requestHeaders.set('x-user-role', decoded.role);
    requestHeaders.set('x-user-email', decoded.email);
    requestHeaders.set('x-user-nama', decoded.nama);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
