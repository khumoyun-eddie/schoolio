"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (role) {
      router.push(`/${role}`);
    }
  }, [user]);
  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <h1 className="text-2xl justify-center font-bold tracking-tight text-zinc-950 flex items-center gap-2 ">
              <Image src="/logo.png" alt="logo" width={24} height={24} />
              Schoolio
            </h1>
            <h2 className="text-gray-400 text-sm">Sign In to your account</h2>
          </header>

          <Clerk.GlobalError className="text-sm text-red-400" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-sm text-gray-500">Username</Clerk.Label>
            <Clerk.Input type="text" required className="rounded-md p-2 ring-1 ring-gray-300" />
            <Clerk.FieldError className="text-sm text-red-400" />
          </Clerk.Field>

          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-sm text-gray-500">Password</Clerk.Label>
            <Clerk.Input type="password" required className="rounded-md p-2 ring-1 ring-gray-300" />
            <Clerk.FieldError className="text-sm text-red-400" />
          </Clerk.Field>

          <SignIn.Action
            className="w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none hover:bg-blue-400 "
            submit
          >
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
