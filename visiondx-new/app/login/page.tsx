"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "apple-liquid-glass-ui";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextUrl = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        router.push(nextUrl);
      }, 1000);
    } catch {
      setMessage("Unable to connect to the server");
      setLoading(false);
    }
  };

  return (
    <main className="vision-auth-backdrop flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
      <div className="w-full max-w-md">
        <Link
          href="/"
          aria-label="VisionDX home"
          className="mb-8 flex items-center justify-center gap-2.5 text-2xl font-semibold tracking-[-0.04em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#75e3df]"
        >
          <Image src="/icon.png" alt="" width={40} height={40} priority className="h-10 w-10 rounded-xl object-cover" />
          Vision<span className="-ml-2 text-[#75e3df]">DX</span>
        </Link>

        <div className="gl-glass-elevated rounded-2xl p-6 sm:p-9">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#75e3df]">
              Welcome back
            </p>

            <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] text-[#edf8fa]">
              Sign in to VisionDX
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#b5cad3]">
              Access your account and saved analysis history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-[#d3e4e9]">
                Email address
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="vision-glass-input min-h-12 w-full rounded-lg px-4 py-3 outline-none transition placeholder:text-white/45 focus:ring-2 focus:ring-cyan-300/20"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-[#d3e4e9]">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="vision-glass-input min-h-12 w-full rounded-lg px-4 py-3 outline-none transition placeholder:text-white/45 focus:ring-2 focus:ring-cyan-300/20"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full"
              aria-busy={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {message && (
              <p role="status" aria-live="polite" className="text-center text-sm text-[#61cce5]">
                {message}
              </p>
            )}
          </form>

          <p className="mt-7 text-center text-sm text-[#b5cad3]">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(nextUrl)}`}
              className="font-semibold text-[#75e3df] underline decoration-transparent underline-offset-4 transition hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df]"
            >
              Create one
            </Link>
          </p>
        </div>

        <Link
          href={
            nextUrl === "/"
              ? "/"
              : `/login?next=${encodeURIComponent(nextUrl)}`
          }
          className="mt-6 block min-h-11 rounded-lg py-3 text-center text-sm text-[#9db3be] transition-colors hover:text-[#75e3df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df]"
        >
          ← Back to VisionDX
        </Link>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="vision-auth-backdrop grid min-h-screen place-items-center text-[#b5cad3]" role="status">Loading sign-in…</main>}>
      <LoginContent />
    </Suspense>
  );
}
