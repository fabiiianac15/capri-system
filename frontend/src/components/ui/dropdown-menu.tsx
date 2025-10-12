import * as React from "react"

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

interface DropdownMenuContentProps {
  align?: "start" | "center" | "end"
  className?: string
  children: React.ReactNode
}

interface DropdownMenuItemProps {
  asChild?: boolean
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

interface DropdownMenuLabelProps {
  children: React.ReactNode
}

const DropdownMenuContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({ isOpen: false, setIsOpen: () => {} })

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: () => setIsOpen(!isOpen),
    })
  }

  return (
    <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
      {children}
    </button>
  )
}

export function DropdownMenuContent({ align = "end", className = "", children }: DropdownMenuContentProps) {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  const alignClass = align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2"

  return (
    <div
      ref={ref}
      className={`absolute ${alignClass} mt-2 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 min-w-[200px] ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ asChild, className = "", onClick, children }: DropdownMenuItemProps) {
  const { setIsOpen } = React.useContext(DropdownMenuContext)

  const handleClick = () => {
    if (onClick) onClick()
    setIsOpen(false)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      className: `px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center ${className}`,
    })
  }

  return (
    <div onClick={handleClick} className={`px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${className}`}>
      {children}
    </div>
  )
}

export function DropdownMenuLabel({ children }: DropdownMenuLabelProps) {
  return <div className="px-3 py-2 text-sm font-semibold text-gray-900">{children}</div>
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-gray-200" />
}
