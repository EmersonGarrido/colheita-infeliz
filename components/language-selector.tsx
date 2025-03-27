"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-context"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={`text-xs px-2 py-1 ${language === "pt-BR" ? "bg-white/20" : "bg-transparent"}`}
        onClick={() => setLanguage("pt-BR")}
      >
        🇧🇷 PT
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`text-xs px-2 py-1 ${language === "en" ? "bg-white/20" : "bg-transparent"}`}
        onClick={() => setLanguage("en")}
      >
        🇺🇸 EN
      </Button>
    </div>
  )
}

