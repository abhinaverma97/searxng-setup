export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <section className="space-y-4">
        <p className="text-xs text-[#555] uppercase tracking-widest">privacy</p>
        <h1 className="text-3xl font-bold text-white">privacy policy</h1>
        <p className="text-sm text-[#555] leading-relaxed">
          Vexa is a search API proxy. We do not collect, store, or share your personal data beyond what is required to operate the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm text-white font-medium">what we store</h2>
        <ul className="text-sm text-[#555] leading-relaxed space-y-1.5 list-disc pl-5">
          <li>Account information (name, email, avatar) from your OAuth provider — used only for authentication.</li>
          <li>API keys you generate — hashed and stored to authenticate requests.</li>
          <li>Search queries are proxied through SearXNG and are not logged or stored by Vexa.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm text-white font-medium">what we do not store</h2>
        <ul className="text-sm text-[#555] leading-relaxed space-y-1.5 list-disc pl-5">
          <li>Search queries — they pass through to SearXNG and are never persisted.</li>
          <li>IP addresses — not logged.</li>
          <li>User agent or browser fingerprints — not collected.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm text-white font-medium">third-party services</h2>
        <p className="text-sm text-[#555] leading-relaxed">
          We use GitHub and Google for authentication. Groq AI for optional analysis features, and SearXNG as the search backend. Each service operates under its own privacy policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm text-white font-medium">data deletion</h2>
        <p className="text-sm text-[#555] leading-relaxed">
          You can delete your API keys at any time from your dashboard. To delete your account, contact us and we will remove your data within 30 days.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm text-white font-medium">contact</h2>
        <p className="text-sm text-[#555] leading-relaxed">
          For privacy-related inquiries, open an issue on GitHub.
        </p>
      </section>
    </div>
  );
}
