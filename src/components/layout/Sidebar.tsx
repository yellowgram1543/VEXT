"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Curriculum", href: "/modules" },
    { name: "Modules", href: "/modules" },
    { name: "Notebooks", href: "/chapters" },
    { name: "Challenges", href: "/challenges" },
  ];

  return (
    <aside className="bg-primary-container border-r-3 border-brand-dark w-64 h-screen fixed left-0 top-0 flex flex-col z-50">
      {/* Top Section */}
      <header className="border-b-3 border-brand-dark p-6 flex flex-col gap-1">
        <Link href="/">
          <h1 className="font-heading text-2xl leading-tight text-brand-dark font-black tracking-tighter uppercase">
            ML MASTERCLASS
          </h1>
        </Link>
        <p className="font-body text-sm text-brand-dark opacity-90">
          Module 3: Neural Networks
        </p>
      </header>

      {/* Navigation Section */}
      <nav className="flex-grow p-4 flex flex-col gap-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`font-heading text-lg px-4 py-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-accent-purple text-white border-2 border-brand-dark neo-brutal-shadow-sm translate-x-[1px] translate-y-[1px]"
                  : "text-brand-dark hover:translate-x-1 hover:translate-y-1"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <footer className="p-6 border-t-3 border-brand-dark mt-auto">
        <button className="w-full py-4 px-6 bg-white border-3 border-brand-dark text-brand-dark font-heading text-base neo-brutal-shadow neo-brutal-interactive uppercase tracking-wider">
          Upgrade to Pro
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;
