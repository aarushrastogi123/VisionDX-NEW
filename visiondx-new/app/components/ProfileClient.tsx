"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string | null;
  email: string | null;
  age: number | null;
  gender: string | null;
};

export default function ProfileClient({
  user,
}: {
  user: User;
}) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user.name || "");
  const [age, setAge] = useState(
    user.age !== null ? user.age.toString() : ""
  );
  const [gender, setGender] = useState(user.gender || "");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setName(user.name || "");
    setAge(user.age !== null ? user.age.toString() : "");
    setGender(user.gender || "");
    setMessage("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          age,
          gender,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update profile");
        setLoading(false);
        return;
      }

      setMessage("Profile updated successfully!");
      setLoading(false);
      setIsEditing(false);

      router.refresh();
    } catch {
      setMessage("Unable to connect to the server");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-800 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Navbar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight text-white"
          >
            Vision<span className="text-cyan-300">DX</span>
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-300 hover:text-cyan-300"
          >
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Your Account
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            Welcome back, {user.name || "User"}
          </h1>

          <p className="mt-4 text-slate-400">
            Manage your personal information and review your retinal analysis
            history.
          </p>
        </div>

        {/* Profile information */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Personal Information
              </h2>

              {!isEditing && (
                <button
                  onClick={() => {
                    setMessage("");
                    setIsEditing(true);
                  }}
                  className="rounded-lg border border-cyan-300/30 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-300/10"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-slate-500">Full name</p>
                  <p className="mt-1 text-lg text-white">
                    {user.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="mt-1 break-all text-lg text-white">
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Age</p>
                  <p className="mt-1 text-lg text-white">
                    {user.age ?? "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Gender</p>
                  <p className="mt-1 text-lg text-white">
                    {user.gender ?? "Not provided"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Full name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Email
                  </label>

                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-black/20 px-4 py-3 text-slate-500"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Email cannot be changed at the moment.
                  </p>
                </div>

                {/* Age */}
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Age
                  </label>

                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="120"
                    className="w-full rounded-xl border border-slate-700 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Gender
                  </label>

                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
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

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {message && (
              <p className="mt-5 text-center text-sm text-cyan-300">
                {message}
              </p>
            )}
          </div>

          {/* Prediction history */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-white">
              Prediction History
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Your previous retinal image predictions will appear here.
            </p>

            <div className="mt-8 rounded-2xl border border-dashed border-slate-700 p-8 text-center">
              <p className="text-4xl">👁️</p>

              <p className="mt-4 font-medium text-white">
                No predictions yet
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Upload a retinal image to get started.
              </p>

              <Link
                href="/#diagnosis"
                className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Start Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}