"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "apple-liquid-glass-ui";

function SignupContent() {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, age, gender }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
    } catch {
      setMessage("Unable to connect to the server. Check your connection and try again.");
      setLoading(false);
    }
  };

  const inputClass = "vision-glass-input min-h-12 w-full rounded-lg px-4 py-3 text-[#edf8fa] outline-none transition placeholder:text-white/45 focus:ring-2 focus:ring-cyan-300/20";

  return (
    <main className="vision-auth-backdrop flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
      <div className="w-full max-w-lg">
        <Link href="/" aria-label="VisionDX home" className="mb-7 flex items-center justify-center gap-2.5 text-2xl font-semibold tracking-[-0.04em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#75e3df]">
          <Image src="/icon.png" alt="" width={40} height={40} priority className="h-10 w-10 rounded-xl object-cover" />
          Vision<span className="-ml-2 text-[#75e3df]">DX</span>
        </Link>

        <div className="gl-glass-elevated rounded-2xl p-6 sm:p-9">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#75e3df]">Create an account</p>
            <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] text-[#edf8fa]">Keep your work together.</h1>
            <p className="mt-3 text-sm leading-6 text-[#b5cad3]">Save model outputs and review recent analysis history.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="signup-name" className="mb-2 block text-sm font-medium text-[#d3e4e9]">Full name</label>
              <input id="signup-name" type="text" autoComplete="name" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} required className={inputClass} />
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-[#d3e4e9]">Email address</label>
              <input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required className={inputClass} />
            </div>

            <div>
              <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-[#d3e4e9]">Password</label>
              <input id="signup-password" type="password" autoComplete="new-password" placeholder="At least 6 characters" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} className={inputClass} />
              <p className="mt-1.5 text-xs text-[#9db3be]">Use at least 6 characters.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="signup-age" className="mb-2 block text-sm font-medium text-[#d3e4e9]">Age</label>
                <input id="signup-age" type="number" inputMode="numeric" placeholder="Age" value={age} onChange={(event) => setAge(event.target.value)} min="1" max="120" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="signup-gender" className="mb-2 block text-sm font-medium text-[#d3e4e9]">Gender</label>
                <select id="signup-gender" value={gender} onChange={(event) => setGender(event.target.value)} required className={inputClass}>
                  <option value="">Select one</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" disabled={loading} aria-busy={loading} className="mt-2 w-full">
              {loading ? "Creating account…" : "Create account"}
            </Button>

            {message && <p role="alert" aria-live="polite" className="rounded-lg border border-rose-200/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{message}</p>}
          </form>

          <p className="mt-7 text-center text-sm text-[#b5cad3]">
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(nextUrl)}`} className="font-semibold text-[#75e3df] underline decoration-transparent underline-offset-4 transition hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df]">Sign in</Link>
          </p>
        </div>

        <Link href="/" className="mt-5 block min-h-11 rounded-lg py-3 text-center text-sm text-[#9db3be] transition-colors hover:text-[#75e3df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df]">← Back to VisionDX</Link>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return <Suspense fallback={<main className="vision-auth-backdrop grid min-h-screen place-items-center text-[#b5cad3]" role="status">Loading account form…</main>}><SignupContent /></Suspense>;
}
