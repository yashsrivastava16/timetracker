import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const clerk = clerkMiddleware();

export default function middleware(req: NextRequest, ev: any) {
  // Bypass Clerk completely for cron jobs
  if (req.nextUrl.pathname.startsWith("/api/cron")) {
    return NextResponse.next();
  }
  return clerk(req, ev);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
