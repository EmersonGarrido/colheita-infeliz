"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, AlertTriangle } from "lucide-react"

interface PlayerNameModalProps {
  onNameSubmit: (name: string) => void
}

export function PlayerNameModal({ onNameSubmit }: PlayerNameModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(40)
  const [buttonEnabled, setButtonEnabled] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Verifica se já existe um nome salvo
    const savedName = localStorage.getItem("playerName")
    if (savedName) {
      onNameSubmit(savedName)
    } else {
      setOpen(true)
    }
  }, [onNameSubmit])

  // Timer para ativar o botão após 40 segundos
  useEffect(() => {
    if (!open || buttonEnabled) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setButtonEnabled(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open, buttonEnabled])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim().length < 2) {
      toast({
        title: "Nome muito curto",
        description: "Por favor, digite um nome com pelo menos 2 caracteres.",
        variant: "destructive",
      })
      return
    }

    // Salva o nome no localStorage
    localStorage.setItem("playerName", name)
    onNameSubmit(name)
    setOpen(false)

    toast({
      title: "Bem-vindo à Fazendinha Feliz!",
      description: `Olá, ${name}! Sua aventura na fazenda começa agora.`,
    })
  }

  const copyPixToClipboard = () => {
    navigator.clipboard.writeText("67993109148")
    toast({
      title: "Chave Pix copiada!",
      description: "A chave Pix foi copiada para a área de transferência.",
    })
  }

  const handleSonegar = () => {
    setButtonEnabled(true)
    setTimeRemaining(0)
    toast({
      title: "Imposto sonegado!",
      description: "Você escolheu sonegar o imposto. Cuidado com a Receita Federal!",
      variant: "destructive",
    })
  }

  return (
    <Dialog open={open} onOpenChange={() => {}} onEscapeKeyDown={(e) => e.preventDefault()}>
      <DialogContent className="sm:max-w-[400px] bg-amber-50 border-amber-200" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">
            Bem-vindo à Fazendinha Infeliz!
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <p className="mb-4 text-center text-gray-700">Como devemos chamar você, fazendeiro?</p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="border-amber-200 focus-visible:ring-amber-500"
              autoFocus
            />

            <div className="bg-red-100 p-4 rounded-lg border border-red-200">
              <h3 className="flex items-center gap-2 text-base font-bold text-red-800 mb-2">
                <AlertTriangle className="h-5 w-5" />
                Contribuição Obrigatória
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Para jogar Fazendinha Infeliz, é necessário fazer um PIX de R$ 1,00 ou mais para o desenvolvedor.
              </p>

              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Faça um PIX para:
                </h4>
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded border border-amber-200 flex-1">
                    <p className="font-mono text-xs text-gray-700">Chave Pix (celular): 67993109148</p>
                  </div>
                  <Button onClick={copyPixToClipboard} variant="outline" size="sm" className="whitespace-nowrap">
                    Copiar
                  </Button>
                </div>
              </div>
            </div>

            {!buttonEnabled && (
              <div className="text-center text-sm text-gray-600">
                Aguarde {timeRemaining} segundos para continuar...
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={name.trim().length < 2 || !buttonEnabled}
            >
              Começar a Jogar
            </Button>

            <button
              type="button"
              onClick={handleSonegar}
              className="text-xs text-gray-400 hover:text-gray-600 underline self-center"
            >
              sonegar imposto
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

