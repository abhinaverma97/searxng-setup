import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserMenu } from "./user-menu";

export async function Nav() {
  const session = await auth();

  return (
    <nav className="border-b border-[#181818] bg-black sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-12">
        <Link href="/" className="text-white font-medium">
          vexa
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-[#555] hover:text-white text-sm">home</Link>
          <Link href="/docs" className="text-[#555] hover:text-white text-sm">docs</Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-[#555] hover:text-white text-sm">keys</Link>
              <UserMenu
                name={session.user.name}
                email={session.user.email}
                image={session.user.image}
              />
            </>
          ) : (
            <Link href="/login" className="text-sm text-white border border-[#181818] px-3 py-1.5 hover:bg-white hover:text-black">
              sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
