"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useGameContext } from "./game-context"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "./language-context"
import { useState } from "react"
import { Coins, Droplets, SproutIcon as Seedling, RotateCcw, Zap } from "lucide-react"
import { plantConfigs } from "@/utils/game-rules"

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const {
    coins,
    level,
    waterCapacity,
    currentWater,
    addCoins,
    addLevel,
    fillWater,
    addSeeds,
    unlockAllAreas,
    resetGame,
    setGrowthSpeedMultiplier,
    setWaterConsumptionRate,
    setRotSpeedMultiplier,
    growthSpeedMultiplier,
    waterConsumptionRate,
    rotSpeedMultiplier,
  } = useGameContext()
  const { t, language } = useLanguage()
  const { toast } = useToast()

  const [coinAmount, setCoinAmount] = useState("100")
  const [levelAmount, setLevelAmount] = useState("1")
  const [seedAmount, setSeedAmount] = useState("10")
  const [selectedSeedType, setSelectedSeedType] = useState<string>("carrot")
  const [growthSpeed, setGrowthSpeed] = useState(growthSpeedMultiplier * 100)
  const [waterRate, setWaterRate] = useState(waterConsumptionRate * 100)
  const [rotSpeed, setRotSpeed] = useState(rotSpeedMultiplier * 100)

  const handleAddCoins = () => {
    const amount = Number.parseInt(coinAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: t("invalidAmount"),
        description: t("enterPositiveNumber"),
        variant: "destructive",
      })
      return
    }

    addCoins(amount)
    toast({
      title: t("resourceAdded"),
      description: `${amount} ${t("coins")} ${t("added")}`,
    })
  }

  const handleAddLevel = () => {
    const amount = Number.parseInt(levelAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: t("invalidAmount"),
        description: t("enterPositiveNumber"),
        variant: "destructive",
      })
      return
    }

    addLevel(amount)
    toast({
      title: t("resourceAdded"),
      description: `${amount} ${t("level")} ${t("added")}`,
    })
  }

  const handleFillWater = () => {
    fillWater()
    toast({
      title: t("resourceAdded"),
      description: t("waterFilled"),
    })
  }

  const handleAddSeeds = () => {
    const amount = Number.parseInt(seedAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: t("invalidAmount"),
        description: t("enterPositiveNumber"),
        variant: "destructive",
      })
      return
    }

    addSeeds(selectedSeedType, amount)
    toast({
      title: t("resourceAdded"),
      description: `${amount} ${plantConfigs[selectedSeedType as keyof typeof plantConfigs].names[language]} ${t("added")}`,
    })
  }

  const handleUnlockAllAreas = () => {
    unlockAllAreas()
    toast({
      title: t("areasUnlocked"),
      description: t("allAreasUnlocked"),
    })
  }

  const handleResetGame = () => {
    if (confirm(t("confirmReset"))) {
      resetGame()
      toast({
        title: t("gameReset"),
        description: t("gameResetDescription"),
      })
      onClose()
    }
  }

  const handleApplySettings = () => {
    setGrowthSpeedMultiplier(growthSpeed / 100)
    setWaterConsumptionRate(waterRate / 100)
    setRotSpeedMultiplier(rotSpeed / 100)

    toast({
      title: t("settingsApplied"),
      description: t("settingsAppliedDescription"),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">{t("settings")}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="hack" className="w-full">
          <TabsList className="grid grid-cols-2 bg-amber-100">
            <TabsTrigger value="hack">{t("hackMode")}</TabsTrigger>
            <TabsTrigger value="settings">{t("gameSettings")}</TabsTrigger>
          </TabsList>

          <TabsContent value="hack" className="space-y-4 p-4 bg-white rounded-md border border-amber-200">
            <div className="grid gap-4">
              {/* Adicionar Moedas */}
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="h-5 w-5 text-amber-600" />
                  <h3 className="font-medium">{t("addCoins")}</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(e.target.value)}
                    className="flex-1"
                    min="1"
                  />
                  <Button onClick={handleAddCoins} className="bg-amber-600 hover:bg-amber-700">
                    {t("add")}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("currentCoins")}: {coins}
                </p>
              </div>

              {/* Adicionar Nível */}
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-amber-600" />
                  <h3 className="font-medium">{t("addLevel")}</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={levelAmount}
                    onChange={(e) => setLevelAmount(e.target.value)}
                    className="flex-1"
                    min="1"
                  />
                  <Button onClick={handleAddLevel} className="bg-amber-600 hover:bg-amber-700">
                    {t("add")}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("currentLevel")}: {level}
                </p>
              </div>

              {/* Encher Água */}
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">{t("addWater")}</h3>
                </div>
                <Button onClick={handleFillWater} className="w-full bg-blue-600 hover:bg-blue-700">
                  {t("fillWater")}
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  {t("currentWater")}: {currentWater}/{waterCapacity}
                </p>
              </div>

              {/* Adicionar Sementes */}
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Seedling className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">{t("addSeeds")}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select
                    value={selectedSeedType}
                    onChange={(e) => setSelectedSeedType(e.target.value)}
                    className="p-2 border border-amber-200 rounded-md"
                  >
                    {Object.entries(plantConfigs).map(([type, config]) => (
                      <option key={type} value={type}>
                        {config.icon} {config.names[language]}
                      </option>
                    ))}
                  </select>
                  <Input type="number" value={seedAmount} onChange={(e) => setSeedAmount(e.target.value)} min="1" />
                </div>
                <Button onClick={handleAddSeeds} className="w-full bg-green-600 hover:bg-green-700">
                  {t("add")}
                </Button>
              </div>

              {/* Resetar Jogo */}
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <RotateCcw className="h-5 w-5 text-red-600" />
                  <h3 className="font-medium">{t("resetGame")}</h3>
                </div>
                <Button onClick={handleResetGame} className="w-full bg-red-600 hover:bg-red-700">
                  {t("reset")}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 p-4 bg-white rounded-md border border-amber-200">
            <div className="grid gap-4">
              {/* Velocidade de Crescimento */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t("plantGrowthSpeed")}</Label>
                  <span className="text-sm font-medium">{Math.round(growthSpeed)}%</span>
                </div>
                <Slider
                  value={[growthSpeed]}
                  min={50}
                  max={300}
                  step={10}
                  onValueChange={(value) => setGrowthSpeed(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{t("slower")}</span>
                  <span>{t("faster")}</span>
                </div>
              </div>

              {/* Consumo de Água */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t("waterConsumption")}</Label>
                  <span className="text-sm font-medium">{Math.round(waterRate)}%</span>
                </div>
                <Slider
                  value={[waterRate]}
                  min={10}
                  max={200}
                  step={10}
                  onValueChange={(value) => setWaterRate(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{t("slower")}</span>
                  <span>{t("faster")}</span>
                </div>
              </div>

              {/* Velocidade de Apodrecimento */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t("rotSpeed")}</Label>
                  <span className="text-sm font-medium">{Math.round(rotSpeed)}%</span>
                </div>
                <Slider
                  value={[rotSpeed]}
                  min={10}
                  max={200}
                  step={10}
                  onValueChange={(value) => setRotSpeed(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{t("slower")}</span>
                  <span>{t("faster")}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleApplySettings} className="bg-green-600 hover:bg-green-700">
                {t("apply")}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

