"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useGameContext } from "./game-context"
import { Coins } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Sprite } from "./sprite"

interface ShopModalProps {
  open: boolean
  onClose: () => void
}

export function ShopModal({ open, onClose }: ShopModalProps) {
  const { shopItems, buySeed, coins, level } = useGameContext()
  const { toast } = useToast()

  // Função para obter as coordenadas do sprite da semente
  const getSeedSprite = (plantType: string) => {
    const seedSprites: Record<string, { x: number; y: number; width: number; height: number }> = {
      carrot: { x: 0, y: 48, width: 16, height: 16 },
      corn: { x: 0, y: 64, width: 16, height: 16 },
      strawberry: { x: 0, y: 32, width: 16, height: 16 },
      tomato: { x: 0, y: 16, width: 16, height: 16 },
      potato: { x: 0, y: 0, width: 16, height: 16 },
    }

    return seedSprites[plantType] || seedSprites.carrot
  }

  // Função para comprar um item
  const handleBuy = (item: (typeof shopItems)[0]) => {
    if (coins < item.price) {
      toast({
        title: "Moedas insuficientes",
        description: "Você não tem moedas suficientes para comprar este item.",
        variant: "destructive",
      })
      return
    }

    if (level < item.requiredLevel) {
      toast({
        title: "Nível insuficiente",
        description: `Você precisa ser nível ${item.requiredLevel} para comprar este item.`,
        variant: "destructive",
      })
      return
    }

    const success = buySeed(item)

    if (success) {
      toast({
        title: "Compra realizada!",
        description: `Você comprou ${item.name.toLowerCase()}.`,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">Loja de Sementes</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 bg-amber-200 px-3 py-1.5 rounded-full">
            <Coins className="h-5 w-5 text-amber-700" />
            <span className="font-bold text-amber-800">{coins} moedas</span>
          </div>
        </div>

        <ScrollArea className="h-[300px] rounded-md border border-amber-200 bg-white p-4">
          <div className="grid gap-3">
            {shopItems.map((item) => {
              const isLocked = level < item.requiredLevel

              return (
                <div
                  key={item.id}
                  className={`flex items-center p-3 rounded-lg border ${isLocked ? "bg-gray-50 border-gray-200" : "bg-amber-50 border-amber-100"}`}
                >
                  <div className="mr-3">
                    {isLocked ? (
                      <div className="w-8 h-8 flex items-center justify-center text-xl">🔒</div>
                    ) : (
                      <Sprite spriteSheet="/assets/plants.png" {...getSeedSprite(item.plantType)} scale={1.5} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium flex items-center">
                      {item.name}
                      {isLocked && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                          Nível {item.requiredLevel}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isLocked ? `Desbloqueado no nível ${item.requiredLevel}` : item.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center text-sm font-medium text-amber-800">
                      <Coins className="h-3.5 w-3.5 mr-1" />
                      {item.price}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBuy(item)}
                      disabled={coins < item.price || isLocked}
                      className={isLocked ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
                    >
                      {isLocked ? "Bloqueado" : "Comprar"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

