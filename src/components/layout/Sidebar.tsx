"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Book, CheckCircle2, Lock, PanelLeftClose, PanelLeftOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { StageType } from "@prisma/client";
import { useProgress } from "../ProgressContext";

interface Chapter {
  _id: string;
  title: string;
  slug: { current: string };
  order: number;
}

interface Module {
  _id: string;
  title: string;
  order: number;
  chapters: Chapter[];
}

interface ProgressRecord {
  chapterId: string;
  highestStage: StageType;
  completedAt?: Date | string | null;
}

interface SidebarProps {
  modules: Module[];
  progress: ProgressRecord[];
}

const Sidebar = ({ modules, progress }: SidebarProps) => {
  const { isChapterLocked } = useProgress();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    modules.reduce((acc, m) => ({ ...acc, [m._id]: true }), {})
  );

  useEffect(() => {
    const currentWidth = isCollapsed ? '80px' : `${width}px`;
    document.documentElement.style.setProperty('--sidebar-width', currentWidth);
  }, [isCollapsed, width]);

  // Resizing Logic
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing && !isCollapsed) {
      const newWidth = e.clientX;
      if (newWidth > 200 && newWidth < 600) {
        setWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  const toggleModule = (id: string) => {
    if (isCollapsed) return;
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getChapterStatus = (chapterId: string) => {
    if (isChapterLocked(chapterId)) return 'LOCKED';
    
    const record = progress.find(p => p.chapterId === chapterId);
    if (record?.completedAt) return 'COMPLETED';
    return 'ACTIVE';
  };

  return (
    <aside 
      className={cn(
        "bg-[#A7C7E7] border-r-3 border-brand-dark h-screen fixed left-0 top-0 flex flex-col z-50 overflow-hidden",
        isCollapsed ? "w-20" : (!isResizing && "transition-[width] duration-300")
      )}
      style={{ width: isCollapsed ? '80px' : `${width}px` }}
    >
      {/* Resizer Handle */}
      {!isCollapsed && (
        <div 
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-brand-dark/20 transition-colors z-[60]"
        />
      )}

      {/* Top Section */}
      <header className="border-b-3 border-brand-dark p-6 flex items-center justify-between bg-white/10 shrink-0">
        <div className={cn("flex flex-col gap-1 transition-opacity duration-300", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-brand-dark" />
            <h2 className="font-heading text-xs font-black uppercase tracking-widest text-brand-dark/60">
              Learning Lab
            </h2>
          </div>
          <Link href="/">
            <h1 className="font-heading text-xl leading-tight text-brand-dark font-black tracking-tighter uppercase whitespace-nowrap">
              AI/ML Tutor
            </h1>
          </Link>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors text-brand-dark self-start mt-[-4px]"
        >
          {isCollapsed ? <PanelLeftOpen className="w-6 h-6" /> : <PanelLeftClose className="w-6 h-6" />}
        </button>
      </header>

      {/* Navigation Section */}
      <nav className="flex-grow p-4 flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
        {modules.map((module) => (
          <div key={module._id} className="flex flex-col gap-1">
            {/* Module Header */}
            <button
              onClick={() => toggleModule(module._id)}
              className={cn(
                "flex items-center justify-between w-full text-left font-heading font-black text-brand-dark uppercase tracking-tight py-2 px-2 hover:bg-white/20 rounded-lg transition-colors group",
                isCollapsed && "justify-center"
              )}
            >
              <div className="flex items-center gap-2">
                {!isCollapsed && (expandedModules[module._id] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                ))}
                {isCollapsed ? (
                   <div className="w-8 h-8 rounded-full bg-brand-dark/10 flex items-center justify-center text-[10px]">
                      M{module.order}
                   </div>
                ) : (
                  <span className="text-xs whitespace-nowrap">Module {module.order}: {module.title}</span>
                )}
              </div>
            </button>

            {/* Chapter Links */}
            {(expandedModules[module._id] || isCollapsed) && (
              <div className={cn("flex flex-col gap-1", isCollapsed ? "items-center" : "pl-6")}>
                {module.chapters.map((chapter) => {
                  const href = `/chapters/${chapter.slug.current}`;
                  const isActive = pathname === href;
                  const status = getChapterStatus(chapter._id);
                  
                  return (
                    <Link
                      key={chapter._id}
                      href={status === 'LOCKED' ? '#' : href}
                      onClick={(e) => {
                        if (status === 'LOCKED') {
                          e.preventDefault();
                        }
                      }}
                      title={chapter.title}
                      className={cn(
                        "font-body text-[13px] rounded-lg border-2 border-transparent transition-all flex items-center group shrink-0",
                        isActive
                          ? "bg-[#7B287D] text-white border-brand-dark shadow-[2px_2px_0px_0px_#330C2F] translate-x-[1px] translate-y-[1px]"
                          : status === 'LOCKED'
                            ? "text-brand-dark/30 cursor-not-allowed"
                            : "text-brand-dark/80 hover:bg-white/40 hover:text-brand-dark",
                        isCollapsed ? "p-3" : "px-3 py-2 w-full justify-between"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {status === 'COMPLETED' ? (
                          <CheckCircle2 className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-accent-purple")} />
                        ) : status === 'ACTIVE' ? (
                          <FileText className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-green-600")} />
                        ) : (
                          <Lock className="w-4 h-4 shrink-0 text-brand-dark/30" />
                        )}
                        {!isCollapsed && <span className="truncate">{chapter.title}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <footer className={cn("p-6 border-t-3 border-brand-dark mt-auto bg-white/10 shrink-0", isCollapsed && "p-4 flex justify-center")}>
        <button className={cn(
          "bg-white border-3 border-brand-dark text-brand-dark font-heading text-sm font-black neo-brutal-shadow neo-brutal-interactive uppercase tracking-wider transition-all",
          isCollapsed ? "w-10 h-10 flex items-center justify-center p-0 rounded-full" : "w-full py-3 px-4"
        )}>
          {isCollapsed ? "S" : "Cloud Save"}
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;
