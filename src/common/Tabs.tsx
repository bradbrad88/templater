import React from "react";
import { cn } from "../utils/cn";

type Props = {
  tabs: { name: string; href: string; current: boolean }[];
  onChange: (href: string) => void;
};

export default function Tabs({ tabs, onChange }: Props) {
  const onClick: React.MouseEventHandler = e => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("data-href");
    if (!href) throw new Error("data-href attribute does not exist on Tabs anchor element");
    onChange(href);
  };

  return (
    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
      {tabs.map(tab => (
        <a
          key={tab.name}
          onClick={onClick}
          data-href={tab.href}
          className={cn(
            tab.current
              ? "bg-black/10 text-zinc-900 hover:text-zinc-700"
              : "text-zinc-700 hover:text-zinc-700",
            "rounded-full px-6 py-1.5 text-sm font-medium cursor-pointer visited:text-zinc-700"
          )}
          aria-current={tab.current ? "page" : undefined}
        >
          {tab.name}
        </a>
      ))}
    </nav>
  );
}
