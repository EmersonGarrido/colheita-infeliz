"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useGameContext } from "./game-context"
import { Coins, Droplets, Timer, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "./language-context"
import { gameConfig } from "@/utils/game-rules"

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const {
    coins,
    waterCapacity,
    wellRefillTime,
    upgradeWaterBucket,
    upgradeWell,
    upgradeFertilizer,
    waterBucketLevel,
    wellLevel,
    fertilizerLevel,
    growthSpeedMultiplier,
  } = useGameContext()
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleUpgradeWaterBucket = () => {
    if (waterBucketLevel >= gameConfig.upgrades.waterBucket.maxLevel) {
      toast({
        title: t("maxLevelReached"),
        description: t("bucketMaxLevel"),
        variant: "destructive",
      })
      return
    }

    const cost = Math.floor(
      gameConfig.upgrades.waterBucket.baseCost *
        Math.pow(gameConfig.upgrades.waterBucket.costMultiplier, waterBucketLevel),
    )

    if (coins < cost) {
      toast({
        title: t("notEnoughCoins"),
        description: t("needCoins").replace("{coins}", cost.toString()),
        variant: "destructive",
      })
      return
    }

    const success = upgradeWaterBucket()
    if (success) {
      toast({
        title: t("upgradeSuccess"),
        description: t("bucketUpgraded"),
      })
    }
  }

  const handleUpgradeWell = () => {
    if (wellLevel >= gameConfig.upgrades.well.maxLevel) {
      toast({
        title: t("maxLevelReached"),
        description: t("wellMaxLevel"),
        variant: "destructive",
      })
      return
    }

    const cost = Math.floor(
      gameConfig.upgrades.well.baseCost * Math.pow(gameConfig.upgrades.well.costMultiplier, wellLevel),
    )

    if (coins < cost) {
      toast({
        title: t("notEnoughCoins"),
        description: t("needCoins").replace("{coins}", cost.toString()),
        variant: "destructive",
      })
      return
    }

    const success = upgradeWell()
    if (success) {
      toast({
        title: t("upgradeSuccess"),
        description: t("wellUpgraded"),
      })
    }
  }

  const handleUpgradeFertilizer = () => {
    if (fertilizerLevel >= gameConfig.upgrades.fertilizer.maxLevel) {
      toast({
        title: t("maxLevelReached"),
        description: t("fertilizerMaxLevel"),
        variant: "destructive",
      })
      return
    }

    const cost = Math.floor(
      gameConfig.upgrades.fertilizer.baseCost *
        Math.pow(gameConfig.upgrades.fertilizer.costMultiplier, fertilizerLevel),
    )

    if (coins < cost) {
      toast({
        title: t("notEnoughCoins"),
        description: t("needCoins").replace("{coins}", cost.toString()),
        variant: "destructive",
      })
      return
    }

    const success = upgradeFertilizer()
    if (success) {
      toast({
        title: t("upgradeSuccess"),
        description: t("fertilizerUpgraded"),
      })
    }
  }

  // Calcula os custos dos upgrades
  const waterBucketCost = Math.floor(
    gameConfig.upgrades.waterBucket.baseCost *
      Math.pow(gameConfig.upgrades.waterBucket.costMultiplier, waterBucketLevel),
  )

  const wellCost = Math.floor(
    gameConfig.upgrades.well.baseCost * Math.pow(gameConfig.upgrades.well.costMultiplier, wellLevel),
  )

  const fertilizerCost = Math.floor(
    gameConfig.upgrades.fertilizer.baseCost * Math.pow(gameConfig.upgrades.fertilizer.costMultiplier, fertilizerLevel),
  )

  // Calcula os efeitos dos próximos upgrades
  const nextBucketCapacity = waterCapacity + gameConfig.upgrades.waterBucket.capacityIncrease
  const nextWellRefillTime = Math.max(
    10,
    gameConfig.wellRefillTime - (wellLevel + 1) * gameConfig.upgrades.well.timeReduction,
  )
  const nextGrowthSpeed = growthSpeedMultiplier + gameConfig.upgrades.fertilizer.speedBoost

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">{t("upgradeShop")}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 bg-amber-200 px-3 py-1.5 rounded-full">
            <Coins className="h-5 w-5 text-amber-700" />
            <span className="font-bold text-amber-800">
              {coins} {t("coins")}
            </span>
          </div>
        </div>

        <ScrollArea className="h-[400px] rounded-md border border-amber-200 bg-white p-4">
          <div className="grid gap-6">
            {/* Upgrade do Balde de Água */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{t("upgradeWaterBucket")}</h3>
                  <p className="text-sm text-gray-600">
                    {t("currentLevel")}: {waterBucketLevel}/{gameConfig.upgrades.waterBucket.maxLevel}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white p-2 rounded border border-amber-100">
                  <p className="text-xs text-gray-500">{t("bucketCapacity")}</p>
                  <p className="font-medium">
                    {waterCapacity} → {nextBucketCapacity}
                  </p>
                </div>
                <div className="bg-white p-2 rounded border border-amber-100">
                  <p className="text-xs text-gray-500">{t("cost")}</p>
                  <div className="flex items-center">
                    <Coins className="h-3.5 w-3.5 mr-1 text-amber-600" />
                    <span className="font-medium">{waterBucketCost}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUpgradeWaterBucket}
                disabled={coins < waterBucketCost || waterBucketLevel >= gameConfig.upgrades.waterBucket.maxLevel}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {waterBucketLevel >= gameConfig.upgrades.waterBucket.maxLevel ? t("maxLevelReached") : t("upgrade")}
              </Button>
            </div>

            {/* Upgrade do Poço */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Timer className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{t("upgradeWell")}</h3>
                  <p className="text-sm text-gray-600">
                    {t("currentLevel")}: {wellLevel}/{gameConfig.upgrades.well.maxLevel}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white p-2 rounded border border-amber-100">
                  <p className="text-xs text-gray-500">{t("wellRefillTime")}</p>
                  <p className="font-medium">
                    {gameConfig.wellRefillTime - wellLevel * gameConfig.upgrades.well.timeReduction}s →{" "}
                    {nextWellRefillTime}s
                  </p>
                </div>
                <div className="bg-white p-2 rounded border border-amber-100">
                  <p className="text-xs text-gray-500">{t("cost")}</p>
                  <div className="flex items-center">
                    <Coins className="h-3.5 w-3.5 mr-1 text-amber-600" />
                    <span className="font-medium">{wellCost}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUpgradeWell}
                disabled={coins < wellCost || wellLevel >= gameConfig.upgrades.well.maxLevel}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {wellLevel >= gameConfig.upgrades.well.maxLevel ? t("maxLevelReached") : t("upgrade")}
              </Button>
            </div>

            {/* Upgrade do Fertilizante */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{t("upgradeFertilizer")}</h3>
                  <p className="text-sm text-gray-600">
                    {t("currentLevel")}: {fertilizerLevel}/{gameConfig.upgrades.fertilizer.maxLevel}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white p-2 rounded border border-amber-100">
                  <p className="text-xs text-gray-500">{t("growthSpeed")}</p>
                  <p className="font-medium">
                    {Math.round(growthSpeedMultiplier * 100)}% → {Math.round(nextGrowthSpeed * 100)}%
                  </p>
                </div>
                <div className="bg-white p-2 rounded border border-amber-100">
                  <p className="text-xs text-gray-500">{t("cost")}</p>
                  <div className="flex items-center">
                    <Coins className="h-3.5 w-3.5 mr-1 text-amber-600" />
                    <span className="font-medium">{fertilizerCost}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUpgradeFertilizer}
                disabled={coins < fertilizerCost || fertilizerLevel >= gameConfig.upgrades.fertilizer.maxLevel}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {fertilizerLevel >= gameConfig.upgrades.fertilizer.maxLevel ? t("maxLevelReached") : t("upgrade")}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

