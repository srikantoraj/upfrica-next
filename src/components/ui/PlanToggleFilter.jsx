"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Star, Eye, BadgeCheck, Circle } from "lucide-react";

const FILTERS = [
  { label: "All", value: "all", icon: Circle },
  { label: "Free", value: "free", icon: BadgeCheck },
  { label: "Popular", value: "popular", icon: Star },
  { label: "High Visibility", value: "visibility", icon: Eye },
];

export default function PlanToggleFilter({ plans = [], setFilteredPlans }) {
  const [active, setActive] = useState("all");
  const scrollerRef = useRef(null);

  const filtered = useMemo(() => {
    if (active === "all") return plans;
    if (active === "free") return plans.filter((p) => p.is_free);
    if (active === "popular") return plans.filter((p) => p.is_popular);
    if (active === "visibility") return plans.filter((p) => p.is_visible);
    return plans;
  }, [active, plans]);

  // push filtered plans upward whenever active/plans change
  useEffect(() => {
    setFilteredPlans?.(filtered);
  }, [filtered, setFilteredPlans]);

  const handleFilterChange = (value) => {
    setActive(value);
    // auto-scroll the selected chip into view on mobile
    queueMicrotask(() => {
      const el = scrollerRef.current?.querySelector(`[data-filter="${value}"]`);
      el?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
    });
  };

  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <div
        ref={scrollerRef}
        className="flex flex-nowrap gap-2 pb-1 snap-x snap-mandatory"
        role="tablist"
        aria-label="Plan filters"
      >
        {FILTERS.map(({ label, value, icon: Icon }) => {
          const isActive = active === value;
          return (
            <Button
              key={value}
              data-filter={value}
              onClick={() => handleFilterChange(value)}
              variant={isActive ? "default" : "outline"}
              aria-pressed={isActive}
              role="tab"
              className={[
                "shrink-0 snap-start rounded-full px-3 py-1 text-sm inline-flex items-center gap-1",
                "focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
                "dark:focus-visible:ring-purple-400 dark:focus-visible:ring-offset-gray-900",
                isActive
                  ? // active chip
                    "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500"
                  : // inactive chip (light & dark)
                    "border border-gray-300 text-gray-800 hover:bg-gray-100 " +
                    "dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800/70",
              ].join(" ")}
              title={label}
            >
              <Icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}