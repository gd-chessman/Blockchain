import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center">
      <div className="relative flex items-center">
        {/* Hexagon background */}
        <div className="absolute w-10 h-11 bg-primary rounded-lg transform rotate-45 shadow-lg"></div>

        {/* Inner hexagon with glow effect */}
        <div className="absolute w-8 h-9 bg-white dark:bg-primary rounded-lg transform rotate-45 left-1 top-1"></div>

        {/* Logo text with 3D effect */}
        <div className="relative z-10 ml-3 mr-1">
          <Image src="/logo.png" alt="Logo App" width={64} height={64} />
        </div>

        {/* Blockchain dots */}
        <div className="absolute -right-1 top-0 flex flex-col gap-[3px]">
          <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary shadow-sm"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary shadow-sm"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary shadow-sm"></div>
        </div>
      </div>

      {/* Tagline */}
      <span className="ml-3 text-xs font-medium text-white/80 hidden sm:block">Blockchain</span>
    </Link>
  )
}
