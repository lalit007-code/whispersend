import "next-auth";
import { DefaultSession } from "next-auth";

//overriding next-auth predefined user with custom defined user

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerifed?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }

  interface Session {
    user: {
      _id?: string;
      isVerifed?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerifed?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}
