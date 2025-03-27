"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGameContext, type PlantType } from "./game-context"
import {
  Droplets,
  Scissors,
  ZoomIn,
  ZoomOut,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  Lock,
  Unlock,
  Award,
  Clock,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-context"
import { plantConfigs, gameConfig } from "@/utils/game-rules"
import { Progress } from "@/components/ui/progress"

// Importe o hook useMobile
import { useMobile } from "@/hooks/use-mobile"

function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds <= 0) return "Pronto!"

  const seconds = Math.ceil(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function PlantGrid() {
  const {
    plots,
    selectedAction,
    plantSeed,
    waterPlot,
    harvestPlot,
    inventory,
    currentWater,
    waterCapacity,
    level,
    experience,
    experienceToNextLevel,
    coins,
    playerName,
    unlockArea,
    unlockedAreas,
    taxesPaid,
    nextTaxCollection,
    openTaxHistory,
    wellRefillTime,
    refillWater,
  } = useGameContext()
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [showSeedSelector, setShowSeedSelector] = useState(false)
  const [selectedPlot, setSelectedPlot] = useState<{ row: number; col: number } | null>(null)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [showAreaUnlockDialog, setShowAreaUnlockDialog] = useState(false)
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [timeUntilTax, setTimeUntilTax] = useState<string | null>(null)

  // Estado para controle de zoom e navegação
  // Dentro da função PlantGrid, adicione:
  const isMobile = useMobile()

  // Ajuste o zoom inicial com base no dispositivo
  const [zoom, setZoom] = useState(isMobile ? 0.7 : 1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastPosition = useRef({ x: 0, y: 0 })

  // Estado para notificações de plantas prontas
  const [readyNotifications, setReadyNotifications] = useState<
    Array<{ id: string; type: PlantType; row: number; col: number }>
  >([])

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

  // Função para lidar com o clique em um canteiro
  const handlePlotClick = (row: number, col: number) => {
    const plot = plots[row][col]

    // Se a planta estiver pronta, colhe diretamente sem precisar selecionar a ação
    if (plot && plot.state === "ready") {
      const success = harvestPlot(row, col)
      if (success) {
        toast({
          title: t("harvested"),
          description: t("youHarvested"),
          className: "bg-white border border-amber-200",
        })

        // Remove a notificação após colher
        setReadyNotifications((prev) => prev.filter((n) => !(n.row === row && n.col === col)))
      } else {
        toast({
          title: t("siloFull"),
          description: t("sellCropsFirst"),
          variant: "destructive",
          className: "bg-white border border-red-200",
        })
      }
      return
    }

    // Se a planta estiver podre, remove diretamente
    if (plot && plot.state === "rotten") {
      harvestPlot(row, col)
      toast({
        title: t("removed"),
        description: t("plantRotted"),
        variant: "destructive",
        className: "bg-white border border-red-200",
      })
      return
    }

    // Se a planta precisar de água e tiver água disponível, rega diretamente
    if (plot && plot.needsWater && currentWater > 0) {
      const success = waterPlot(row, col)
      if (success) {
        toast({
          title: t("watered"),
          description: t("plantWatered"),
          className: "bg-white border border-amber-200",
        })
      } else {
        toast({
          title: t("noWater"),
          description: t("refillBucket"),
          variant: "destructive",
          className: "bg-white border border-red-200",
        })
      }
      return
    }

    // Caso contrário, usa a ação selecionada
    if (selectedAction === "plant") {
      // Se o canteiro não estiver vazio, não faz nada
      if (plot) {
        toast({
          title: t("plotOccupied"),
          description: t("plotHasPlant"),
          variant: "destructive",
          className: "bg-white border border-red-200",
        })
        return
      }

      // Filtra sementes disponíveis no inventário
      const availableSeeds = inventory.filter((item) => item.type === "seed" && item.quantity > 0)

      if (availableSeeds.length === 0) {
        toast({
          title: t("noSeeds"),
          description: t("visitShop"),
          variant: "destructive",
          className: "bg-white border border-red-200",
        })
        return
      }

      // Primeiro define o selectedPlot
      setSelectedPlot({ row, col })

      // Se só tiver um tipo de semente, usa ela diretamente
      if (availableSeeds.length === 1 && availableSeeds[0].plantType) {
        plantSeed(row, col, availableSeeds[0].plantType)
        setShowSeedSelector(false)
        setSelectedPlot(null)
        toast({
          title: t("planted"),
          description: `${t("youPlanted")} ${availableSeeds[0].name.toLowerCase()}.`,
          className: "bg-white border border-amber-200",
        })
      } else {
        // Abre o seletor de sementes
        setShowSeedSelector(true)
      }
    } else if (selectedAction === "water") {
      if (plot) {
        if (currentWater <= 0) {
          toast({
            title: t("noWater"),
            description: t("refillBucket"),
            variant: "destructive",
            className: "bg-white border border-red-200",
          })
          return
        }

        const success = waterPlot(row, col)
        if (success) {
          toast({
            title: t("watered"),
            description: t("plantWatered"),
            className: "bg-white border border-amber-200",
          })
        }
      }
    } else if (selectedAction === "harvest") {
      if (plot && plot.state === "ready") {
        const success = harvestPlot(row, col)
        if (success) {
          toast({
            title: t("harvested"),
            description: t("youHarvested"),
            className: "bg-white border border-amber-200",
          })

          // Remove a notificação após colher
          setReadyNotifications((prev) => prev.filter((n) => !(n.row === row && n.col === col)))
        } else {
          toast({
            title: t("siloFull"),
            description: t("sellCropsFirst"),
            variant: "destructive",
            className: "bg-white border border-red-200",
          })
        }
      } else if (plot && plot.state === "rotten") {
        harvestPlot(row, col)
        toast({
          title: t("removed"),
          description: t("plantRotted"),
          variant: "destructive",
          className: "bg-white border border-red-200",
        })
      } else if (plot) {
        toast({
          title: t("notReady"),
          description: t("plantNotReady"),
          variant: "destructive",
          className: "bg-white border border-red-200",
        })
      }
    }
  }

  // Função para plantar a semente selecionada
  const handlePlantSeed = (plantType: PlantType) => {
    if (selectedPlot) {
      plantSeed(selectedPlot.row, selectedPlot.col, plantType)
      setShowSeedSelector(false)
      setSelectedPlot(null)
      toast({
        title: t("planted"),
        description: t("seedPlanted"),
        className: "bg-white border border-amber-200",
      })
    }
  }

  // Função para lidar com o clique em uma área bloqueada
  const handleAreaClick = (area: string) => {
    if (unlockedAreas.includes(area)) {
      toast({
        title: t("areaUnlocked"),
        description: t("areaAlreadyUnlocked"),
        className: "bg-white border border-amber-200",
      })
      return
    }

    setSelectedArea(area)
    setShowAreaUnlockDialog(true)
  }

  // Função para desbloquear uma área
  const handleUnlockArea = () => {
    if (!selectedArea) return

    const area = gameConfig.areas[selectedArea as keyof typeof gameConfig.areas]

    if (level < area.requiredLevel) {
      toast({
        title: t("levelTooLow"),
        description: t("needLevel").replace("{level}", area.requiredLevel.toString()),
        variant: "destructive",
        className: "bg-white border border-red-200",
      })
      setShowAreaUnlockDialog(false)
      return
    }

    if (coins < area.unlockCost) {
      toast({
        title: t("notEnoughCoins"),
        description: t("needCoins").replace("{coins}", area.unlockCost.toString()),
        variant: "destructive",
        className: "bg-white border border-red-200",
      })
      setShowAreaUnlockDialog(false)
      return
    }

    const success = unlockArea(selectedArea)
    if (success) {
      toast({
        title: t("areaUnlocked"),
        description: t("enjoyNewArea"),
        className: "bg-white border border-amber-200",
      })
    }

    setShowAreaUnlockDialog(false)
  }

  // Ícones para cada tipo de planta
  const plantIcons = {
    carrot: "🥕",
    corn: "🌽",
    strawberry: "🍓",
    tomato: "🍅",
    potato: "🥔",
  }

  // Função para renderizar o conteúdo de um canteiro
  const renderPlotContent = (plot: (typeof plots)[0][0], row: number, col: number) => {
    if (!plot) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full bg-amber-800 rounded-md border border-amber-900"></div>
        </div>
      )
    }

    // Calcula o tempo restante para crescer
    const now = Date.now()
    const elapsedTime = now - plot.plantedAt
    const timeRemaining = Math.max(0, plot.growthTime - elapsedTime)

    // Determina a cor com base no tipo de planta
    const plantColors = {
      carrot: "bg-orange-500",
      corn: "bg-yellow-400",
      strawberry: "bg-red-500",
      tomato: "bg-red-600",
      potato: "bg-amber-700",
    }

    // Determina o estágio de crescimento
    const growthPercent = plot.state === "growing" ? plot.growthStage / plot.maxGrowthStage : 0
    const stageHeight =
      plot.state === "seeded"
        ? "h-1/4"
        : plot.state === "growing"
          ? growthPercent < 0.33
            ? "h-1/3"
            : growthPercent < 0.66
              ? "h-1/2"
              : "h-2/3"
          : "h-full"

    return (
      <div className="w-full h-full relative">
        {/* Canteiro (seco ou molhado) - vermelho se estiver podre */}
        <div
          className={`w-full h-full rounded-md border ${
            plot.state === "rotten"
              ? "bg-red-200 border-red-300"
              : plot.waterLevel > 0
                ? "bg-amber-800 border-amber-900"
                : "bg-amber-700 border-amber-800"
          }`}
        ></div>

        {/* Planta */}
        {plot.state !== "rotten" && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Mostrar ícone da planta no centro sempre */}
            <div
              className={`w-2/3 ${stageHeight} rounded-t-md ${plantColors[plot.type] || "bg-green-500"} ${
                plot.state === "ready" ? "animate-pulse" : ""
              } flex items-center justify-center`}
            >
              <span className="text-xl">{plantIcons[plot.type]}</span>
            </div>
          </div>
        )}

        {/* Planta podre */}
        {plot.state === "rotten" && (
          <div className="absolute inset-0 flex items-center justify-center text-2xl">💀</div>
        )}

        {/* Ícones de ação na parte superior */}
        <div className="absolute top-1 right-1 flex gap-1 p-1 z-20">
          {/* Indicador de necessidade de água */}
          {plot.needsWater && (
            <div className="bg-blue-100 rounded-full p-1">
              <Droplets className="h-4 w-4 text-blue-500" />
            </div>
          )}

          {/* Indicador de pronto para colheita */}
          {plot.state === "ready" && (
            <div className="bg-green-100 rounded-full p-1">
              <Scissors className="h-4 w-4 text-green-500" />
            </div>
          )}
        </div>

        {/* Timer */}
        {(plot.state === "seeded" || plot.state === "growing") && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/70 text-xs text-center py-1 rounded-b-md z-20">
            {formatTimeRemaining(timeRemaining)}
          </div>
        )}
      </div>
    )
  }

  // Funções para controle de zoom e navegação
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleMove = (direction: "up" | "down" | "left" | "right") => {
    const step = 50
    setPosition((prev) => {
      switch (direction) {
        case "up":
          return { ...prev, y: prev.y + step }
        case "down":
          return { ...prev, y: prev.y - step }
        case "left":
          return { ...prev, x: prev.x + step }
        case "right":
          return { ...prev, x: prev.x + step }
        default:
          return prev
      }
    })
  }

  // Funções para arrastar com o mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Botão esquerdo do mouse
      isDragging.current = true
      lastPosition.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      const deltaX = e.clientX - lastPosition.current.x
      const deltaY = e.clientY - lastPosition.current.y

      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))

      lastPosition.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  // Adicione estas variáveis para controlar o toque
  const touchStartRef = useRef({ x: 0, y: 0 })
  const lastTouchRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)

  // Adicione estas funções para lidar com eventos de toque
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isTouchingRef.current = true
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isTouchingRef.current && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - lastTouchRef.current.x
      const deltaY = e.touches[0].clientY - lastTouchRef.current.y

      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))

      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  const handleTouchEnd = () => {
    isTouchingRef.current = false
  }

  // Adiciona eventos de mouse ao documento
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false
    }

    document.addEventListener("mouseup", handleGlobalMouseUp)

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [])

  // Atualiza o tempo até a próxima coleta de impostos
  useEffect(() => {
    if (!nextTaxCollection) return

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, nextTaxCollection - now)

      if (remaining <= 0) {
        setTimeUntilTax(null)
        clearInterval(interval)
        return
      }

      const seconds = Math.ceil(remaining / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60

      setTimeUntilTax(`${minutes}:${remainingSeconds.toString().padStart(2, "0")}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [nextTaxCollection])

  // Verifica plantas prontas e agrupa notificações
  useEffect(() => {
    const readyPlants: Array<{ id: string; type: PlantType; row: number; col: number }> = []

    plots.forEach((row, rowIndex) => {
      row.forEach((plot, colIndex) => {
        if (plot && plot.state === "ready") {
          const id = `${rowIndex}-${colIndex}`
          // Verifica se já existe uma notificação para esta planta
          const existingNotification = readyNotifications.find((n) => n.id === id)
          if (!existingNotification) {
            readyPlants.push({
              id,
              type: plot.type,
              row: rowIndex,
              col: colIndex,
            })
          }
        }
      })
    })

    if (readyPlants.length > 0) {
      setReadyNotifications((prev) => [...prev, ...readyPlants])
    }
  }, [plots, readyNotifications])

  // Atualiza o componente a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Filtra sementes disponíveis no inventário
  const availableSeeds = inventory.filter((item) => item.type === "seed" && item.quantity > 0)

  // Agrupa notificações por tipo de planta
  const groupedNotifications = readyNotifications.reduce(
    (acc, notification) => {
      const type = notification.type
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(notification)
      return acc
    },
    {} as Record<PlantType, typeof readyNotifications>,
  )

  // Renderiza áreas desbloqueáveis
  const renderUnlockableAreas = () => {
    // Posições para as áreas ao redor do centro
    const areaPositions = {
      north: { x: 0, y: -120 }, // Acima
      south: { x: 0, y: 120 }, // Abaixo
      east: { x: 120, y: 0 }, // Direita
      west: { x: -120, y: 0 }, // Esquerda
    }

    return (
      <>
        {Object.entries(areaPositions).map(([area, position]) => {
          const isUnlocked = unlockedAreas.includes(area)
          const areaConfig = gameConfig.areas[area as keyof typeof gameConfig.areas]

          // Verifica se o nível do jogador é suficiente para mostrar a área
          const canSee = level >= Math.max(1, areaConfig.requiredLevel - 2)

          if (!canSee && !isUnlocked) return null

          return (
            <div
              key={area}
              className={`absolute cursor-pointer ${isUnlocked ? "opacity-100" : "opacity-80"}`}
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: "rotateX(60deg) rotateZ(-45deg)",
                transformStyle: "preserve-3d",
                zIndex: 5,
                width: "96px",
                height: "96px",
              }}
              onClick={() => !isUnlocked && handleAreaClick(area)}
            >
              <div
                className={`w-full h-full rounded-md border-2 border-dashed flex flex-col items-center justify-center ${
                  isUnlocked ? "bg-amber-800 border-amber-900" : "bg-gray-400 border-gray-500"
                }`}
              >
                <div className="text-center">
                  {isUnlocked ? (
                    <Unlock className="h-6 w-6 text-green-600 mb-1" />
                  ) : (
                    <Lock className="h-6 w-6 text-white mb-1" />
                  )}
                  <div className="text-xs font-medium text-center text-white">
                    {area === "north"
                      ? t("areaNorth")
                      : area === "south"
                        ? t("areaSouth")
                        : area === "east"
                          ? t("areaEast")
                          : t("areaWest")}
                    {!isUnlocked && (
                      <div className="text-[10px]">
                        ({t("level")} {areaConfig.requiredLevel})
                        <div>
                          {areaConfig.unlockCost} {t("coins")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <>
      {/* Painel de informações do jogador (lado esquerdo) */}
      <div className="absolute top-20 left-4 z-50 bg-white/90 p-3 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-amber-500 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {playerName ? playerName.charAt(0).toUpperCase() : "F"}
          </div>
          <div>
            <div className="font-medium">{playerName || t("farmer")}</div>
            <div className="flex items-center text-sm">
              <Award className="h-4 w-4 text-amber-500 mr-1" />
              {t("level")} {level}
            </div>
            <div className="w-32 mt-1">
              <div className="flex justify-between text-xs mb-1">
                <span>XP</span>
                <span>
                  {experience}/{experienceToNextLevel}
                </span>
              </div>
              <Progress value={(experience / experienceToNextLevel) * 100} className="h-1.5" />
            </div>
          </div>
        </div>

        {/* Impostrômetro */}
        <div className="border-t border-gray-200 pt-2">
          <h3 className="font-bold text-red-600 text-center">{t("taxMeter")}</h3>
          <div className="text-xl font-bold text-red-600 text-center">
            {taxesPaid} {t("coins")}
          </div>
          {timeUntilTax && (
            <div className="flex items-center justify-center text-xs text-gray-600 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {t("nextTaxCollection")}: {timeUntilTax}
            </div>
          )}
          <Button size="sm" variant="outline" className="w-full mt-2 text-xs" onClick={openTaxHistory}>
            {t("viewTaxHistory")}
          </Button>
        </div>
      </div>

      <div
        className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-green-500"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
      >
        {/* Controles de navegação e zoom */}
        {/* Modifique os controles de navegação para serem mais compactos em dispositivos móveis: */}
        <div className={`absolute ${isMobile ? "bottom-5 right-5 p-5" : "bottom-5 right-5"} z-50 flex flex-col gap-2`}>
          <div className="flex gap-2 justify-center">
            <Button size={isMobile ? "sm" : "icon"} variant="secondary" onClick={() => handleMove("up")}>
              <MoveUp className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size={isMobile ? "sm" : "icon"} variant="secondary" onClick={() => handleMove("left")}>
              <MoveLeft className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </Button>
            <Button size={isMobile ? "sm" : "icon"} variant="secondary" onClick={() => handleMove("down")}>
              <MoveDown className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </Button>
            <Button size={isMobile ? "sm" : "icon"} variant="secondary" onClick={() => handleMove("right")}>
              <MoveRight className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Button size={isMobile ? "sm" : "icon"} variant="secondary" onClick={handleZoomOut}>
              <ZoomOut className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </Button>
            <Button size={isMobile ? "sm" : "icon"} variant="secondary" onClick={handleZoomIn}>
              <ZoomIn className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </Button>
          </div>
        </div>

        {/* Notificações de plantas prontas (agrupadas por tipo) */}
        {Object.keys(groupedNotifications).length > 0 && (
          <div className="absolute top-20 right-4 z-40 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            {Object.entries(groupedNotifications).map(([type, notifications]) => (
              <div
                key={type}
                className="bg-white/90 p-3 rounded-lg shadow-md flex items-center gap-2 cursor-pointer hover:bg-white"
                onClick={() => {
                  // Centraliza a visualização na primeira planta pronta deste tipo
                  if (notifications.length > 0) {
                    const firstPlant = notifications[0]
                    const centerX = (firstPlant.col - 1.5) * 24
                    const centerY = (firstPlant.row - 1.5) * 24

                    setPosition({ x: -centerX, y: -centerY })

                    // Destaca a planta
                    toast({
                      title: t("readyToHarvest"),
                      description: `${plantConfigs[type as PlantType].names[language]} ${t("readyToHarvest").toLowerCase()}`,
                      className: "bg-white border border-amber-200",
                    })
                  }
                }}
              >
                <div className="text-xl">{plantIcons[type as PlantType]}</div>
                <div className="flex-1">
                  <div className="font-medium">
                    {plantConfigs[type as PlantType].names[language]} {t("ready")}!
                  </div>
                  <div className="text-xs text-gray-600">
                    {notifications.length} {t("plants")} {t("readyToHarvest").toLowerCase()}
                  </div>
                </div>
                <div className="bg-green-100 rounded-full px-2 py-1 text-green-800 font-bold">
                  {notifications.length}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grade de plantação com zoom e posição */}
        <div
          ref={containerRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          }}
        >
          {/* Áreas desbloqueáveis */}
          {renderUnlockableAreas()}

          <div
            className="grid grid-cols-4 gap-4 md:gap-4"
            style={{
              transform: `rotateX(60deg) rotateZ(-45deg) scale(${zoom})`,
              transformStyle: "preserve-3d",
              transition: "transform 0.3s ease",
              gap: isMobile ? "1rem" : "1rem", // Aumenta o espaçamento entre os canteiros no mobile
            }}
          >
            {plots.map((row, rowIndex) =>
              row.map((plot, colIndex) => (
                <TooltipProvider key={`${rowIndex}-${colIndex}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* Ajuste o tamanho dos canteiros para dispositivos móveis: */}
                      <div
                        className={`
                        w-${isMobile ? "16" : "24"} h-${isMobile ? "16" : "24"} cursor-pointer transition-all duration-200
                        hover:shadow-lg hover:brightness-110
                        ${plot?.state === "ready" ? "animate-pulse" : ""}
                      `}
                        onClick={() => handlePlotClick(rowIndex, colIndex)}
                        style={{
                          transformStyle: "preserve-3d",
                          transform: "translateZ(0px)",
                          transition: "transform 0.2s ease",
                          width: isMobile ? "60px" : "96px", // Tamanho fixo para mobile
                          height: isMobile ? "60px" : "96px", // Tamanho fixo para mobile
                          margin: isMobile ? "8px" : "0", // Adiciona margem extra no mobile
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateZ(10px)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateZ(0px)"
                        }}
                      >
                        {renderPlotContent(plot, rowIndex, colIndex)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="z-[100]">
                      {!plot ? (
                        <p>{t("emptyPlot")}</p>
                      ) : (
                        <div>
                          <p className="font-bold">{plantConfigs[plot.type].names[language]}</p>
                          <p>
                            {t("state")}: {t(plot.state)}
                          </p>
                          {plot.state !== "ready" && plot.state !== "rotten" && (
                            <>
                              <p>
                                {t("water")}: {plot.waterLevel.toFixed(1)}/{plantConfigs[plot.type].waterNeeded}
                              </p>
                              {plot.state === "growing" && (
                                <p>
                                  {t("progress")}: {Math.round((plot.growthStage / plot.maxGrowthStage) * 100)}%
                                </p>
                              )}
                              <p>
                                {t("timeRemaining")}:{" "}
                                {formatTimeRemaining(Math.max(0, plot.growthTime - (Date.now() - plot.plantedAt)))}
                              </p>
                            </>
                          )}
                          {plot.state === "ready" && (
                            <p className="text-green-600 font-medium">{t("clickToHarvest")}</p>
                          )}
                          {plot.state === "rotten" && <p className="text-red-600 font-medium">{t("clickToRemove")}</p>}
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )),
            )}
          </div>
        </div>
      </div>

      {/* Modal de seleção de sementes */}
      <Dialog open={showSeedSelector} onOpenChange={setShowSeedSelector}>
        <DialogContent className="sm:max-w-[400px] bg-amber-50 border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-amber-800">{t("chooseSeed")}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 p-2">
            {availableSeeds.map((seed) => (
              <Button
                key={seed.id}
                variant="outline"
                className="flex items-center justify-start p-4 h-auto bg-white hover:bg-amber-100"
                onClick={() => seed.plantType && handlePlantSeed(seed.plantType)}
              >
                <div className="w-8 h-8 mr-3 flex items-center justify-center">
                  <span className="text-xl">{seed.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{seed.name}</h3>
                  <p className="text-xs text-gray-600">{seed.description}</p>
                </div>
                <div className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                  {seed.quantity}
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de desbloqueio de área */}
      <Dialog open={showAreaUnlockDialog} onOpenChange={setShowAreaUnlockDialog}>
        <DialogContent className="sm:max-w-[400px] bg-amber-50 border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-amber-800">{t("unlockArea")}</DialogTitle>
          </DialogHeader>

          {selectedArea && (
            <div className="p-4">
              <p className="mb-4 text-center">
                {t("unlockAreaConfirm").replace(
                  "{area}",
                  gameConfig.areas[selectedArea as keyof typeof gameConfig.areas].names[language],
                )}
              </p>

              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between">
                  <span>{t("cost")}:</span>
                  <span className="font-bold">
                    {gameConfig.areas[selectedArea as keyof typeof gameConfig.areas].unlockCost} {t("coins")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("requiredLevel")}:</span>
                  <span className="font-bold">
                    {gameConfig.areas[selectedArea as keyof typeof gameConfig.areas].requiredLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("plotsAdded")}:</span>
                  <span className="font-bold">
                    {gameConfig.areas[selectedArea as keyof typeof gameConfig.areas].gridSize}x
                    {gameConfig.areas[selectedArea as keyof typeof gameConfig.areas].gridSize}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAreaUnlockDialog(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleUnlockArea}
                  disabled={
                    level < gameConfig.areas[selectedArea as keyof typeof gameConfig.areas].requiredLevel ||
                    coins < gameConfig.areas[selectedArea as keyof typeof gameConfig.areas].unlockCost
                  }
                >
                  {t("unlock")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

