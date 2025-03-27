"\"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, getTranslation } from "@/utils/game-rules"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt-BR")

  // Carrega o idioma salvo no localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "pt-BR" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    } else {
      // Tenta detectar o idioma do navegador
      const browserLanguage = navigator.language
      if (browserLanguage.startsWith("pt")) {
        setLanguage("pt-BR")
      } else {
        setLanguage("en")
      }
    }
  }, [])

  // Salva o idioma no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Função para obter tradução
  const t = (key: string) => {
    return getTranslation(key, language)
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export { LanguageContext }

