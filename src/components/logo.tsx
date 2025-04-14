import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center">
      <div className="relative flex items-center">
       

        {/* Logo text with 3D effect */}
        <div className="relative z-10 ml-3 mr-1">
          <Image 
            src="/logo.png" 
            alt="Logo App" 
            width={48} 
            height={48}
            className="md:hidden"
          />
          <Image 
            src="/logo.png" 
            alt="Logo App" 
            width={48} 
            height={48}
            className="hidden md:block"
          />
        </div>

 
      </div>
    </Link>
  )
}
