"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Instagram, CreditCard } from "lucide-react"

interface AboutModalProps {
  open: boolean
  onClose: () => void
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  const copyPixToClipboard = () => {
    navigator.clipboard.writeText("67993109148")
    alert("Chave Pix copiada para a área de transferência!")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">Sobre Fazendinha Infeliz</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <p className="text-gray-700 mb-3">
              Este jogo é uma sátira com a real situação do Brasil em 2025, criado por Emerson Garrido.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Instagram className="h-5 w-5 text-pink-600" />
              <a
                href="https://instagram.com/emersongarrido.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                @emersongarrido.dev
              </a>
            </div>

            <div className="bg-amber-100 p-4 rounded-lg border border-amber-200">
              <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Me ajuda com Pix aí:
              </h3>
              <div className="flex items-center gap-2">
                <div className="bg-white p-2 rounded border border-amber-200 flex-1">
                  <p className="font-mono text-gray-700">Chave Pix (celular): 67993109148</p>
                </div>
                <Button onClick={copyPixToClipboard} variant="outline" className="whitespace-nowrap">
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full bg-amber-600 hover:bg-amber-700">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

