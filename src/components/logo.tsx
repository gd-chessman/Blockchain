import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <div className="relative flex items-center">
        {/* Hexagon background */}
        <div className="absolute w-10 h-11 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-800 rounded-lg transform rotate-45 shadow-lg"></div>

        {/* Inner hexagon with glow effect */}
        <div className="absolute w-8 h-9 bg-gradient-to-br from-white to-blue-100 dark:from-blue-900 dark:to-blue-950 rounded-lg transform rotate-45 left-1 top-1"></div>

        {/* Logo text with 3D effect */}
        <div className="relative z-10 ml-3 mr-1">
          <span className="font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-300 dark:to-white drop-shadow-sm">
            K
          </span>
          <span className="font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-200 dark:to-blue-400 drop-shadow-sm">
            C
          </span>
          <span className="font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 dark:from-blue-100 dark:to-blue-300 drop-shadow-sm">
            M
          </span>
        </div>

        {/* Blockchain dots */}
        <div className="absolute -right-1 top-0 flex flex-col gap-[3px]">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-300 dark:bg-blue-400 shadow-sm"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-300 shadow-sm"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-200 shadow-sm"></div>
        </div>
      </div>

      {/* Tagline */}
      <span className="ml-3 text-xs font-medium text-white/80 hidden sm:block">Blockchain</span>
    </Link>
  )
}

