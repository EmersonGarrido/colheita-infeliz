"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useGameContext } from "./game-context"
import { Coins, Warehouse, Timer } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { Sprite } from "./sprite"
import { gameConfig } from "@/utils/game-rules"
import { dispatchCoinSound } from "./game-helpers"

interface SiloModalProps {
  open: boolean
  onClose: () => void
}

export function SiloModal({ open, onClose }: SiloModalProps) {
  const {
    inventory,
    coins,
    sellCrop,
    siloCapacity,
    siloUsed,
    upgradeStorage,
    siloUpgrading,
    siloUpgradeFinishTime,
    level,
    t,
  } = useGameContext()
  const { toast } = useToast()
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)

  // Função para obter as coordenadas do sprite da colheita
  const getCropSprite = (plantType: string) => {
    const cropSprites: Record<string, { x: number; y: number; width: number; height: number }> = {
      carrot: { x: 0, y: 0, width: 16, height: 16 },
      corn: { x: 16, y: 0, width: 16, height: 16 },
      strawberry: { x: 32, y: 0, width: 16, height: 16 },
      tomato: { x: 48, y: 0, width: 16, height: 16 },
      potato: { x: 64, y: 0, width: 16, height: 16 },
    }

    return cropSprites[plantType] || cropSprites.carrot
  }

  // Atualiza o tempo restante
  useEffect(() => {
    if (!siloUpgrading || !siloUpgradeFinishTime) {
      setTimeRemaining(null)
      return
    }

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, siloUpgradeFinishTime - now)

      if (remaining <= 0) {
        setTimeRemaining(null)
        clearInterval(interval)
        return
      }

      const seconds = Math.ceil(remaining / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60

      setTimeRemaining(`${minutes}:${remainingSeconds.toString().padStart(2, "0")}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [siloUpgrading, siloUpgradeFinishTime])

  // Filtra apenas as colheitas
  const crops = inventory.filter((item) => item.type === "crop")

  // Modifique a função handleSell para não depender de gameConfig vindo do contexto
  const handleSell = (itemId: string, quantity: number) => {
    const item = inventory.find((i) => i.id === itemId && i.type === "crop")
    if (!item) return

    const totalValue = item.price * quantity
    const taxRate = level >= gameConfig.taxes.salesTax.minLevel ? gameConfig.taxes.salesTax.rate : 0
    const taxAmount = Math.floor(totalValue * taxRate)
    const netValue = totalValue - taxAmount

    sellCrop(itemId, quantity)

    // Dispara o som de moeda
    dispatchCoinSound()

    // Use strings diretas em vez de tentar usar a função t
    toast({
      title: "Vendido!",
      description:
        taxAmount > 0
          ? `Você vendeu ${quantity} ${item.name.toLowerCase()}. Valor líquido: ${netValue} moedas (Imposto: ${taxAmount})`
          : `Você vendeu ${quantity} ${item.name.toLowerCase()}.`,
    })
  }

  // Função para melhorar o armazenamento
  const handleUpgradeStorage = () => {
    const cost = Math.floor(siloCapacity * 5)

    if (siloUpgrading) {
      toast({
        title: "Melhoria em andamento",
        description: `Aguarde ${timeRemaining} para a melhoria ser concluída.`,
        variant: "destructive",
      })
      return
    }

    const success = upgradeStorage()

    if (success) {
      toast({
        title: "Melhoria iniciada!",
        description: `A melhoria do silo começou e será concluída em breve.`,
      })
    } else {
      toast({
        title: "Moedas insuficientes",
        description: `Você precisa de ${cost} moedas para melhorar o silo.`,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">Seu Silo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-amber-800" />
                <span className="font-medium">Capacidade do Silo</span>
              </div>
              <span className="text-sm font-medium">
                {siloUsed} / {siloCapacity}
              </span>
            </div>
            <Progress value={(siloUsed / siloCapacity) * 100} className="h-2" />

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Custo para melhorar:{" "}
                <span className="font-medium text-amber-800">{Math.floor(siloCapacity * 5)} moedas</span>
              </div>
              {siloUpgrading ? (
                <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                  <Timer className="h-4 w-4 animate-spin" />
                  <span>Melhorando: {timeRemaining}</span>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={handleUpgradeStorage}
                  disabled={coins < Math.floor(siloCapacity * 5)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Melhorar Silo
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2 bg-amber-200 px-3 py-1.5 rounded-full">
              <Coins className="h-5 w-5 text-amber-700" />
              <span className="font-bold text-amber-800">{coins} moedas</span>
            </div>
          </div>

          <ScrollArea className="h-[300px] rounded-md border border-amber-200 bg-white p-4">
            {crops.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Seu silo está vazio. Colha plantas para vender!</div>
            ) : (
              <div className="grid gap-3">
                {crops.map((crop) => (
                  <div key={crop.id} className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="mr-3">
                      {crop.plantType && (
                        <Sprite spriteSheet="/assets/items.png" {...getCropSprite(crop.plantType)} scale={1.5} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{crop.name}</h3>
                      <p className="text-sm text-gray-600">{crop.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center text-sm font-medium text-green-700">
                        <Coins className="h-3.5 w-3.5 mr-1" />
                        {crop.price} x {crop.quantity} = {crop.price * crop.quantity}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSell(crop.id, 1)}
                          disabled={crop.quantity < 1}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Vender 1
                        </Button>
                        {crop.quantity > 1 && (
                          <Button
                            size="sm"
                            onClick={() => handleSell(crop.id, crop.quantity)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Vender Tudo
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

