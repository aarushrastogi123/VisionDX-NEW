import ImageUpload from "./components/ImageUpload";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "./components/LogoutButton";
export default async function Home() {
  const cookieStore = await cookies();

  const token = cookieStore.get("visiondx_token")?.value;

  let isLoggedIn = false;

  if (token) {
    const payload = await verifyToken(token);

    if (payload?.userId) {
      isLoggedIn = true;
    }
  }
  return (
    <main className="min-h-screen bg-black/50 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-black/90 backdrop-blur shadow-lg shadow-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="https://visiondx.vercel.app/" className="text-3xl font-bold tracking-tight text-white">
              Vision<span className="text-cyan-300">DX</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
            <a
              href="#home"
              className="transition hover:text-cyan-300"
            >
              Home
            </a>

            <a
              href="#why"
              className="transition hover:text-cyan-300"
            >
              Why VisionDX
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-cyan-300"
            >
              How It Works
            </a>

            <a
              href="#diagnosis"
              className="transition hover:text-cyan-300"
            >
              Diagnosis
            </a>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  aria-label="Go to profile"
                  title="My Profile"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-800 text-xl text-white transition hover:border-cyan-300 hover:bg-slate-700 hover:text-cyan-300"
                >
                  👤
                </Link>
                <LogoutButton />
              </>
              ) : (
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        id="home" 
        className="relative overflow-hidden bg-gradient-to-b from-black via-slate-900 to-slate-800"
      >
        {/* Background decoration */}
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] animate-[float_5s_ease-in-out_infinite] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-[30rem] w-[30rem] animate-[float_4s_ease-in-out_infinite] rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-6 py-12 lg:px-8">

          {/* Hero Text */}
          <div className="flex max-w-3xl flex-col items-center text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              AI-powered retinal analysis
            </div>

            <h1 className="mt-7 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Early insights.
              <span className="block text-cyan-300">
                Smarter vision care.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white">
              VisionDX is an AI-powered retinal image analysis platform
              designed to assist in identifying potential eye diseases using
              deep learning and computer vision.
            </p>

            <p className="mt-4 max-w-xl leading-7 text-white">
              Upload a retinal image and receive an intelligent prediction
              powered by a PyTorch-based ResNet50 deep learning model.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">

              <a
                href="#diagnosis"
                className="rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-950 transition hover:bg-blue-700"
              >
                Start Your Diagnosis
              </a>

              <a
                href="#how-it-works"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-900 shadow-lg shadow-slate-600 transition hover:border-blue-300 hover:text-blue-600"
              >
                How It Works
              </a>

            </div>

            {/* Small stats */}
            <div className="mt-12 flex w-full flex-wrap justify-center gap-8 border-t border-slate-200 pt-6">

              <div>
                <p className="text-xl font-bold text-cyan-300">
                  ResNet50
                </p>

                <p className="mt-1 text-sm text-slate-100">
                  Deep learning model
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-cyan-300">
                  AI-Powered
                </p>

                <p className="mt-1 text-sm text-slate-100">
                  Retinal analysis
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-cyan-300">
                  7 Classes
                </p>

                <p className="mt-1 text-sm text-slate-100">
                  Disease prediction
                </p>
              </div>
            </div>

            {/* ================= DISEASE CLASSES TICKER ================= */}
            <div className="mt-16 w-screen overflow-hidden border-y-4 border-cyan-300/20 py-5">
              <div className="flex w-max animate-[marquee_25s_linear_infinite] items-center whitespace-nowrap text-lg font-semibold text-white">

                <span className="mx-6">Normal</span>
                <span className="text-slate-400">•</span>

                <span className="mx-6">Diabetic Retinopathy</span>
                <span className="text-slate-400">•</span>

                <span className="mx-6">Glaucoma</span>
                <span className="text-slate-400">•</span>

                <span className="mx-6">Cataract</span>
                <span className="text-slate-400">•</span>

                <span className="mx-6">AMD</span>
                <span className="text-slate-400">•</span>

                <span className="mx-6">Hypertensive Retinopathy</span>
                <span className="text-slate-400">•</span>

                <span className="mx-6">Myopia</span>
                <span className="text-slate-400">•</span>
                {/* Duplicate for seamless loop */}
                <span className="mx-6">Normal</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">Diabetic Retinopathy</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">Glaucoma</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">Cataract</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">AMD</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">Hypertensive Retinopathy</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">Myopia</span>
                <span className="text-slate-400">•</span>
                {/* Duplicate for seamless loop */}
                <span className="mx-6">Normal</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">Diabetic Retinopathy</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">Glaucoma</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">Cataract</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">AMD</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">Hypertensive Retinopathy</span>
                <span className="text-slate-400">•</span>
                <span className="mx-6">Myopia</span>
                <span className="text-slate-400">•</span>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE VISIONDX ================= */}
      <section
        id="why"
        className="bg-gradient-to-b from-slate-800 to-slate-700 py-5"
      >
        <div className="mx-auto max-w-7xl px-8 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300 [text-shadow:0px_0px_20px_rgba(0,274,255,1)]">
              Why VisionDX?
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-100">
              Intelligent technology for retinal image analysis
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-100">
              Combining artificial intelligence and computer vision to create
              a fast and accessible retinal disease analysis experience.
            </p>

          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                🧠
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Deep Learning
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Powered by a ResNet50-based deep learning architecture for
                retinal image classification.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                ⚡
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Fast Analysis
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Upload an image and receive an AI-generated prediction in
                seconds.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                🔒
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Personal History
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Securely access your profile and review your previous retinal
                image predictions.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="bg-gradient-to-b from-slate-700 to-slate-400 py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300 [text-shadow:0px_0px_20px_rgba(0,274,255,1)]">
              How It Works?
            </p>

            <h2 className="mt-4 text-4xl font-bold text-white">
              From image to insight in three steps
            </h2>

          </div>

          <div className="relative mt-16 grid gap-10 md:grid-cols-3">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-950 transition hover:bg-blue-700">
                1
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">
                Upload
              </h3>

              <p className="mx-auto mt-3 max-w-xs leading-7 text-slate-200">
                Upload a retinal fundus image to begin the analysis.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-950 transition hover:bg-blue-700">
                2
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">
                AI Analysis
              </h3>

              <p className="mx-auto mt-3 max-w-xs leading-7 text-slate-200">
                Our deep learning model processes and analyzes the retinal
                image.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-950 transition hover:bg-blue-700">
                3
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">
                Get Results
              </h3>

              <p className="mx-auto mt-3 max-w-xs leading-7 text-slate-200">
                Receive a predicted classification and confidence score.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ================= START DIAGNOSIS ================= */}
      <section
        id="diagnosis"
        className="bg-gradient-to-b from-slate-400 to-white py-24"
      >
        <div className="mx-auto max-w-3xl px-6 text-center">

          <p className="text-sm font-semibold uppercase tracking-widest text-black [text-shadow:0px_0px_30px_rgba(0,0,0,1)]">
            AI Diagnosis
          </p>

          <h2 className="mt-4 text-4xl font-bold text-slate-900">
            Start your retinal analysis
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-600">
            Upload a retinal image and let VisionDX analyze it using our
            deep-learning model.
          </p>

          {/* Upload box */}
          <ImageUpload />

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-gradient-to-b from-slate-950 to-slate-900 py-10 text-slate-400">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row lg:px-8">

          <div className="font-semibold text-white">
            Vision<span className="text-blue-400">DX</span>
          </div>

          <p className="text-sm">
            AI-powered retinal image analysis.
          </p>

          <p className="text-sm">
            Built with Next.js · PyTorch · ResNet50
          </p>

        </div>

      </footer>

    </main>
  );
}