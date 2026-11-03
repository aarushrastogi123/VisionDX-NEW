"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "apple-liquid-glass-ui";

type Prediction = {
  id: string;
  disease: string;
  confidence: number;
  createdAt: Date;
};

type User = {
  name: string | null;
  email: string | null;
  age: number | null;
  gender: string | null;
  predictions: Prediction[];
};

const fieldClass = "vision-glass-input min-h-12 w-full rounded-lg px-4 py-3 text-[#edf8fa] outline-none transition focus:ring-2 focus:ring-cyan-300/20";

export default function ProfileClient({ user }: { user: User }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [age, setAge] = useState(user.age !== null ? String(user.age) : "");
  const [gender, setGender] = useState(user.gender || "");
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setName(user.name || "");
    setAge(user.age !== null ? String(user.age) : "");
    setGender(user.gender || "");
    setMessage("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    setMessageIsError(false);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, gender }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not update your profile.");
        setMessageIsError(true);
        return;
      }

      setMessage("Profile updated successfully.");
      setIsEditing(false);
      router.refresh();
    } catch {
      setMessage("Unable to connect to the server. Try again.");
      setMessageIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="vision-app-shell min-h-screen px-5 py-10 text-[#edf8fa] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Account navigation" className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="VisionDX home" className="inline-flex items-center gap-2.5 text-2xl font-semibold tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#75e3df]"><Image src="/icon.png" alt="" width={40} height={40} priority className="h-10 w-10 rounded-xl object-cover" />Vision<span className="-ml-2 text-[#75e3df]">DX</span></Link>
          <Link href="/" className="gl-glass inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-[#d3e4e9] transition-colors hover:border-cyan-200/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df]">Back to home</Link>
        </nav>

        <header className="mt-14 sm:mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#75e3df]">Your account</p>
          <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] sm:text-5xl">Welcome back, {user.name || "User"}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#b5cad3]">Manage your profile and review the model outputs you have saved.</p>
        </header>

        <div className="mt-9 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="gl-glass-elevated h-fit rounded-2xl p-5 sm:p-7" aria-labelledby="profile-heading">
            <div className="flex items-center justify-between gap-4">
              <h2 id="profile-heading" className="text-lg font-semibold">Personal information</h2>
              {!isEditing && (
                <button type="button" onClick={() => { setMessage(""); setIsEditing(true); }} className="gl-glass inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-[#d3e4e9] transition-colors hover:border-cyan-200/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df]">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4"><path d="m15.5 5.5 3 3M4 20l4.5-.9L19 8.6a2.12 2.12 0 0 0-3-3L5.5 16.1 4 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); void handleSave(); }}>
                <div><label htmlFor="profile-name" className="mb-2 block text-sm font-medium text-[#d3e4e9]">Full name</label><input id="profile-name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required className={fieldClass} /></div>
                <div><label htmlFor="profile-email" className="mb-2 block text-sm font-medium text-[#d3e4e9]">Email</label><input id="profile-email" type="email" autoComplete="email" value={user.email || ""} disabled className={`${fieldClass} cursor-not-allowed opacity-60`} /><p className="mt-1.5 text-xs text-[#9db3be]">Email cannot be changed here.</p></div>
                <div><label htmlFor="profile-age" className="mb-2 block text-sm font-medium text-[#d3e4e9]">Age</label><input id="profile-age" type="number" min="1" max="120" inputMode="numeric" value={age} onChange={(event) => setAge(event.target.value)} className={fieldClass} /></div>
                <div><label htmlFor="profile-gender" className="mb-2 block text-sm font-medium text-[#d3e4e9]">Gender</label><select id="profile-gender" value={gender} onChange={(event) => setGender(event.target.value)} className={fieldClass}><option value="">Select one</option><option value="Male">Male</option><option value="Female">Female</option><option value="Prefer not to say">Prefer not to say</option></select></div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="primary" size="md" disabled={loading} aria-busy={loading} className="flex-1">{loading ? "Saving…" : "Save changes"}</Button>
                  <button type="button" onClick={handleCancel} disabled={loading} className="gl-glass min-h-12 rounded-lg border border-white/15 px-4 py-3 text-sm font-medium text-[#d3e4e9] transition-colors hover:border-cyan-200/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df] disabled:opacity-60">Cancel</button>
                </div>
              </form>
            ) : (
              <dl className="mt-6 space-y-5">
                <div><dt className="text-sm text-[#9db3be]">Full name</dt><dd className="mt-1 font-medium">{user.name || "Not provided"}</dd></div>
                <div className="min-w-0"><dt className="text-sm text-[#9db3be]">Email</dt><dd className="mt-1 break-all font-medium">{user.email || "Not provided"}</dd></div>
                <div><dt className="text-sm text-[#9db3be]">Age</dt><dd className="mt-1 font-medium">{user.age ?? "Not provided"}</dd></div>
                <div><dt className="text-sm text-[#9db3be]">Gender</dt><dd className="mt-1 font-medium">{user.gender ?? "Not provided"}</dd></div>
              </dl>
            )}

            {message && <p role={messageIsError ? "alert" : "status"} aria-live="polite" className={`mt-5 rounded-lg border px-4 py-3 text-sm ${messageIsError ? "border-rose-200/20 bg-rose-400/10 text-rose-100" : "border-cyan-200/20 bg-cyan-300/10 text-cyan-100"}`}>{message}</p>}
          </section>

          <section className="gl-glass-elevated rounded-2xl p-5 sm:p-7" aria-labelledby="history-heading">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#75e3df]">Saved results</p><h2 id="history-heading" className="mt-2 text-xl font-semibold">Prediction history</h2></div>
              <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">{user.predictions.length} {user.predictions.length === 1 ? "result" : "results"}</span>
            </div>

            {user.predictions.length === 0 ? (
              <div className="gl-glass mt-7 rounded-xl border border-dashed border-white/20 p-7 text-center sm:p-9">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mx-auto h-8 w-8 text-[#61cce5]"><path d="M3 12s3.25-6 9-6 9 6 9 6-3.25 6-9 6-9-6-9-6Z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6"/></svg>
                <p className="mt-4 font-medium">No saved results yet</p>
                <p className="mt-2 text-sm leading-6 text-[#b5cad3]">When you save an analysis, it will appear here.</p>
                <Link href="/#analysis" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-gradient-to-r from-[#75e3df] to-[#8bf2ed] px-5 py-2.5 text-sm font-semibold text-[#06121c] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75e3df]">Start an analysis</Link>
              </div>
            ) : (
              <ol className="mt-6 space-y-3">
                {user.predictions.map((prediction) => (
                  <li key={prediction.id} className="gl-glass flex flex-col justify-between gap-4 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#75e3df]">Model output</p><h3 className="mt-1.5 break-words font-semibold">{prediction.disease.replaceAll("_", " ")}</h3><time className="mt-1.5 block text-sm text-[#9db3be]" dateTime={new Date(prediction.createdAt).toISOString()}>{new Date(prediction.createdAt).toLocaleString()}</time></div>
                    <div className="shrink-0 sm:text-right"><p className="text-xs text-[#9db3be]">Model confidence</p><p className="mt-1 text-lg font-semibold text-[#61cce5]">{prediction.confidence.toFixed(2)}%</p></div>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-5 text-[#9db3be]">Predictions are experimental model outputs and are not medical diagnoses.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
