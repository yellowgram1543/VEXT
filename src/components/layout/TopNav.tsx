"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TopNav = () => {
  const pathname = usePathname();

  const tabs = [
    { name: "Notebooks", href: "/chapters", active: pathname.startsWith("/chapters") },
    { name: "Curriculum", href: "/modules", active: pathname.startsWith("/modules") },
  ];

  return (
    <nav className="fixed top-0 right-0 left-64 z-40 h-20 bg-white border-b-3 border-brand-dark flex items-center px-6">
      <div className="max-w-[1000px] w-full mx-auto flex items-center justify-between">
        {/* Center: Navigation Tabs */}
        <div className="flex items-center gap-8 h-20">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={`h-full flex items-center px-4 font-bold text-sm tracking-widest uppercase transition-all hover:bg-surface-container-low ${
                tab.active
                  ? "border-b-4 border-accent-purple text-brand-dark"
                  : "text-on-surface-variant hover:text-brand-dark"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>

        {/* Right: Profile Avatar */}
        <div className="flex items-center">
          <button className="relative w-12 h-12 rounded-full border-3 border-brand-dark neo-brutal-shadow neo-brutal-interactive overflow-hidden bg-primary-container">
            <div className="w-full h-full bg-accent-purple/20 flex items-center justify-center text-brand-dark font-bold">
              AI
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
