"use client"

export function dispatchCoinSound() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("coins-received"))
  }
}

export function dispatchTaxSound() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("tax-paid"))
  }
}

