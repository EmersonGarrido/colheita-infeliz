"use client"

import { useGameContext } from "./game-context"
import { useLanguage } from "./language-context"
import { LanguageSelector } from "./language-selector"
// Importe o hook useMobile
import { useMobile } from "@/hooks/use-mobile"

export function Header() {
  const { playerName } = useGameContext()
  const { t } = useLanguage()
  // Dentro da função Header, adicione:
  const isMobile = useMobile()

  // Modifique o header para ser responsivo:
  return (
    <header className="bg-gradient-to-r from-amber-400 to-yellow-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/placeholder.svg?height=40&width=40" alt="Logo" className="h-10 w-10 rounded-full bg-white p-1" />
          <div>
            <h1 className={`${isMobile ? "text-xl" : "text-2xl md:text-3xl"} font-bold text-white drop-shadow-sm`}>
              Fazendinha Infeliz
            </h1>
            {playerName && (
              <p className="text-sm text-white/80">
                {t("farmer")}: {playerName}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">{!isMobile && <LanguageSelector />}</div>
      </div>
    </header>
  )
}

