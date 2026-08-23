"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-950 to-slate-800 px-6 py-12">
      {/* Background glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="mb-10 block text-center text-4xl font-bold tracking-tight text-white"
        >
          Vision<span className="text-cyan-300">DX</span>
        </Link>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur sm:p-10">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Welcome back
            </p>

            <h1 className="mt-3 text-3xl font-bold text-white">
              Login to VisionDX
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Access your profile and retinal prediction history.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-950 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {message && (
              <p className="text-center text-sm text-cyan-300">
                {message}
              </p>
            )}
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(nextUrl)}`}
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Create one
            </Link>
          </p>
        </div>

        <Link
          href={nextUrl === "/" ? "/" : `/login?next=${encodeURIComponent(nextUrl)}`}
          className="mt-6 block text-center text-sm text-slate-500 transition hover:text-cyan-300"
        >
          ← Back to VisionDX
        </Link>
      </div>
    </main>
  );
}