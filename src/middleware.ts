/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth as middleware } from "@/auth";


export default middleware(async (_req) => {
//   const {  nextUrl, auth } = req;
//   const isLoggedIn = auth?.user;
//   const LOGIN = "/auth/login";
//   const LOBBY_ROUTE = "/shop";
//   const isLogin = nextUrl.pathname == LOGIN;

//   console.log("isLoggedIn:", isLoggedIn);
//   console.log("nextUrl.pathname:", nextUrl.pathname);

// //   if (nextUrl.pathname == "/") {
// //     console.log("Redirecting to LOBBY_ROUTE from /");
// //     return NextResponse.redirect(new URL(LOBBY_ROUTE, nextUrl));
// //   }

//   if (isLoggedIn && isLogin) {
//     console.log("Redirecting to LOBBY_ROUTE from LOGIN");
//     return NextResponse.redirect(new URL(LOBBY_ROUTE, nextUrl));
//   }

  
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|404|401|auth/login).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
