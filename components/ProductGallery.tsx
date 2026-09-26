"use client";

import { useState } from "react";

export function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const shots = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const src = shots[active] || shots[0] || "";
  if (!src) return null;

  return (
    <div className="bg-surface-container-low lg:border-r border-metallic-silver">
      <div className="aspect-square">
        <img src={src} alt={name} className="w-full h-full object-contain p-6 md:p-8" />
      </div>
      {shots.length > 1 ? (
        <div className="flex gap-2 p-3 overflow-x-auto chip-scroll">
          {shots.map((shot, i) => (
            <button
              key={`${shot}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`h-14 w-14 shrink-0 border bg-white ${i === active ? "border-primary" : "border-metallic-silver"}`}
            >
              <img src={shot} alt="" className="h-full w-full object-contain p-1" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
