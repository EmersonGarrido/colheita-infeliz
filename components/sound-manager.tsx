"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface SoundManagerProps {
  children: React.ReactNode
}

export function SoundManager({ children }: SoundManagerProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const introRef = useRef<HTMLAudioElement | null>(null)
  const backgroundRef = useRef<HTMLAudioElement | null>(null)
  const coinDropRef = useRef<HTMLAudioElement | null>(null)
  const cashierRef = useRef<HTMLAudioElement | null>(null)

  // Inicializa os elementos de áudio
  useEffect(() => {
    if (typeof window !== "undefined") {
      introRef.current = new Audio("/assets/intro.mp3")
      backgroundRef.current = new Audio("/assets/background.mp3")
      coinDropRef.current = new Audio("/assets/coin-drop.mp3")
      cashierRef.current = new Audio("/assets/cashier.mp3")

      if (backgroundRef.current) {
        backgroundRef.current.loop = true
        backgroundRef.current.volume = 0.3
      }
    }

    return () => {
      if (backgroundRef.current) backgroundRef.current.pause()
      if (introRef.current) introRef.current.pause()
    }
  }, [])

  // Função para iniciar os sons após interação do usuário
  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true)

      if (!isMuted && introRef.current) {
        introRef.current
          .play()
          .then(() => {
            introRef.current?.addEventListener("ended", () => {
              if (backgroundRef.current && !isMuted) {
                backgroundRef.current.play().catch((e) => console.log("Erro ao reproduzir música de fundo"))
              }
            })
          })
          .catch((e) => console.log("Erro ao reproduzir áudio de introdução"))
      }
    }
  }

  // Adiciona listeners para eventos personalizados
  useEffect(() => {
    if (!hasInteracted || isMuted) return

    const handleCoinsReceived = () => {
      if (coinDropRef.current) {
        coinDropRef.current.currentTime = 0
        coinDropRef.current.play().catch((e) => console.log("Erro ao reproduzir som de moeda"))
      }
    }

    const handleTaxPaid = () => {
      if (cashierRef.current) {
        cashierRef.current.currentTime = 0
        cashierRef.current.play().catch((e) => console.log("Erro ao reproduzir som de caixa registradora"))
      }
    }

    window.addEventListener("coins-received", handleCoinsReceived)
    window.addEventListener("tax-paid", handleTaxPaid)

    return () => {
      window.removeEventListener("coins-received", handleCoinsReceived)
      window.removeEventListener("tax-paid", handleTaxPaid)
    }
  }, [hasInteracted, isMuted])

  // Adiciona listener para interação do usuário
  useEffect(() => {
    const handleInteraction = () => handleUserInteraction()

    window.addEventListener("click", handleInteraction)
    window.addEventListener("touchstart", handleInteraction)

    return () => {
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
    }
  }, [hasInteracted])

  // Função para alternar o mudo
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev

      if (newMuted) {
        if (backgroundRef.current) backgroundRef.current.pause()
        if (introRef.current) introRef.current.pause()
      } else {
        if (backgroundRef.current) {
          backgroundRef.current.play().catch((e) => console.log("Erro ao reproduzir música de fundo"))
        } else if (introRef.current) {
          introRef.current.play().catch((e) => console.log("Erro ao reproduzir áudio de introdução"))
        }
      }

      return newMuted
    })
  }

  return (
    <>
      {children}

      {/* Botão de mudo */}
      <button
        onClick={toggleMute}
        className="fixed top-20 right-20 z-[100] bg-white/80 p-2 rounded-full shadow-md"
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5 6 9H2v6h4l5 4V5Z"></path>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5 6 9H2v6h4l5 4V5Z"></path>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        )}
      </button>
    </>
  )
}

