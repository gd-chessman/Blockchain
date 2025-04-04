"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLang } from "@/lang/useLang"

export function LangToggle() {
  const { lang, setLang } = useLang();
  
  const langList = [
    { id: 3, name: "KR", code: "kr", flag: "https://flagcdn.com/w40/kr.png" },
    { id: 1, name: "EN", code: "en", flag: "https://flagcdn.com/w40/gb.png" },
    { id: 2, name: "VI", code: "vi", flag: "https://flagcdn.com/w40/vn.png" },
    { id: 4, name: "JP", code: "jp", flag: "https://flagcdn.com/w40/jp.png" },
  ];

  const currentLang = langList.find(l => l.code === lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-max text-white hover:bg-white/10 px-2 flex items-center gap-2">
          {currentLang && <img src={currentLang.flag} alt={currentLang.name} className="w-6 h-5 rounded" />}
          <span>{currentLang?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {langList.map((language) => (
          <DropdownMenuItem key={language.id} onClick={() => setLang(language.code)} className="flex items-center gap-2">
            <img src={language.flag} alt={language.name} className="w-6 h-5 rounded" />
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
