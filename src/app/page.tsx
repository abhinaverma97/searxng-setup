import Link from "next/link";
import { auth } from "@/lib/auth";
import { SearchDemo } from "./search-demo";

export default async function Home() {
  const session = await auth();

  return (
    <div className="max-w-5xl mx-auto px-6">
      <section className="pt-32 pb-16 border-b border-[#181818]">
        <div className="space-y-10">
          <div className="max-w-xl space-y-4">
            <p className="text-xs text-[#555] uppercase tracking-widest">search api for ai agents</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              your agent deserves better than<br /><span className="text-[#86efac]">a web scraper.</span>
            </h1>
            <p className="text-sm text-[#555] leading-relaxed">
              A search API designed for AI agents. Raw search, AI summaries, and deep research.
            </p>
          </div>

          <SearchDemo />

          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <Link href="/dashboard" className="text-sm text-black px-4 py-2 font-medium bg-[#86efac]">dashboard →</Link>
                <span className="text-sm text-[#555]">{session.user.name ?? session.user.email}</span>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-black px-4 py-2 font-medium bg-[#86efac]">get your api key →</Link>
                <Link href="/api/auth/signin?provider=github" className="text-sm text-white border border-[#181818] px-4 py-2 hover:bg-white hover:text-black">sign in with github</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 border-b border-[#181818]">
        <div className="grid grid-cols-3 gap-0 border border-[#181818]">
          <div className="text-center border-r border-[#181818] py-4">
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-[#555] mt-1">endpoints</p>
          </div>
          <div className="text-center border-r border-[#181818] py-4">
            <p className="text-2xl font-bold text-white">1</p>
            <p className="text-xs text-[#555] mt-1">api key</p>
          </div>
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-white">∞</p>
            <p className="text-xs text-[#555] mt-1">free</p>
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-[#181818]">
        <h2 className="text-xs text-[#555] uppercase tracking-widest mb-5">endpoints</h2>
        <div className="grid sm:grid-cols-3 gap-0 border border-[#181818]">
          <div className="p-5 sm:border-r border-b sm:border-b-0 border-[#181818] space-y-2">
            <span className="text-xs text-[#86efac]">POST</span>
            <p className="text-base text-white font-medium">/api/search</p>
            <p className="text-xs text-[#555]">Raw SearXNG results. Fast, unfiltered, no AI overhead.</p>
          </div>
          <div className="p-5 sm:border-r border-b sm:border-b-0 border-[#181818] space-y-2">
            <span className="text-xs text-[#86efac]">POST</span>
            <p className="text-base text-white font-medium">/api/search/analyze</p>
            <p className="text-xs text-[#555]">Raw results + Groq AI summary with insights.</p>
          </div>
          <div className="p-5 space-y-2">
            <span className="text-xs text-[#86efac]">POST</span>
            <p className="text-base text-white font-medium">/api/search/deep</p>
            <p className="text-xs text-[#555]">SSE stream, 3 refinement rounds. Synthesized report.</p>
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-[#181818]">
        <h2 className="text-xs text-[#555] uppercase tracking-widest mb-5">how it works</h2>
        <div className="space-y-5">
          <div className="flex gap-4">
            <span className="text-xs text-[#86efac] w-6 flex-shrink-0">01</span>
            <div>
              <h3 className="text-sm text-white font-medium">Sign in</h3>
              <p className="text-xs text-[#555]">GitHub or Google. API key instantly. No credit card.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-xs text-[#86efac] w-6 flex-shrink-0">02</span>
            <div>
              <h3 className="text-sm text-white font-medium">Search with x-api-key</h3>
              <p className="text-xs text-[#555]">Raw, analyze, or deep. JSON or SSE.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-xs text-[#86efac] w-6 flex-shrink-0">03</span>
            <div>
              <h3 className="text-sm text-white font-medium">Agent gets the answer</h3>
              <p className="text-xs text-[#555]">No HTML parsing. No rate limits. Just data.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
