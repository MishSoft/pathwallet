import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

// დაცული გვერდების სია
const protectedRoutes = [
  "/dashboard",
  "/income",
  "/expenses",
  "/goals",
  "/settings",
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
      await jose.jwtVerify(token, secret);
      // თუ ტოკენი ვალიდურია, მომხმარებელს შეუძლია გააგრძელოს
      if (
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/register"
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    } catch (error) {
      // ტოკენი არასწორია ან ვადა გაუვიდა, რიდირექთი login-ზე
      if (
        protectedRoutes.some((route) =>
          request.nextUrl.pathname.startsWith(route)
        )
      ) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token"); // წაშლა არასწორი ტოკენი
        return response;
      }
      return NextResponse.next();
    }
  }

  // თუ ტოკენი არ არის
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
