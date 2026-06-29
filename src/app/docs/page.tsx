import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { EndpointTester } from "./endpoint-tester";

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <section className="py-16 border-b border-[#181818]">
        <div className="max-w-2xl space-y-6">
          <p className="text-xs text-[#555] uppercase tracking-widest">documentation</p>
          <h1 className="text-4xl font-bold text-white leading-tight">api reference</h1>
          <p className="text-sm text-[#555] leading-relaxed">
            Send search queries to Vexa and get structured results back. Authenticate with your API key via the <span className="text-[#86efac]">x-api-key</span> header.
          </p>
        </div>
      </section>

      <section className="py-12 border-b border-[#181818]">
        <h2 className="text-xs text-[#555] uppercase tracking-widest mb-5">authentication</h2>
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-lg p-5 space-y-3">
          <p className="text-sm text-white font-medium">API Key</p>
          <p className="text-xs text-[#555]">All API requests require an API key. Pass it in the <code className="text-[#86efac]">x-api-key</code> header.</p>
          <CodeBlock code={`curl -H "x-api-key: sx_..." https://api.vexa/search`} />
          <p className="text-xs text-[#555]">Get your API key by <Link href="/login" className="text-[#86efac] hover:underline">signing in</Link> with GitHub or Google.</p>
        </div>
      </section>

      <section className="py-12 border-b border-[#181818]">
        <h2 className="text-xs text-[#555] uppercase tracking-widest mb-5">endpoints</h2>

        <div className="space-y-6">
          <div className="border border-white/10 bg-white/[0.02] backdrop-blur-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#86efac] font-medium">POST</span>
              <span className="text-base text-white font-medium">/api/search</span>
            </div>
            <p className="text-xs text-[#555]">Raw SearXNG results. No AI processing.</p>
            <div className="grid sm:grid-cols-2 gap-0 border border-white/10">
              <CodeBlock
                code={`curl -X POST https://api.vexa/api/search \\\n  -H "x-api-key: sx_..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"query": "rust vs go performance"}'`}
                className="border-b sm:border-b-0 sm:border-r border-white/10"
              />
              <div className="p-4">
                <EndpointTester mode="search" />
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.02] backdrop-blur-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#86efac] font-medium">POST</span>
              <span className="text-base text-white font-medium">/api/search/analyze</span>
            </div>
            <p className="text-xs text-[#555]">Raw results + Groq AI summary with key insights and relevance scoring.</p>
            <div className="grid sm:grid-cols-2 gap-0 border border-white/10">
              <CodeBlock
                code={`curl -X POST https://api.vexa/api/search/analyze \\\n  -H "x-api-key: sx_..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"query": "rust vs go performance"}'`}
                className="border-b sm:border-b-0 sm:border-r border-white/10"
              />
              <div className="p-4">
                <EndpointTester mode="analyze" />
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.02] backdrop-blur-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#86efac] font-medium">POST</span>
              <span className="text-base text-white font-medium">/api/search/deep</span>
            </div>
            <p className="text-xs text-[#555]">SSE stream with 3 refinement rounds. Synthesized report with sources.</p>
            <div className="grid sm:grid-cols-2 gap-0 border border-white/10">
              <CodeBlock
                code={`curl -X POST https://api.vexa/api/search/deep \\\n  -H "x-api-key: sx_..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"query": "rust vs go performance"}'`}
                className="border-b sm:border-b-0 sm:border-r border-white/10"
              />
              <div className="p-4">
                <EndpointTester mode="deep" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-[#181818]">
        <h2 className="text-xs text-[#555] uppercase tracking-widest mb-5">request body</h2>
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-lg p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#181818]">
                <th className="text-left text-[#555] font-medium pb-2 pr-6">field</th>
                <th className="text-left text-[#555] font-medium pb-2 pr-6">type</th>
                <th className="text-left text-[#555] font-medium pb-2 pr-6">required</th>
                <th className="text-left text-[#555] font-medium pb-2">description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#0d0d0d]">
                <td className="py-2.5 pr-6 text-white">query</td>
                <td className="py-2.5 pr-6 text-[#555]">string</td>
                <td className="py-2.5 pr-6 text-[#86efac]">yes</td>
                <td className="py-2.5 text-[#555]">The search query</td>
              </tr>
              <tr className="border-b border-[#0d0d0d]">
                <td className="py-2.5 pr-6 text-white">limit</td>
                <td className="py-2.5 pr-6 text-[#555]">number</td>
                <td className="py-2.5 pr-6 text-[#555]">no</td>
                <td className="py-2.5 text-[#555]">Max results to return (default: all)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
