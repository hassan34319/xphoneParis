// middleware.js
import { NextResponse } from 'next/server';
import maintenanceConfig from './maintenance.json';

const maintenancePaths = ['/maintenance', '/_next', '/api'];

export function middleware(req) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  if (maintenancePaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (maintenanceConfig.enabled) {
    url.pathname = '/maintenance';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
