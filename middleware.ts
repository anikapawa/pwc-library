import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const allowedEmails = ["anikapawa25@gmail.com"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("MIDDLEWARE USER:", user?.email);

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    (!user || !allowedEmails.includes(user.email ?? ""))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};