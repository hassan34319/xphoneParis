// middleware.js
export function middleware(request) {
  const isMaintenanceMode = true; // or process.env.MAINTENANCE_MODE === 'true'
  
  // Don't redirect maintenance page itself
  if (request.nextUrl.pathname === '/maintenance') {
    return;
  }

  // Don't redirect _next internal routes
  if (request.nextUrl.pathname.startsWith('/_next')) {
    return;
  }

  if (isMaintenanceMode) {
    return Response.redirect(new URL('/maintenance', request.url));
  }
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};