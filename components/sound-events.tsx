"use client"

import { useEffect } from "react"
import { useGameContext } from "./game-context"

export function SoundEvents() {
  const { coins, taxesPaid } = useGameContext()

  // Monitora mudanças em coins e taxesPaid para disparar eventos de som
  useEffect(() => {
    const prevCoins = localStorage.getItem("prevCoins")
      ? Number.parseInt(localStorage.getItem("prevCoins") || "0")
      : coins
    const prevTaxesPaid = localStorage.getItem("prevTaxesPaid")
      ? Number.parseInt(localStorage.getItem("prevTaxesPaid") || "0")
      : taxesPaid

    // Se as moedas aumentaram, dispara o evento de moeda
    if (coins > prevCoins) {
      window.dispatchEvent(new CustomEvent("coins-received"))
    }

    // Se os impostos aumentaram, dispara o evento de imposto
    if (taxesPaid > prevTaxesPaid) {
      window.dispatchEvent(new CustomEvent("tax-paid"))
    }

    // Salva os valores atuais para a próxima comparação
    localStorage.setItem("prevCoins", coins.toString())
    localStorage.setItem("prevTaxesPaid", taxesPaid.toString())
  }, [coins, taxesPaid])

  return null
}

