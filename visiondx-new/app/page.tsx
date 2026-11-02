import ImageUpload from "./components/ImageUpload";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./components/LogoutButton";

const features = [
  {
    number: "01",
    title: "A focused image workflow",
    description:
      "Choose a retinal fundus image, review it, then start the analysis when you’re ready.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12s3.25-6 9-6 9 6 9 6-3.25 6-9 6-9-6-9-6Z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Seven class predictions",
    description:
      "The model returns a classification and confidence scores across its seven trained classes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 19V5m0 14h16M7 15l3-4 3 2 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "History when you sign in",
    description:
      "Signed-in users can save a result and return to their recent prediction history.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3.5 19 6v5.3c0 4.3-2.8 7.6-7 9.2-4.2-1.6-7-4.9-7-9.2V6l7-2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("visiondx_token")?.value;
  const payload = token ? await verifyToken(token) : null;
  const isLoggedIn = Boolean(payload?.userId);

  return (
    <main id="top" className="vision-app-shell min-h-screen text-[#edf8fa]">
      <header className="gl-surface-nav sticky top-0 z-50">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087f79]" aria-label="VisionDX home">
            <Image src="/icon.png" alt="" width={40} height={40} priority className="h-10 w-10 rounded-xl object-cover ring-1 ring-[#0b514f]/15" />
            <span className="text-xl font-semibold tracking-[-0.04em] text-white">Vision<span className="text-[#63e3de]">DX</span></span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#b3c9d2] md:flex">
            <a href="#approach" className="transition-colors hover:text-[#7debe5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#63e3de]">Our approach</a>
            <a href="#how-it-works" className="transition-colors hover:text-[#7debe5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#63e3de]">How it works</a>
            <a href="#analysis" className="transition-colors hover:text-[#7debe5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#63e3de]">Start analysis</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#c4d9df] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#63e3de]">My profile</Link>
                <LogoutButton />
              </>
            ) : (
              <Link href="/login" className="inline-flex min-h-11 items-center rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-[#e5f5f7] transition-colors hover:border-[#63e3de]/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#63e3de]">Sign in</Link>
            )}
          </div>
        </nav>
      </header>

      <section className="vision-hero relative overflow-hidden border-b border-white/10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-100/20 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#a9efeb] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#67e6df] shadow-[0_0_12px_rgba(80,230,220,0.8)]" />
              Retinal image research tool
            </p>
            <h1 className="mt-7 max-w-[12ch] font-serif text-[clamp(3rem,7vw,5.6rem)] leading-[0.98] tracking-[-0.055em] text-[#f2fbfc]">
              A clearer view, <span className="bg-gradient-to-r from-[#75eee6] via-[#61cce5] to-[#bd9cf5] bg-clip-text text-transparent">one image at a time.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#bdd0d8] sm:text-lg sm:leading-8">
              Explore an AI-assisted retinal image classification workflow. Upload a fundus image, review the model’s output, and save results to your account.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#analysis" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5be5df] via-[#38cbd2] to-[#549de6] px-6 py-3 text-sm font-semibold text-[#04151e] shadow-[0_12px_34px_rgba(39,197,207,0.22)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a7fff9]">
                Begin an analysis <span aria-hidden="true">→</span>
              </a>
              <a href="#how-it-works" className="gl-glass inline-flex min-h-12 items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-[#e1f2f5] transition-colors hover:border-cyan-100/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8cf3ec]">See how it works</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-sm text-[#a9c0ca]">
              <span><strong className="font-semibold text-[#f0fafb]">ResNet50</strong> model</span>
              <span><strong className="font-semibold text-[#f0fafb]">7</strong> trained classes</span>
              <span>Research use only</span>
            </div>
          </div>

          <div aria-hidden="true" className="vision-glass-stage gl-glass-elevated relative mx-auto flex aspect-[1.08/1] w-full max-w-[34rem] items-center justify-center rounded-[2rem] p-6 sm:p-10">
            <div className="absolute inset-4 rounded-[1.5rem] border border-white/80" />
            <div className="relative flex aspect-square w-[78%] items-center justify-center rounded-full border border-cyan-100/30 bg-[radial-gradient(circle_at_38%_32%,rgba(59,181,196,0.26),rgba(14,43,62,0.7)_68%)] shadow-[inset_0_0_0_18px_rgba(255,255,255,0.04),0_0_60px_rgba(66,197,213,0.14)]">
              <div className="absolute inset-[11%] rounded-full border border-cyan-100/35" />
              <div className="absolute inset-[22%] rounded-full border border-cyan-100/30" />
              <div className="absolute inset-[34%] rounded-full border border-violet-200/25" />
              <div className="absolute inset-[45%] rounded-full border border-cyan-100/45 bg-cyan-300/10" />
              <div className="absolute left-[17%] top-[39%] h-[8%] w-[37%] rotate-[-25deg] rounded-full bg-fuchsia-400/55 blur-sm" />
              <div className="absolute right-[17%] top-[48%] h-[7%] w-[34%] rotate-[32deg] rounded-full bg-cyan-300/55 blur-sm" />
              <div className="absolute left-[31%] top-[21%] h-[36%] w-[3px] rotate-[26deg] rounded-full bg-cyan-100/55" />
              <div className="absolute right-[28%] top-[48%] h-[30%] w-[3px] rotate-[-20deg] rounded-full bg-violet-100/50" />
              <div className="absolute left-[44%] top-[12%] h-[33%] w-[2px] rotate-[8deg] rounded-full bg-cyan-100/55" />
              <div className="absolute right-[13%] top-[35%] h-[2px] w-[26%] rotate-[-8deg] rounded-full bg-cyan-100/50" />
              <div className="absolute bottom-[14%] left-[24%] h-[2px] w-[28%] rotate-[13deg] rounded-full bg-violet-100/45" />
              <div className="absolute z-10 h-[20%] w-[20%] rounded-full border border-cyan-100/60 bg-[radial-gradient(circle_at_34%_30%,#c5fff8,#3da9bd_58%,#14708f)] shadow-[0_0_0_10px_rgba(255,255,255,0.06),0_0_45px_rgba(52,222,222,0.38)]" />
            </div>
            <div className="gl-glass absolute bottom-7 left-7 rounded-xl px-4 py-3 sm:bottom-9 sm:left-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#87c9cd]">Image workflow</p>
              <p className="mt-1 text-sm font-semibold text-[#effbfc]">Select · Review · Analyze</p>
            </div>
            <div className="gl-glass absolute right-7 top-7 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-[#c8f5f1] sm:right-9 sm:top-9">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#68e9e2] shadow-[0_0_10px_rgba(80,230,220,0.7)]" /> Seven output classes
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="vision-section-glow scroll-mt-24 bg-[#071923] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#72dedc]">Designed around the task</p>
              <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight tracking-[-0.04em] text-[#edf8fa] sm:text-5xl">Useful context, without the noise.</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#aec4ce] sm:text-lg sm:leading-8">VisionDX is a research prototype for exploring retinal image classification. The interface keeps the next step clear and presents model output with its supporting confidence scores.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.number} className="gl-glass rounded-2xl p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-100/15 bg-cyan-200/10 text-[#7fe9e3] [&>svg]:h-6 [&>svg]:w-6">{feature.icon}</span>
                  <span className="font-mono text-xs text-[#7898a5]">{feature.number}</span>
                </div>
                <h3 className="mt-7 text-lg font-semibold tracking-[-0.02em] text-[#edf8fa]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#adc3cd]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="vision-section-glow scroll-mt-24 border-y border-white/10 bg-[#0a202c] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#72dedc]">A simple three-step flow</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.04em] text-[#edf8fa] sm:text-5xl">From image to model output.</h2>
          </div>
          <ol className="mt-12 grid gap-8 border-t border-white/15 pt-8 md:grid-cols-3 md:gap-10">
            {[
              ["01", "Choose an image", "Select a PNG or JPEG fundus image. Preview it before sending it for analysis."],
              ["02", "Run the model", "The image is sent to the configured VisionDX inference service for classification."],
              ["03", "Review the output", "See the predicted class and confidence breakdown. Sign in to save the result."],
            ].map(([step, title, description]) => (
              <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="font-mono text-sm font-semibold text-[#75e3df]">{step}</span>
                <div>
                  <h3 className="text-lg font-semibold text-[#edf8fa]">{title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-[#adc3cd]">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="analysis" className="vision-section-glow scroll-mt-24 bg-[#06121c] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#72dedc]">Start here</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.04em] text-[#edf8fa] sm:text-5xl">Upload a retinal image</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#adc3cd]">Choose an image to preview it and request a classification from the local inference service.</p>
          </div>
          <ImageUpload />
          <aside className="mx-auto mt-10 max-w-3xl border-l-2 border-[#d5a66f] pl-4 text-left text-sm leading-6 text-[#adc3cd]" aria-label="Medical disclaimer">
            <p className="font-semibold text-[#e9f3f5]">Research prototype · not medical advice</p>
            <p className="mt-1">Model predictions can be wrong and are not a diagnosis. Do not use this tool to make treatment decisions. Consult a qualified eye-care professional for medical advice.</p>
          </aside>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#040d15] text-[#d4e4df]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" aria-label="VisionDX home" className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-[-0.03em] text-white"><Image src="/icon.png" alt="" width={32} height={32} className="h-8 w-8 rounded-lg object-cover" />Vision<span className="-ml-2 text-[#8be0cb]">DX</span></Link>
          <p className="max-w-lg text-sm leading-6 text-[#c0d3ce]">An educational retinal image classification prototype. Not for clinical use.</p>
          <a href="#top" className="min-h-11 self-start rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:self-auto">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
