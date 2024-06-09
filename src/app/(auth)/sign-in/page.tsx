"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();

  if (session) {
    return (
      <>
        signined in as {session.user.email}
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      not signed in <br></br>
      <button onClick={() => signIn()}>Sign In</button>
    </>
  );
}
