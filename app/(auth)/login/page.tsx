"use client";

import Link from "next/link";
import { Form } from "@/components/form";
import { SubmitButton } from "@/components/submit-button";
import { useActionState, useEffect } from "react";
import { login, LoginActionState } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid credentials!");
    } else if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <div className="flex h-screen w-screen">
      {/* Left Section - Form */}
      <div className="w-1/2 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Use your email and password to sign in
            </p>
          </div>
          <Form action={formAction}>
            <SubmitButton>Sign in</SubmitButton>
            <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {"Don't have an account? "}
              <Link
                href="/register"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                Sign up
              </Link>
              {" for free."}
            </p>
          </Form>
        </div>
      </div>

      {/* Right Section - Background Image */}
      <div 
        className="w-1/2 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(https://i.pinimg.com/736x/2a/24/d4/2a24d47e8a0249f2ff13a52594ba3aca.jpg)",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.5)' // Optional: adds a dark overlay
        }}
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-serif mb-4">Welcome to Enki</h1>
            <p className="text-xl">Your learning journey continues here</p>
          </div>
        </div>
      </div>
    </div>
  );
}