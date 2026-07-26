import { vn } from "@/lib/style"

export const skeletonVariants = vn({
  pulse: "animate-skeleton-pulse",
  shimmer:
    "before:absolute before:inset-0 before:animate-skeleton-shimmer before:bg-[linear-gradient(105deg,transparent_20%,color-mix(in_oklab,var(--color-surface-raised)_82%,transparent)_50%,transparent_80%)] before:content-['']",
})
