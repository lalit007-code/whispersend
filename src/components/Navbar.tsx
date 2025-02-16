"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <header className="px-4  lg:px-6 h-14 flex items-center backdrop-blur-md shadow-md">
      <Link className="flex items-center justify-center" href="/">
        <MessageSquare className="h-6 w-6 mr-2" />
        <span className="font-bold">FeedbackHub</span>
      </Link>

      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        {!session && (
          <>
            <Link
              className="text-sm font-medium transition-colors"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium  transition-colors"
              href="#how-it-works"
            >
              How It Works
            </Link>
          </>
        )}

        {session ? (
          <>
            <Link href="/">Home</Link>
            <Link href="/dashboard">
              <span>Dashboard</span>
            </Link>
            <span className="text-sm font-medium">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button variant="ghost" className="text-sm">
              Login
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
