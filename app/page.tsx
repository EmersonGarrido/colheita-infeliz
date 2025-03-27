"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { PlantGrid } from "@/components/plant-grid"
import { ActionMenu } from "@/components/action-menu"
import { InventoryModal } from "@/components/inventory-modal"
import { ShopModal } from "@/components/shop-modal"
import { SiloModal } from "@/components/silo-modal"
import { ProgressModal } from "@/components/progress-modal"
import { UpgradeModal } from "@/components/upgrade-modal"
import { SettingsModal } from "@/components/settings-modal"
import { PlayerNameModal } from "@/components/player-name-modal"
import { WelcomeModal } from "@/components/welcome-modal"
import { BuyLandButton } from "@/components/buy-land-button"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { GameProvider, useGameContext } from "@/components/game-context"
import { LanguageProvider } from "@/components/language-context"
import { Droplets, Settings, Coins, Map, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import "../styles/isometric.css"
import { useMobile } from "@/hooks/use-mobile"
import { AboutModal } from "@/components/about-modal"

function GameContent() {
  const { setPlayerName, saveGame, currentWater, waterCapacity, wellRefillTime, refillWater, coins } = useGameContext()
  const [showInventory, setShowInventory] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showSilo, setShowSilo] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showUpgrades, setShowUpgrades] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showBuyLand, setShowBuyLand] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Calcula o tempo restante para o poço reabastecer
  const getTimeRemaining = () => {
    if (!wellRefillTime) return null

    const now = Date.now()
    const remaining = Math.max(0, wellRefillTime - now)

    if (remaining <= 0) return null

    const seconds = Math.ceil(remaining / 1000)
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  const handleRefill = () => {
    if (wellRefillTime && wellRefillTime > Date.now()) {
      toast({
        title: "Poço reabastecendo",
        description: `Aguarde ${getTimeRemaining()} para reabastecer o poço.`,
        variant: "destructive",
        className: "bg-white border border-red-200",
      })
      return
    }

    if (currentWater >= waterCapacity) {
      toast({
        title: "Balde cheio",
        description: "Seu balde já está cheio de água.",
        variant: "destructive",
        className: "bg-white border border-red-200",
      })
      return
    }

    const success = refillWater()

    if (success) {
      toast({
        title: "Balde reabastecido",
        description: "Seu balde foi reabastecido com água fresca.",
        className: "bg-white border border-amber-200",
      })
    }
  }

  // Salva o jogo quando o usuário sai da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGame()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [saveGame])

  const setSettings = (value: boolean) => {
    setShowSettings(value)
  }

  return (
    <>
      <PlayerNameModal onNameSubmit={setPlayerName} />
      <WelcomeModal />
      <div className="flex min-h-screen flex-col bg-green-500">
        <Header />
        <main className="flex-1 relative bg-green-500 overflow-hidden">
          <PlantGrid />

          {/* Barra de recursos e configurações */}
          <div className="fixed top-20 right-4 z-50">
            <div className="flex flex-col gap-2">
              {/* Botões de Settings e Saiba Mais em formato de pílula */}
              <div className={`flex ${isMobile ? "mt-0" : "mt-0"} w-full`}>
                <div className="bg-white rounded-full flex overflow-hidden shadow-md w-full">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-2 flex items-center justify-center flex-1"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowAbout(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 flex items-center justify-center flex-1"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {isMobile && (
                <button
                  onClick={() => setShowBuyLand(true)}
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-3 flex items-center justify-center rounded-full"
                >
                  <Map className="h-5 w-5" />
                </button>
              )}

              <div className="bg-white py-2 px-5 rounded-full flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">{coins}</span>
                </div>
              </div>

              {/* Informações de água (tanto para mobile quanto para desktop) */}
              <div className="bg-white py-2 px-5 rounded-full flex items-center gap-2 mt-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                <span className="font-medium">
                  {currentWater}/{waterCapacity}
                </span>
              </div>
            </div>
          </div>

          {/* Botão de Comprar Terra (apenas para desktop) */}
          {!isMobile && <BuyLandButton />}

          {/* Botão de reabastecer água (na parte inferior esquerda para ambos desktop e mobile) */}
          <div className={`fixed ${isMobile ? "bottom-[100px] left-5" : "bottom-[100px] left-5"} z-40`}>
            <Button
              onClick={handleRefill}
              disabled={wellRefillTime !== null && wellRefillTime > Date.now()}
              className={`${wellRefillTime && wellRefillTime > Date.now() ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 px-4 rounded-full flex items-center gap-2 transition-colors shadow-md`}
            >
              <Droplets className="h-5 w-5" />
              <span>
                {wellRefillTime && wellRefillTime > Date.now()
                  ? `Reabastecendo (${getTimeRemaining()})`
                  : isMobile
                    ? "Água"
                    : `Reabastecer`}
              </span>
            </Button>
          </div>

          {/* Menu de ações (centro) */}
          <ActionMenu
            onInventoryClick={() => setShowInventory(true)}
            onShopClick={() => setShowShop(true)}
            onSiloClick={() => setShowSilo(true)}
            onProgressClick={() => setShowProgress(true)}
            onUpgradesClick={() => setShowUpgrades(true)}
          />
        </main>
        <InventoryModal open={showInventory} onClose={() => setShowInventory(false)} />
        <ShopModal open={showShop} onClose={() => setShowShop(false)} />
        <SiloModal open={showSilo} onClose={() => setShowSilo(false)} />
        <ProgressModal open={showProgress} onClose={() => setShowProgress(false)} />
        <UpgradeModal open={showUpgrades} onClose={() => setShowUpgrades(false)} />
        <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
        <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
        {isMobile && (
          <Dialog open={showBuyLand} onOpenChange={setShowBuyLand}>
            <DialogContent className="sm:max-w-[500px] bg-amber-50 border-amber-200">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold text-red-800 flex items-center justify-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Funcionalidade Desativada
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 p-4">
                <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                  <p className="text-gray-700">
                    O governo acha que você não merece ou sabe lidar com terras. Agora deve tomar cuidado para o MST
                    (Movimento Sem Terra) não invadir sua fazenda a qualquer momento.
                  </p>
                </div>

                <div className="bg-amber-100 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Aviso Importante
                  </h3>
                  <p className="text-amber-800">
                    Plante, colha e regue corretamente suas plantações, pois elas também podem ser roubadas a qualquer
                    momento!
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setShowBuyLand(false)} className="w-full bg-amber-600 hover:bg-amber-700">
                  Entendi, vou ficar atento!
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <Toaster />
      </div>
    </>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <GameProvider>
        <GameContent />
      </GameProvider>
    </LanguageProvider>
  )
}

