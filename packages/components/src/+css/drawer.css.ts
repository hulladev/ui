import { vn } from "@/lib/style"

export const drawerOverlaySides = vn({
  right: "justify-items-end [&[hidden]>[data-slot=drawer]]:[transform:translateX(100%)]",
  left: "justify-items-start [&[hidden]>[data-slot=drawer]]:[transform:translateX(-100%)]",
  top: "items-start [&[hidden]>[data-slot=drawer]]:[transform:translateY(-100%)]",
  bottom: "items-end [&[hidden]>[data-slot=drawer]]:[transform:translateY(100%)]",
})

export const drawerSides = vn({
  right:
    "h-dvh w-[min(24rem,calc(100vw-2rem))] border-l border-border starting:[transform:translateX(100%)]",
  left: "h-dvh w-[min(24rem,calc(100vw-2rem))] border-r border-border starting:[transform:translateX(-100%)]",
  top: "max-h-[calc(100dvh-2rem)] w-full border-b border-border starting:[transform:translateY(-100%)]",
  bottom:
    "max-h-[calc(100dvh-2rem)] w-full border-t border-border starting:[transform:translateY(100%)]",
})
