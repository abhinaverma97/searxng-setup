"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

export function UserMenu({ name, email, image }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[#555] hover:text-white text-sm"
      >
        <span>{name ?? email}</span>
        {image && (
          <Image
            src={image}
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 rounded-full"
            loading="eager"
            unoptimized
          />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-full min-w-32 border border-[#181818] bg-[#080808] z-50">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-2.5 text-sm text-[#555] hover:text-white hover:bg-[#0d0d0d] transition-colors"
          >
            sign out
          </button>
        </div>
      )}
    </div>
  );
}