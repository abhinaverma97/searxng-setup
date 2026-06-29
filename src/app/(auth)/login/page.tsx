import Link from "next/link";
import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-xl font-bold text-white">sign in</h1>
          <p className="text-sm text-[#555]">
            API key instantly. No credit card.
          </p>
        </div>

        <div className="space-y-3">
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full border border-[#181818] bg-[#080808] px-4 py-3 text-sm text-white font-medium hover:bg-white hover:text-black transition-colors"
            >
              continue with github
            </button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full border border-[#181818] bg-[#080808] px-4 py-3 text-sm text-white font-medium hover:bg-white hover:text-black transition-colors"
            >
              continue with google
            </button>
          </form>
        </div>

          <p className="text-xs text-[#555] text-center">
          <Link href="/" className="hover:text-white transition-colors">← back to homepage</Link>
        </p>
      </div>
    </div>
  );
}
