import { cn } from "@/lib/style"
import { useState, type ComponentPropsWithRef } from "react"

type ImageStatus = "error" | "loaded" | "loading"

export type AvatarImageProps = ComponentPropsWithRef<"img"> & {
  alt: string
}

export function AvatarImage({ alt, className, onError, onLoad, src, ...props }: AvatarImageProps) {
  const [imageState, setImageState] = useState<{
    src: typeof src
    status: ImageStatus
  }>({ src, status: "loading" })
  const status = imageState.src === src ? imageState.status : "loading"

  return (
    <img
      {...props}
      alt={alt}
      src={src}
      data-slot="avatar-image"
      data-status={status}
      className={cn(
        "absolute inset-0 size-full object-cover data-[status=error]:hidden",
        className
      )}
      onLoad={(event) => {
        setImageState({ src, status: "loaded" })
        onLoad?.(event)
      }}
      onError={(event) => {
        setImageState({ src, status: "error" })
        onError?.(event)
      }}
    />
  )
}
