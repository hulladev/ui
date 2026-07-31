import { vn } from "@/lib/style"

export const resizeHandleEdges = vn({
  north: "top-0 left-3 right-3 h-3 -translate-y-1/2 cursor-ns-resize",
  "north-east": "top-0 right-0 size-5 -translate-y-1/2 translate-x-1/2 cursor-nesw-resize",
  east: "top-3 right-0 bottom-3 w-3 translate-x-1/2 cursor-ew-resize",
  "south-east": "right-0 bottom-0 size-5 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
  south: "right-3 bottom-0 left-3 h-3 translate-y-1/2 cursor-ns-resize",
  "south-west": "bottom-0 left-0 size-5 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
  west: "top-3 bottom-3 left-0 w-3 -translate-x-1/2 cursor-ew-resize",
  "north-west": "top-0 left-0 size-5 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
})
