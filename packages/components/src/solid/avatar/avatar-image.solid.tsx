import { createSignal, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"
import { callEventHandler } from "@/lib/solid"

type ImageStatus = "error" | "loaded" | "loading"

export type AvatarImageProps = JSX.IntrinsicElements["img"] & {
  alt: string
}

export function AvatarImage(props: AvatarImageProps) {
  const [local, rest] = splitProps(props, ["alt", "class", "onError", "onLoad", "src"])

  const [imageState, setImageState] = createSignal<{
    src: AvatarImageProps["src"]
    status: ImageStatus
  }>({ src: local.src, status: "loading" })
  const status = () => (imageState().src === local.src ? imageState().status : "loading")

  return (
    <img
      {...rest}
      alt={local.alt}
      src={local.src}
      data-slot="avatar-image"
      data-status={status()}
      class={cn("absolute inset-0 size-full object-cover data-[status=error]:hidden", local.class)}
      onLoad={(event) => {
        setImageState({ src: local.src, status: "loaded" })
        callEventHandler(local.onLoad, event)
      }}
      onError={(event) => {
        setImageState({ src: local.src, status: "error" })
        callEventHandler(local.onError, event)
      }}
    />
  )
}
