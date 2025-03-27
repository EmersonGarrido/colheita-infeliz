"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { plantConfigs, gameConfig } from "@/utils/game-rules"
import { LanguageContext } from "./language-context"
import { TaxHistoryModal } from "@/components/tax-history-modal"

// Tipos de plantas disponíveis
export type PlantType = "carrot" | "corn" | "strawberry" | "tomato" | "potato"

// Estados possíveis de um canteiro
export type PlotState = "empty" | "seeded" | "growing" | "ready" | "rotten"

// Interface para uma planta
export interface Plant {
  type: PlantType
  state: PlotState
  waterLevel: number
  growthStage: number
  maxGrowthStage: number
  growthTime: number // Tempo total para crescer em segundos
  lastWatered: number // Timestamp da última vez que foi regada
  plantedAt: number // Timestamp de quando foi plantada
  readyAt: number | null // Timestamp de quando ficou pronta
  needsWater: boolean
  rotTimer: number | null // Timer para a planta apodrecer
  nextWaterStage: number | null // Próximo estágio que precisa de água (porcentagem)
}

// Interface para um item do inventário
export interface InventoryItem {
  id: string
  name: string
  type: "seed" | "crop"
  plantType?: PlantType
  quantity: number
  price: number
  icon: string
  description: string
}

// Interface para um item da loja
export interface ShopItem {
  id: string
  name: string
  type: "seed"
  plantType: PlantType
  price: number
  icon: string
  description: string
  requiredLevel: number
}

// Interface para uma tarefa
export interface Task {
  id: string
  description: string
  target: number
  current: number
  reward: number
  type: "plant" | "harvest" | "water"
  plantType?: PlantType
  completed: boolean
}

// Adicionar interface para histórico de impostos
export interface TaxRecord {
  id: string
  type: "income" | "capitalGains" | "sales" | "seedTax"
  amount: number
  date: number // timestamp
}

// Interface para o contexto do jogo
interface GameContextType {
  playerName: string
  setPlayerName: (name: string) => void
  plots: (Plant | null)[][]
  inventory: InventoryItem[]
  shopItems: ShopItem[]
  coins: number
  level: number
  experience: number
  experienceToNextLevel: number
  siloCapacity: number
  siloUsed: number
  siloUpgrading: boolean
  siloUpgradeFinishTime: number | null
  waterCapacity: number
  currentWater: number
  wellRefillTime: number | null
  tasks: Task[]
  selectedAction: string | null
  setSelectedAction: (action: string | null) => void
  plantSeed: (row: number, col: number, plantType: PlantType) => void
  waterPlot: (row: number, col: number) => boolean
  harvestPlot: (row: number, col: number) => boolean
  buySeed: (item: ShopItem) => boolean
  sellCrop: (itemId: string, quantity: number) => void
  addToInventory: (item: Partial<InventoryItem>, quantity: number) => boolean
  removeFromInventory: (itemId: string, quantity: number) => void
  updateTask: (type: Task["type"], plantType?: PlantType) => void
  upgradeStorage: () => boolean
  refillWater: () => boolean
  saveGame: () => void
  loadGame: () => void
  // Novas funcionalidades
  unlockedAreas: string[]
  unlockArea: (area: string) => boolean
  waterBucketLevel: number
  wellLevel: number
  fertilizerLevel: number
  growthSpeedMultiplier: number
  waterConsumptionRate: number
  rotSpeedMultiplier: number
  upgradeWaterBucket: () => boolean
  upgradeWell: () => boolean
  upgradeFertilizer: () => boolean
  // Funções de hack e configuração
  addCoins: (amount: number) => void
  addLevel: (amount: number) => void
  fillWater: () => void
  addSeeds: (seedType: string, amount: number) => void
  unlockAllAreas: () => void
  resetGame: () => void
  setGrowthSpeedMultiplier: (value: number) => void
  setWaterConsumptionRate: (value: number) => void
  setRotSpeedMultiplier: (value: number) => void
  // Sistema de impostos
  taxesPaid: number
  taxHistory: TaxRecord[]
  nextTaxCollection: number | null

  // Funções de impostos
  collectIncomeTax: () => number
  collectCapitalGainsTax: (improvementCost: number) => number
  collectSalesTax: (saleAmount: number) => number
  openTaxHistory: () => void
  t: (key: string) => string
}

// Criação do contexto
const GameContext = createContext<GameContextType | undefined>(undefined)

// Hook para usar o contexto
export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}

// Provedor do contexto
export function GameProvider({ children }: { children: ReactNode }) {
  // Tenta usar o hook useLanguage, mas fornece valores padrão caso não esteja disponível
  const languageContext = useContext(LanguageContext)
  const language = languageContext?.language || "pt-BR"
  const t = (key: string) => languageContext?.t(key) || key

  // Estado do jogador
  const [playerName, setPlayerName] = useState<string>("")

  // Inicializa a grade 4x4 com canteiros vazios
  const [plots, setPlots] = useState<(Plant | null)[][]>(
    Array(4)
      .fill(null)
      .map(() => Array(4).fill(null)),
  )

  // Dados iniciais
  const initialShopItems: ShopItem[] = Object.entries(plantConfigs).map(([plantType, config]) => ({
    id: `seed-${plantType}`,
    name: config.names[language],
    type: "seed",
    plantType: plantType as PlantType,
    price: config.seedPrice,
    icon: config.icon,
    description: `${t("growsIn")} ${config.growthTime}s. ${t("value")}: ${config.cropPrice} ${t("coins")}.`,
    requiredLevel:
      plantType === "carrot"
        ? 1
        : plantType === "corn"
          ? 2
          : plantType === "strawberry"
            ? 3
            : plantType === "tomato"
              ? 4
              : 5,
  }))

  const initialInventory: InventoryItem[] = [
    {
      id: "seed-carrot",
      name: plantConfigs.carrot.names[language],
      type: "seed",
      plantType: "carrot",
      quantity: 5,
      price: plantConfigs.carrot.seedPrice,
      icon: plantConfigs.carrot.icon,
      description: t("seedsToPlant"),
    },
  ]

  const initialTasks: Task[] = [
    {
      id: "task-1",
      description: `${t("plant")} 3 ${plantConfigs.carrot.names[language].toLowerCase()}`,
      target: 3,
      current: 0,
      reward: 50,
      type: "plant",
      plantType: "carrot",
      completed: false,
    },
    {
      id: "task-2",
      description: `${t("water")} ${t("plants")} 5 ${t("times")}`,
      target: 5,
      current: 0,
      reward: 30,
      type: "water",
      completed: false,
    },
    {
      id: "task-3",
      description: `${t("harvest")} 2 ${plantConfigs.carrot.names[language].toLowerCase()}`,
      target: 2,
      current: 0,
      reward: 70,
      type: "harvest",
      plantType: "carrot",
      completed: false,
    },
  ]

  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [shopItems, setShopItems] = useState<ShopItem[]>(initialShopItems)
  const [coins, setCoins] = useState(gameConfig.initialCoins)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  // Novos estados
  const [level, setLevel] = useState(1)
  const [experience, setExperience] = useState(0)
  const [experienceToNextLevel, setExperienceToNextLevel] = useState(gameConfig.experienceToNextLevel)
  const [siloCapacity, setSiloCapacity] = useState(gameConfig.initialSiloCapacity)
  const [siloUsed, setSiloUsed] = useState(0)
  const [siloUpgrading, setSiloUpgrading] = useState(false)
  const [siloUpgradeFinishTime, setSiloUpgradeFinishTime] = useState<number | null>(null)
  const [waterCapacity, setWaterCapacity] = useState(gameConfig.initialWaterCapacity)
  const [currentWater, setCurrentWater] = useState(gameConfig.initialWater)
  const [wellRefillTime, setWellRefillTime] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  // Novas funcionalidades
  const [unlockedAreas, setUnlockedAreas] = useState<string[]>([])
  const [waterBucketLevel, setWaterBucketLevel] = useState(0)
  const [wellLevel, setWellLevel] = useState(0)
  const [fertilizerLevel, setFertilizerLevel] = useState(0)
  const [growthSpeedMultiplier, setGrowthSpeedMultiplier] = useState(1)
  const [waterConsumptionRate, setWaterConsumptionRate] = useState(1)
  const [rotSpeedMultiplier, setRotSpeedMultiplier] = useState(1)

  // Estados de impostos
  const [taxesPaid, setTaxesPaid] = useState(0)
  const [taxHistory, setTaxHistory] = useState<TaxRecord[]>([])
  const [nextTaxCollection, setNextTaxCollection] = useState<number | null>(null)
  const [showTaxHistory, setShowTaxHistory] = useState(false)

  // Atualiza os itens da loja quando o idioma muda
  useEffect(() => {
    setShopItems(
      Object.entries(plantConfigs).map(([plantType, config]) => ({
        id: `seed-${plantType}`,
        name: config.names[language],
        type: "seed",
        plantType: plantType as PlantType,
        price: config.seedPrice,
        icon: config.icon,
        description: `${t("growsIn")} ${config.growthTime}s. ${t("value")}: ${config.cropPrice} ${t("coins")}.`,
        requiredLevel:
          plantType === "carrot"
            ? 1
            : plantType === "corn"
              ? 2
              : plantType === "strawberry"
                ? 3
                : plantType === "tomato"
                  ? 4
                  : 5,
      })),
    )
  }, [language])

  // Função para salvar o jogo
  const saveGame = () => {
    const gameState = {
      playerName,
      plots,
      inventory,
      coins,
      level,
      experience,
      experienceToNextLevel,
      siloCapacity,
      siloUsed,
      siloUpgrading,
      siloUpgradeFinishTime,
      waterCapacity,
      currentWater,
      wellRefillTime,
      tasks,
      unlockedAreas,
      waterBucketLevel,
      wellLevel,
      fertilizerLevel,
      growthSpeedMultiplier,
      waterConsumptionRate,
      rotSpeedMultiplier,
      taxesPaid,
      taxHistory,
      nextTaxCollection,
      lastSaved: Date.now(),
    }

    localStorage.setItem("fazendinha-state", JSON.stringify(gameState))
  }

  // Função para carregar o jogo
  const loadGame = () => {
    const savedState = localStorage.getItem("fazendinha-state")
    if (!savedState) return

    try {
      const gameState = JSON.parse(savedState)

      // Restaura os estados
      if (gameState.playerName) setPlayerName(gameState.playerName)
      if (gameState.plots) setPlots(gameState.plots)
      if (gameState.inventory) setInventory(gameState.inventory)
      if (gameState.coins) setCoins(gameState.coins)
      if (gameState.level) setLevel(gameState.level)
      if (gameState.experience) setExperience(gameState.experience)
      if (gameState.experienceToNextLevel) setExperienceToNextLevel(gameState.experienceToNextLevel)
      if (gameState.siloCapacity) setSiloCapacity(gameState.siloCapacity)
      if (gameState.siloUsed) setSiloUsed(gameState.siloUsed)
      if (gameState.siloUpgrading) setSiloUpgrading(gameState.siloUpgrading)
      if (gameState.siloUpgradeFinishTime) setSiloUpgradeFinishTime(gameState.siloUpgradeFinishTime)
      if (gameState.waterCapacity) setWaterCapacity(gameState.waterCapacity)
      if (gameState.currentWater) setCurrentWater(gameState.currentWater)
      if (gameState.wellRefillTime) setWellRefillTime(gameState.wellRefillTime)
      if (gameState.tasks) setTasks(gameState.tasks)
      if (gameState.unlockedAreas) setUnlockedAreas(gameState.unlockedAreas)
      if (gameState.waterBucketLevel !== undefined) setWaterBucketLevel(gameState.waterBucketLevel)
      if (gameState.wellLevel !== undefined) setWellLevel(gameState.wellLevel)
      if (gameState.fertilizerLevel !== undefined) setFertilizerLevel(gameState.fertilizerLevel)
      if (gameState.growthSpeedMultiplier) setGrowthSpeedMultiplier(gameState.growthSpeedMultiplier)
      if (gameState.waterConsumptionRate) setWaterConsumptionRate(gameState.waterConsumptionRate)
      if (gameState.rotSpeedMultiplier) setRotSpeedMultiplier(gameState.rotSpeedMultiplier)
      if (gameState.taxesPaid) setTaxesPaid(gameState.taxesPaid)
      if (gameState.taxHistory) setTaxHistory(gameState.taxHistory)
      if (gameState.nextTaxCollection) setNextTaxCollection(gameState.nextTaxCollection)
    } catch (error) {
      console.error("Erro ao carregar o jogo:", error)
    }
  }

  // Carrega o jogo ao iniciar
  useEffect(() => {
    if (playerName) {
      loadGame()
    }
  }, [playerName])

  // Salva o jogo automaticamente a cada 30 segundos
  useEffect(() => {
    if (!playerName) return

    const interval = setInterval(() => {
      saveGame()
    }, 30000)

    return () => clearInterval(interval)
  }, [playerName])

  // Função para adicionar experiência
  const addExperience = (amount: number) => {
    setExperience((prev) => {
      const newExp = prev + amount
      if (newExp >= experienceToNextLevel) {
        // Level up!
        setLevel((prevLevel) => prevLevel + 1)
        const remaining = newExp - experienceToNextLevel
        setExperienceToNextLevel((prevExpToNext) => Math.floor(prevExpToNext * gameConfig.experienceMultiplier))
        return remaining
      }
      return newExp
    })
  }

  // Função para atualizar tarefas
  const updateTask = (type: Task["type"], plantType?: PlantType) => {
    setTasks((prev) => {
      const newTasks = [...prev]

      // Encontra tarefas que correspondem ao tipo e planta (se aplicável)
      newTasks.forEach((task) => {
        if (task.completed) return

        if (task.type === type) {
          if (task.plantType && plantType) {
            // Se a tarefa especifica um tipo de planta, verifica se corresponde
            if (task.plantType === plantType) {
              task.current += 1
            }
          } else if (!task.plantType) {
            // Se a tarefa não especifica um tipo de planta, incrementa para qualquer planta
            task.current += 1
          }

          // Verifica se a tarefa foi concluída
          if (task.current >= task.target) {
            task.completed = true
            // Recompensa
            setCoins((prev) => prev + task.reward)
            addExperience(task.reward / 2)
          }
        }
      })

      return newTasks
    })
  }

  // Função para melhorar o armazenamento
  const upgradeStorage = () => {
    const cost = Math.floor(siloCapacity * gameConfig.siloUpgradeCostMultiplier)

    if (coins < cost) return false
    if (siloUpgrading) return false

    setCoins((prev) => prev - cost)
    setSiloUpgrading(true)

    // Calcula o tempo de construção com base no nível atual do silo
    const upgradeTime = Math.floor(siloCapacity / 10) * gameConfig.siloUpgradeTimePerCapacity * 1000 // Converte para milissegundos
    const finishTime = Date.now() + upgradeTime
    setSiloUpgradeFinishTime(finishTime)

    // Configura um timer para concluir a melhoria
    setTimeout(() => {
      setSiloCapacity((prev) => Math.floor(prev * gameConfig.siloCapacityMultiplier))
      setSiloUpgrading(false)
      setSiloUpgradeFinishTime(null)
      addExperience(20)
    }, upgradeTime)

    return true
  }

  // Função para reabastecer água
  const refillWater = () => {
    if (wellRefillTime && wellRefillTime > Date.now()) return false

    setCurrentWater(waterCapacity)

    // Configura o tempo de recarga do poço (reduzido pelo nível do poço)
    const refillTime =
      Date.now() + (gameConfig.wellRefillTime - wellLevel * gameConfig.upgrades.well.timeReduction) * 1000
    setWellRefillTime(refillTime)

    return true
  }

  // Função para desbloquear uma área
  const unlockArea = (area: string) => {
    if (unlockedAreas.includes(area)) return false

    const areaConfig = gameConfig.areas[area as keyof typeof gameConfig.areas]
    if (!areaConfig) return false

    if (level < areaConfig.requiredLevel) return false
    if (coins < areaConfig.unlockCost) return false

    // Calcula o imposto sobre ganhos de capital (se aplicável)
    const taxAmount =
      level >= gameConfig.taxes.capitalGainsTax.minLevel
        ? Math.floor(areaConfig.unlockCost * gameConfig.taxes.capitalGainsTax.rate)
        : 0

    // Deduz o custo total (preço + imposto)
    const totalCost = areaConfig.unlockCost + taxAmount
    setCoins((prev) => prev - totalCost)

    // Registra o imposto pago, se houver
    if (taxAmount > 0) {
      const taxRecord: TaxRecord = {
        id: `capital-gains-tax-${Date.now()}`,
        type: "capitalGains",
        amount: taxAmount,
        date: Date.now(),
      }

      setTaxHistory((prev) => [taxRecord, ...prev])
      setTaxesPaid((prev) => prev + taxAmount)
    }

    // Adiciona a área desbloqueada
    setUnlockedAreas((prev) => [...prev, area])

    // Expande a grade de plantação
    setPlots((prev) => {
      const newPlots = [...prev]
      const gridSize = areaConfig.gridSize

      // Adiciona novas linhas ou colunas dependendo da área
      if (area === "north") {
        // Adiciona linhas no topo
        const newRows = Array(gridSize)
          .fill(null)
          .map(() => Array(newPlots[0].length).fill(null))
        return [...newRows, ...newPlots]
      } else if (area === "south") {
        // Adiciona linhas na parte inferior
        const newRows = Array(gridSize)
          .fill(null)
          .map(() => Array(newPlots[0].length).fill(null))
        return [...newPlots, ...newRows]
      } else if (area === "east") {
        // Adiciona colunas à direita
        return newPlots.map((row) => [...row, ...Array(gridSize).fill(null)])
      } else if (area === "west") {
        // Adiciona colunas à esquerda
        return newPlots.map((row) => [...Array(gridSize).fill(null), ...row])
      }

      return newPlots
    })

    // Adiciona experiência
    addExperience(100)

    return true
  }

  // Função para melhorar o balde de água
  const upgradeWaterBucket = () => {
    if (waterBucketLevel >= gameConfig.upgrades.waterBucket.maxLevel) return false

    const cost = Math.floor(
      gameConfig.upgrades.waterBucket.baseCost *
        Math.pow(gameConfig.upgrades.waterBucket.costMultiplier, waterBucketLevel),
    )

    if (coins < cost) return false

    // Deduz o custo
    setCoins((prev) => prev - cost)

    // Coleta imposto sobre ganhos de capital
    collectCapitalGainsTax(cost)

    // Aumenta o nível do balde
    setWaterBucketLevel((prev) => prev + 1)

    // Aumenta a capacidade de água
    setWaterCapacity((prev) => prev + gameConfig.upgrades.waterBucket.capacityIncrease)

    // Adiciona experiência
    addExperience(30)

    return true
  }

  // Função para melhorar o poço
  const upgradeWell = () => {
    if (wellLevel >= gameConfig.upgrades.well.maxLevel) return false

    const cost = Math.floor(
      gameConfig.upgrades.well.baseCost * Math.pow(gameConfig.upgrades.well.costMultiplier, wellLevel),
    )

    if (coins < cost) return false

    // Deduz o custo
    setCoins((prev) => prev - cost)

    // Coleta imposto sobre ganhos de capital
    collectCapitalGainsTax(cost)

    // Aumenta o nível do poço
    setWellLevel((prev) => prev + 1)

    // Adiciona experiência
    addExperience(40)

    return true
  }

  // Função para melhorar o fertilizante
  const upgradeFertilizer = () => {
    if (fertilizerLevel >= gameConfig.upgrades.fertilizer.maxLevel) return false

    const cost = Math.floor(
      gameConfig.upgrades.fertilizer.baseCost *
        Math.pow(gameConfig.upgrades.fertilizer.costMultiplier, fertilizerLevel),
    )

    if (coins < cost) return false

    // Deduz o custo
    setCoins((prev) => prev - cost)

    // Coleta imposto sobre ganhos de capital
    collectCapitalGainsTax(cost)

    // Aumenta o nível do fertilizante
    setFertilizerLevel((prev) => prev + 1)

    // Aumenta o multiplicador de velocidade de crescimento
    setGrowthSpeedMultiplier((prev) => prev + gameConfig.upgrades.fertilizer.speedBoost)

    // Adiciona experiência
    addExperience(50)

    return true
  }

  // Função para plantar uma semente
  const plantSeed = (row: number, col: number, plantType: PlantType) => {
    // Verifica se o canteiro está vazio
    if (plots[row][col] !== null) return

    // Verifica se tem a semente no inventário
    const seedItem = inventory.find((item) => item.type === "seed" && item.plantType === plantType)
    if (!seedItem || seedItem.quantity <= 0) return

    // Atualiza o canteiro
    const config = plantConfigs[plantType]
    const now = Date.now()

    // Aplica o multiplicador de velocidade de crescimento do fertilizante
    const adjustedGrowthTime = (config.growthTime * 1000) / growthSpeedMultiplier

    const newPlots = [...plots]
    newPlots[row][col] = {
      type: plantType,
      state: "seeded",
      waterLevel: 0,
      growthStage: 0,
      maxGrowthStage: config.maxGrowthStage,
      growthTime: adjustedGrowthTime, // Tempo ajustado pelo fertilizante
      lastWatered: now,
      plantedAt: now,
      readyAt: null,
      needsWater: true,
      rotTimer: null,
      nextWaterStage: config.waterStages[0], // Primeiro estágio que precisa de água
    }
    setPlots(newPlots)

    // Remove a semente do inventário
    removeFromInventory(seedItem.id, 1)

    // Atualiza tarefas
    updateTask("plant", plantType)
    addExperience(gameConfig.experienceForPlanting)
  }

  // Função para regar um canteiro
  const waterPlot = (row: number, col: number) => {
    const plot = plots[row][col]
    if (!plot || plot.state === "ready" || plot.state === "rotten") return false

    // Verifica se tem água disponível
    if (currentWater <= 0) return false

    const now = Date.now()
    const newPlots = [...plots]

    // Limpa o timer de apodrecimento se existir
    if (plot.rotTimer) {
      clearTimeout(plot.rotTimer)
      plot.rotTimer = null
    }

    // Aumenta o nível de água da planta
    newPlots[row][col] = {
      ...plot,
      waterLevel: Math.min(plot.waterLevel + 1, plantConfigs[plot.type].waterNeeded),
      needsWater: false,
      lastWatered: now,
    }

    // Reduz a água disponível
    setCurrentWater((prev) => Math.max(0, prev - 1))

    // Se estiver na fase de semente e tiver água suficiente, avança para crescendo
    if (plot.state === "seeded" && newPlots[row][col].waterLevel >= 1) {
      newPlots[row][col].state = "growing"
      newPlots[row][col].growthStage = 1
    }

    // Atualiza o próximo estágio que precisa de água
    const currentProgress = ((now - plot.plantedAt) / plot.growthTime) * 100
    const nextWaterStages = plantConfigs[plot.type].waterStages.filter((stage) => stage > currentProgress)
    newPlots[row][col].nextWaterStage = nextWaterStages.length > 0 ? nextWaterStages[0] : null

    setPlots(newPlots)

    // Atualiza tarefas
    updateTask("water", plot.type)
    addExperience(gameConfig.experienceForWatering)

    return true
  }

  // Função para colher um canteiro
  const harvestPlot = (row: number, col: number) => {
    const plot = plots[row][col]
    if (!plot || (plot.state !== "ready" && plot.state !== "rotten")) return false

    // Se a planta estiver podre, apenas limpa o canteiro
    if (plot.state === "rotten") {
      const newPlots = [...plots]
      if (plot.rotTimer) {
        clearTimeout(plot.rotTimer)
      }
      newPlots[row][col] = null
      setPlots(newPlots)
      return true
    }

    // Verifica se há espaço no silo
    if (siloUsed >= siloCapacity) {
      return false
    }

    // Adiciona o item colhido ao inventário
    const config = plantConfigs[plot.type]
    const cropId = `crop-${plot.type}`

    const success = addToInventory(
      {
        id: cropId,
        name: config.names[language],
        type: "crop",
        plantType: plot.type,
        price: config.cropPrice,
        icon: config.icon,
        description: config.descriptions[language],
      },
      1,
    )

    if (!success) return false

    // Limpa o canteiro
    const newPlots = [...plots]
    if (plot.rotTimer) {
      clearTimeout(plot.rotTimer)
    }
    newPlots[row][col] = null
    setPlots(newPlots)

    // Atualiza tarefas
    updateTask("harvest", plot.type)
    addExperience(gameConfig.experienceForHarvesting)

    return true
  }

  // Função para coletar imposto de renda
  const collectIncomeTax = () => {
    if (level < gameConfig.taxes.incomeTax.minLevel) return 0

    const taxRate = gameConfig.taxes.incomeTax.rate
    const taxableIncome = Math.floor(coins * 0.2) // Taxa sobre 20% das moedas atuais
    const taxAmount = Math.floor(taxableIncome * taxRate)

    if (taxAmount <= 0) return 0

    // Deduz o imposto
    setCoins((prev) => prev - taxAmount)

    // Registra o imposto pago
    const taxRecord: TaxRecord = {
      id: `income-tax-${Date.now()}`,
      type: "income",
      amount: taxAmount,
      date: Date.now(),
    }

    setTaxHistory((prev) => [taxRecord, ...prev])
    setTaxesPaid((prev) => prev + taxAmount)

    // Agenda a próxima coleta
    const nextCollection = Date.now() + gameConfig.taxes.incomeTax.interval * 1000
    setNextTaxCollection(nextCollection)

    return taxAmount
  }

  // Função para coletar imposto sobre ganhos de capital
  const collectCapitalGainsTax = (improvementCost: number) => {
    if (level < gameConfig.taxes.capitalGainsTax.minLevel) return 0

    const taxRate = gameConfig.taxes.capitalGainsTax.rate
    const taxAmount = Math.floor(improvementCost * taxRate)

    if (taxAmount <= 0) return 0

    // Deduz o imposto
    setCoins((prev) => prev - taxAmount)

    // Registra o imposto pago
    const taxRecord: TaxRecord = {
      id: `capital-gains-tax-${Date.now()}`,
      type: "capitalGains",
      amount: taxAmount,
      date: Date.now(),
    }

    setTaxHistory((prev) => [taxRecord, ...prev])
    setTaxesPaid((prev) => prev + taxAmount)

    return taxAmount
  }

  // Função para coletar imposto sobre vendas
  const collectSalesTax = (saleAmount: number) => {
    if (level < gameConfig.taxes.salesTax.minLevel) return 0

    const taxRate = gameConfig.taxes.salesTax.rate
    const taxAmount = Math.floor(saleAmount * taxRate)

    if (taxAmount <= 0) return 0

    // Deduz o imposto
    setCoins((prev) => prev - taxAmount)

    // Registra o imposto pago
    const taxRecord: TaxRecord = {
      id: `sales-tax-${Date.now()}`,
      type: "sales",
      amount: taxAmount,
      date: Date.now(),
    }

    setTaxHistory((prev) => [taxRecord, ...prev])
    setTaxesPaid((prev) => prev + taxAmount)

    return taxAmount
  }

  // Função para abrir o histórico de impostos
  const openTaxHistory = () => {
    setShowTaxHistory(true)
  }

  // Função para vender colheitas
  const sellCrop = (itemId: string, quantity: number) => {
    const item = inventory.find((i) => i.id === itemId && i.type === "crop")
    if (!item || item.quantity < quantity) return

    // Calcula o valor total
    const totalValue = item.price * quantity

    // Adiciona moedas
    setCoins((prev) => prev + totalValue)

    // Remove do inventário
    removeFromInventory(itemId, quantity)

    // Atualiza o espaço usado no silo
    setSiloUsed((prev) => Math.max(0, prev - quantity))

    // Adiciona experiência
    addExperience(quantity * gameConfig.experienceForSelling)

    // Coleta imposto sobre vendas
    collectSalesTax(totalValue)
  }

  // Função para comprar sementes
  const buySeed = (item: ShopItem) => {
    if (coins < item.price) return false
    if (level < item.requiredLevel) return false

    // Deduz o custo
    setCoins((prev) => prev - item.price)

    // Adiciona ao inventário
    addToInventory(
      {
        id: item.id,
        name: item.name,
        type: "seed",
        plantType: item.plantType,
        price: item.price,
        icon: item.icon,
        description: item.description,
      },
      1,
    )

    return true
  }

  // Função para adicionar itens ao inventário
  const addToInventory = (item: Partial<InventoryItem>, quantity: number): boolean => {
    // Se for uma colheita, verifica o espaço no silo
    if (item.type === "crop") {
      if (siloUsed + quantity > siloCapacity) {
        return false
      }

      // Atualiza o espaço usado no silo
      setSiloUsed((prev) => prev + quantity)
    }

    setInventory((prev) => {
      // Verifica se o item já existe no inventário
      const existingItem = prev.find((i) => i.id === item.id)

      if (existingItem) {
        // Atualiza a quantidade do item existente
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
      } else {
        // Adiciona o novo item ao inventário
        return [
          ...prev,
          {
            id: item.id!,
            name: item.name!,
            type: item.type!,
            plantType: item.plantType,
            quantity,
            price: item.price!,
            icon: item.icon!,
            description: item.description!,
          },
        ]
      }
    })

    return true
  }

  // Função para remover itens do inventário
  const removeFromInventory = (itemId: string, quantity: number) => {
    setInventory((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = Math.max(0, item.quantity - quantity)
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0) // Remove itens com quantidade zero
    })
  }

  // Funções de hack e configuração
  const addCoins = (amount: number) => {
    setCoins((prev) => prev + amount)
  }

  const addLevel = (amount: number) => {
    setLevel((prev) => prev + amount)
    setExperienceToNextLevel((prev) => Math.floor(prev * Math.pow(gameConfig.experienceMultiplier, amount)))
  }

  const fillWater = () => {
    setCurrentWater(waterCapacity)
  }

  const addSeeds = (seedType: string, amount: number) => {
    if (!plantConfigs[seedType as PlantType]) return

    const config = plantConfigs[seedType as PlantType]
    const seedId = `seed-${seedType}`

    addToInventory(
      {
        id: seedId,
        name: config.names[language],
        type: "seed",
        plantType: seedType as PlantType,
        price: config.seedPrice,
        icon: config.icon,
        description: t("seedsToPlant"),
      },
      amount,
    )
  }

  const unlockAllAreas = () => {
    const areas = Object.keys(gameConfig.areas)
    const newUnlockedAreas = [...unlockedAreas]

    areas.forEach((area) => {
      if (!unlockedAreas.includes(area)) {
        newUnlockedAreas.push(area)
      }
    })

    setUnlockedAreas(newUnlockedAreas)
  }

  const resetGame = () => {
    // Limpa todos os dados do jogo
    setPlots(
      Array(4)
        .fill(null)
        .map(() => Array(4).fill(null)),
    )
    setInventory(initialInventory)
    setCoins(gameConfig.initialCoins)
    setLevel(1)
    setExperience(0)
    setExperienceToNextLevel(gameConfig.experienceToNextLevel)
    setSiloCapacity(gameConfig.initialSiloCapacity)
    setSiloUsed(0)
    setSiloUpgrading(false)
    setSiloUpgradeFinishTime(null)
    setWaterCapacity(gameConfig.initialWaterCapacity)
    setCurrentWater(gameConfig.initialWater)
    setWellRefillTime(null)
    setTasks(initialTasks)
    setUnlockedAreas([])
    setWaterBucketLevel(0)
    setWellLevel(0)
    setFertilizerLevel(0)
    setGrowthSpeedMultiplier(1)
    setWaterConsumptionRate(1)
    setRotSpeedMultiplier(1)
    setTaxesPaid(0)
    setTaxHistory([])
    setNextTaxCollection(null)

    // Limpa o localStorage
    localStorage.removeItem("fazendinha-state")
  }

  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        plots,
        inventory,
        shopItems,
        coins,
        level,
        experience,
        experienceToNextLevel,
        siloCapacity,
        siloUsed,
        siloUpgrading,
        siloUpgradeFinishTime,
        waterCapacity,
        currentWater,
        wellRefillTime,
        tasks,
        selectedAction,
        setSelectedAction,
        plantSeed,
        waterPlot,
        harvestPlot,
        buySeed,
        sellCrop,
        addToInventory,
        removeFromInventory,
        updateTask,
        upgradeStorage,
        refillWater,
        saveGame,
        loadGame,
        // Novas funcionalidades
        unlockedAreas,
        unlockArea,
        waterBucketLevel,
        wellLevel,
        fertilizerLevel,
        growthSpeedMultiplier,
        waterConsumptionRate,
        rotSpeedMultiplier,
        upgradeWaterBucket,
        upgradeWell,
        upgradeFertilizer,
        // Funções de hack e configuração
        addCoins,
        addLevel,
        fillWater,
        addSeeds,
        unlockAllAreas,
        resetGame,
        setGrowthSpeedMultiplier,
        setWaterConsumptionRate,
        setRotSpeedMultiplier,
        // Sistema de impostos
        taxesPaid,
        taxHistory,
        nextTaxCollection,
        collectIncomeTax,
        collectCapitalGainsTax,
        collectSalesTax,
        openTaxHistory,
        t,
      }}
    >
      {children}
      {showTaxHistory && <TaxHistoryModal open={showTaxHistory} onClose={() => setShowTaxHistory(false)} />}
    </GameContext.Provider>
  )
}

export { GameContext }

