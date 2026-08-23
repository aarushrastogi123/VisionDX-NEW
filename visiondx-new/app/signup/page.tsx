"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const nextUrl = searchParams.get("next") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          age,
          gender,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setMessage(
        "Account created successfully! Redirecting to login..."
      );

      setLoading(false);

      setTimeout(() => {
        router.push(
          `/login?next=${encodeURIComponent(nextUrl)}`
        );
      }, 1500);

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
          className="mb-8 block text-center text-4xl font-bold tracking-tight text-white"
        >
          Vision<span className="text-cyan-300">DX</span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur sm:p-10">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Get Started
            </p>

            <h1 className="mt-3 text-3xl font-bold text-white">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Create an account to save your retinal analysis history.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full name
              </label>

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-slate-700 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              />
            </div>

            {/* Age */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Age
              </label>

              <input
                type="number"
                placeholder="Your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
                required
                className="w-full rounded-xl border border-slate-700 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-950 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

            {message && (
              <p className="text-center text-sm text-cyan-300">
                {message}
              </p>
            )}

          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Already have an account?{" "}

            <Link
              href={`/login?next=${encodeURIComponent(nextUrl)}`}
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Login
            </Link>
          </p>

        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-slate-500 transition hover:text-cyan-300"
        >
          ← Back to VisionDX
        </Link>

      </div>
    </main>
  );
}