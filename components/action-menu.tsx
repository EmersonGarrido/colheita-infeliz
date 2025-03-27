"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SproutIcon as Seed, Droplets, Scissors, ShoppingBag, Package, Warehouse, Award, Zap } from "lucide-react"
import { useGameContext } from "./game-context"
// Importe o hook useMobile
import { useMobile } from "@/hooks/use-mobile"

interface ActionMenuProps {
  onInventoryClick: () => void
  onShopClick: () => void
  onSiloClick: () => void
  onProgressClick: () => void
  onUpgradesClick: () => void
}

export function ActionMenu({
  onInventoryClick,
  onShopClick,
  onSiloClick,
  onProgressClick,
  onUpgradesClick,
}: ActionMenuProps) {
  const { selectedAction, setSelectedAction, level, siloUsed, siloCapacity } = useGameContext()
  // Dentro da função ActionMenu, adicione:
  const isMobile = useMobile()

  // Função para alternar a ação selecionada
  const toggleAction = (action: string) => {
    if (selectedAction === action) {
      setSelectedAction(null)
    } else {
      setSelectedAction(action)
    }
  }

  return (
    // Modifique a div principal para ser responsiva:
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-amber-800/90 rounded-full px-4 py-2 flex items-center gap-2 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} rounded-full flex items-center justify-center transition-all ${
                selectedAction === "plant" ? "bg-amber-400 scale-110" : "bg-amber-200 hover:bg-amber-300"
              }`}
              onClick={() => toggleAction("plant")}
            >
              <Seed className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-amber-800`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Plantar sementes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} rounded-full flex items-center justify-center transition-all ${
                selectedAction === "water" ? "bg-amber-400 scale-110" : "bg-amber-200 hover:bg-amber-300"
              }`}
              onClick={() => toggleAction("water")}
            >
              <Droplets className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-amber-800`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Regar plantas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} rounded-full flex items-center justify-center transition-all ${
                selectedAction === "harvest" ? "bg-amber-400 scale-110" : "bg-amber-200 hover:bg-amber-300"
              }`}
              onClick={() => toggleAction("harvest")}
            >
              <Scissors className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-amber-800`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Colher plantas maduras</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="h-8 w-px bg-amber-600 mx-1"></div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center transition-all`}
              onClick={onInventoryClick}
            >
              <Package className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-amber-800`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver seu inventário</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center transition-all relative`}
              onClick={onSiloClick}
            >
              <Warehouse className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-amber-800`} />
              {siloUsed > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {siloUsed}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gerenciar seu silo e vender colheitas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center transition-all`}
              onClick={onShopClick}
            >
              <ShoppingBag className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-amber-800`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Comprar sementes e itens</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center transition-all`}
              onClick={onUpgradesClick}
            >
              <Zap className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-amber-800`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Melhorias e upgrades</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center transition-all relative`}
              onClick={onProgressClick}
            >
              <Award className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-amber-800`} />
              <span className="absolute -top-1 -right-1 bg-amber-100 text-amber-800 text-xs rounded-full px-1.5 py-0.5">
                {level}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver seu progresso e tarefas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

