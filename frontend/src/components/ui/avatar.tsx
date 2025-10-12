import * as React from "react"

interface AvatarProps {
  className?: string
  children: React.ReactNode
}

interface AvatarImageProps {
  src: string
  alt: string
}

interface AvatarFallbackProps {
  children: React.ReactNode
}

const AvatarContext = React.createContext<{ imageLoaded: boolean; setImageLoaded: (loaded: boolean) => void }>({
  imageLoaded: false,
  setImageLoaded: () => {},
})

export function Avatar({ className = "", children }: AvatarProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false)

  return (
    <AvatarContext.Provider value={{ imageLoaded, setImageLoaded }}>
      <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-200 ${className}`}>
        {children}
      </div>
    </AvatarContext.Provider>
  )
}

export function AvatarImage({ src, alt }: AvatarImageProps) {
  const { setImageLoaded } = React.useContext(AvatarContext)

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageLoaded(false)}
    />
  )
}

export function AvatarFallback({ children }: AvatarFallbackProps) {
  const { imageLoaded } = React.useContext(AvatarContext)

  if (imageLoaded) return null

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#6b7c45] text-white font-semibold text-sm">
      {children}
    </div>
  )
}
