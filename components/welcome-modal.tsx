"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGameContext } from "./game-context"
import { Coins, AlertTriangle } from "lucide-react"
import { gameConfig } from "@/utils/game-rules"

export function WelcomeModal() {
  const [open, setOpen] = useState(false)
  const { level } = useGameContext()

  // Abre o modal quando o componente é montado, a menos que já tenha sido visto
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome") === "true"
    if (!hasSeenWelcome) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem("hasSeenWelcome", "true")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-amber-50 border-amber-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-red-800">
            Bem-vindo à Fazendinha Infeliz
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 p-2 sm:space-y-4 sm:p-4">
          <div className="bg-red-100 p-3 sm:p-4 rounded-lg border border-red-200">
            <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-red-800 mb-1 sm:mb-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              Onde você produz e o governo recebe
            </h3>
            <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">
              Nesta fazenda, você não apenas cultiva plantas, mas também contribui generosamente para os cofres públicos
              através de um elaborado sistema de impostos.
            </p>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-amber-800">Sistema de Impostos</h3>

          <div className="grid gap-2 sm:gap-3">
            {/* Reduzir o padding e tamanho de texto dos cards de impostos */}
            <div className="bg-white p-2 sm:p-3 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-medium">Imposto de Renda</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Taxa de {gameConfig.taxes.incomeTax.rate * 100}% sobre suas moedas, cobrada a cada{" "}
                {gameConfig.taxes.incomeTax.interval / 60} minutos.
                <br />
                <span className="text-red-600">
                  Começa a ser cobrado a partir do nível {gameConfig.taxes.incomeTax.minLevel}.
                </span>
              </p>
            </div>

            <div className="bg-white p-2 sm:p-3 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-medium">Imposto sobre Ganhos de Capital</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Taxa de {gameConfig.taxes.capitalGainsTax.rate * 100}% sobre o valor de todas as melhorias que você
                comprar.
                <br />
                <span className="text-red-600">
                  Começa a ser cobrado a partir do nível {gameConfig.taxes.capitalGainsTax.minLevel}.
                </span>
              </p>
            </div>

            <div className="bg-white p-2 sm:p-3 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-medium">Imposto sobre Vendas</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Taxa de {gameConfig.taxes.salesTax.rate * 100}% sobre o valor de todas as suas vendas de colheitas.
                <br />
                <span className="text-red-600">
                  Começa a ser cobrado a partir do nível {gameConfig.taxes.salesTax.minLevel}.
                </span>
              </p>
            </div>

            <div className="bg-white p-2 sm:p-3 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                <h4 className="text-sm sm:text-base font-medium">Imposto sobre Sementes</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Taxa progressiva de {gameConfig.taxes.seedTax.baseRate * 100}% a{" "}
                {gameConfig.taxes.seedTax.maxRate * 100}% sobre o valor de todas as sementes que você comprar.
                <br />
                <span className="text-red-600">
                  Aumenta {gameConfig.taxes.seedTax.ratePerLevel * 100}% por nível do jogador.
                </span>
              </p>
            </div>
          </div>

          <div className="bg-amber-100 p-4 rounded-lg border border-amber-200">
            <p className="text-center text-amber-800 font-medium">
              Acompanhe seus impostos pagos no "Impostrômetro" localizado no painel à esquerda da tela.
            </p>
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 bg-amber-50 pt-2 pb-2 px-2">
          <Button onClick={handleClose} className="w-full bg-amber-600 hover:bg-amber-700 text-sm sm:text-base">
            Entendi, vamos começar a pagar impostos!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

