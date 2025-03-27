"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGameContext } from "./game-context"
import { Coins } from "lucide-react"
import { Sprite } from "./sprite"

interface InventoryModalProps {
  open: boolean
  onClose: () => void
}

export function InventoryModal({ open, onClose }: InventoryModalProps) {
  const { inventory } = useGameContext()

  // Filtra os itens por tipo
  const seeds = inventory.filter((item) => item.type === "seed")
  const crops = inventory.filter((item) => item.type === "crop")

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">Seu Inventário</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="seeds" className="w-full">
          <TabsList className="grid grid-cols-2 bg-amber-100">
            <TabsTrigger value="seeds">Sementes</TabsTrigger>
            <TabsTrigger value="crops">Colheitas</TabsTrigger>
          </TabsList>

          <TabsContent value="seeds">
            <ScrollArea className="h-[300px] rounded-md border border-amber-200 bg-white p-4">
              {seeds.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Você não tem sementes. Visite a loja!</div>
              ) : (
                <div className="grid gap-3">
                  {seeds.map((seed) => (
                    <div
                      key={seed.id}
                      className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors"
                    >
                      <div className="mr-3">
                        {seed.plantType && (
                          <Sprite spriteSheet="/assets/plants.png" {...getSeedSprite(seed.plantType)} scale={1.5} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{seed.name}</h3>
                        <p className="text-sm text-gray-600">{seed.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                          {seed.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="crops">
            <ScrollArea className="h-[300px] rounded-md border border-amber-200 bg-white p-4">
              {crops.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Você ainda não colheu nada. Plante e colha para ver seus itens aqui!
                </div>
              ) : (
                <div className="grid gap-3">
                  {crops.map((crop) => (
                    <div
                      key={crop.id}
                      className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors"
                    >
                      <div className="mr-3">
                        {crop.plantType && (
                          <Sprite spriteSheet="/assets/items.png" {...getCropSprite(crop.plantType)} scale={1.5} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{crop.name}</h3>
                        <p className="text-sm text-gray-600">{crop.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                          {crop.quantity}
                        </span>
                        <div className="flex items-center text-sm text-green-700">
                          <Coins className="h-3.5 w-3.5 mr-1" />
                          {crop.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

