"use client"

import { useEffect } from "react"
import { dispatchTaxSound } from "./game-helpers"

export function TaxEvents() {
  // Adiciona listener para eventos de imposto
  useEffect(() => {
    const handleTaxCollected = () => {
      dispatchTaxSound()
    }

    // Adiciona o listener para o evento personalizado
    window.addEventListener("tax-collected", handleTaxCollected)

    return () => {
      window.removeEventListener("tax-collected", handleTaxCollected)
    }
  }, [])

  return null
}

