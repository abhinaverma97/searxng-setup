import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#181818] mt-24">
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-[#555]">
        <span>vexa</span>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/abhinaverma97"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            @abhinaverma97
          </a>
          <a
            href="https://github.com/abhinaverma97/searxng-setup"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            source
          </a>
          <Link href="/privacy" className="hover:text-white transition-colors">
            privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
