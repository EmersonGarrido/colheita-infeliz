import type { PlantType } from "@/components/game-context"

// Tipos de idiomas suportados
export type Language = "pt-BR" | "en"

// Interface para configurações de plantas
export interface PlantConfig {
  growthTime: number // Tempo total para crescer em segundos
  maxGrowthStage: number // Número de estágios de crescimento
  seedPrice: number // Preço da semente
  cropPrice: number // Preço da colheita
  waterNeeded: number // Quantidade de água necessária para crescer completamente
  waterStages: number[] // Pontos de parada que requerem rega (porcentagem do crescimento)
  rotTime: number // Tempo em segundos sem água para apodrecer
  rotAfterReadyTime: number // Tempo em segundos após ficar pronta para apodrecer
  icon: string // Emoji da planta
  names: Record<Language, string> // Nome da planta em diferentes idiomas
  descriptions: Record<Language, string> // Descrição da planta em diferentes idiomas
}

// Configurações das plantas
export const plantConfigs: Record<PlantType, PlantConfig> = {
  carrot: {
    growthTime: 30, // 30 segundos para crescer completamente
    maxGrowthStage: 3,
    seedPrice: 10,
    cropPrice: 25,
    waterNeeded: 2, // Precisa ser regada 2 vezes
    waterStages: [50], // Precisa ser regada quando atingir 50% do crescimento
    rotTime: 60, // 60 segundos sem água para apodrecer (aumentado para dar mais tempo)
    rotAfterReadyTime: 120, // 120 segundos após ficar pronta para apodrecer
    icon: "🥕",
    names: {
      "pt-BR": "Cenoura",
      en: "Carrot",
    },
    descriptions: {
      "pt-BR": "Uma cenoura fresca e saudável.",
      en: "A fresh and healthy carrot.",
    },
  },
  corn: {
    growthTime: 45, // 45 segundos
    maxGrowthStage: 4,
    seedPrice: 15,
    cropPrice: 40,
    waterNeeded: 3,
    waterStages: [30, 60], // Precisa ser regada em 30% e 60% do crescimento
    rotTime: 80,
    rotAfterReadyTime: 150,
    icon: "🌽",
    names: {
      "pt-BR": "Milho",
      en: "Corn",
    },
    descriptions: {
      "pt-BR": "Uma espiga de milho dourada.",
      en: "A golden ear of corn.",
    },
  },
  strawberry: {
    growthTime: 60, // 60 segundos
    maxGrowthStage: 5,
    seedPrice: 20,
    cropPrice: 60,
    waterNeeded: 3,
    waterStages: [25, 50, 75], // Precisa ser regada em 25%, 50% e 75% do crescimento
    rotTime: 90,
    rotAfterReadyTime: 180,
    icon: "🍓",
    names: {
      "pt-BR": "Morango",
      en: "Strawberry",
    },
    descriptions: {
      "pt-BR": "Um morango vermelho e suculento.",
      en: "A red and juicy strawberry.",
    },
  },
  tomato: {
    growthTime: 75, // 75 segundos
    maxGrowthStage: 5,
    seedPrice: 25,
    cropPrice: 80,
    waterNeeded: 4,
    waterStages: [20, 40, 60, 80], // Precisa ser regada em 20%, 40%, 60% e 80% do crescimento
    rotTime: 100,
    rotAfterReadyTime: 210,
    icon: "🍅",
    names: {
      "pt-BR": "Tomate",
      en: "Tomato",
    },
    descriptions: {
      "pt-BR": "Um tomate vermelho e maduro.",
      en: "A red and ripe tomato.",
    },
  },
  potato: {
    growthTime: 90, // 90 segundos
    maxGrowthStage: 6,
    seedPrice: 30,
    cropPrice: 100,
    waterNeeded: 5,
    waterStages: [20, 40, 60, 80], // Precisa ser regada em 20%, 40%, 60% e 80% do crescimento
    rotTime: 120,
    rotAfterReadyTime: 240,
    icon: "🥔",
    names: {
      "pt-BR": "Batata",
      en: "Potato",
    },
    descriptions: {
      "pt-BR": "Uma batata fresca da terra.",
      en: "A fresh potato from the ground.",
    },
  },
}

// Configurações do jogo
export const gameConfig = {
  // Configurações iniciais
  initialCoins: 100,
  initialWater: 16, // Aumentado para 16
  initialWaterCapacity: 16, // Aumentado para 16
  initialSiloCapacity: 20,

  // Configurações de nível
  experienceToNextLevel: 100,
  experienceMultiplier: 1.5, // Multiplicador para o próximo nível

  // Configurações de água
  wellRefillTime: 60, // Tempo em segundos para o poço reabastecer
  wellRefillAmount: 16, // Quantidade de água reabastecida de uma vez

  // Configurações de upgrades
  upgrades: {
    waterBucket: {
      baseCost: 50,
      costMultiplier: 1.5,
      capacityIncrease: 5,
      maxLevel: 5,
    },
    well: {
      baseCost: 100,
      costMultiplier: 1.8,
      timeReduction: 10, // Redução em segundos
      maxLevel: 3,
    },
    fertilizer: {
      baseCost: 150,
      costMultiplier: 2,
      speedBoost: 0.2, // 20% mais rápido por nível
      maxLevel: 3,
    },
  },

  // Configurações do silo
  siloUpgradeCostMultiplier: 5, // Custo para melhorar o silo = capacidade atual * multiplicador
  siloUpgradeTimePerCapacity: 3, // Segundos de tempo de melhoria por unidade de capacidade
  siloCapacityMultiplier: 1.5, // Multiplicador da capacidade após a melhoria

  // Configurações de experiência
  experienceForPlanting: 5,
  experienceForWatering: 2,
  experienceForHarvesting: 10,
  experienceForSelling: 5, // Por item vendido

  // Configurações de áreas desbloqueáveis
  areas: {
    north: {
      requiredLevel: 5,
      unlockCost: 300,
      gridSize: 3, // 3 canteiros adicionais
      names: {
        "pt-BR": "Área Norte",
        en: "North Area",
      },
    },
    south: {
      requiredLevel: 10,
      unlockCost: 600,
      gridSize: 3,
      names: {
        "pt-BR": "Área Sul",
        en: "South Area",
      },
    },
    east: {
      requiredLevel: 15,
      unlockCost: 900,
      gridSize: 3,
      names: {
        "pt-BR": "Área Leste",
        en: "East Area",
      },
    },
    west: {
      requiredLevel: 20,
      unlockCost: 1200,
      gridSize: 3,
      names: {
        "pt-BR": "Área Oeste",
        en: "West Area",
      },
    },
  },

  // Configurações de impostos
  taxes: {
    incomeTax: {
      rate: 0.15, // 15% de imposto de renda
      interval: 300, // Cobrado a cada 5 minutos (300 segundos)
      minLevel: 2, // Começa a ser cobrado a partir do nível 2
    },
    capitalGainsTax: {
      rate: 0.2, // 20% de imposto sobre ganhos de capital (melhorias)
      minLevel: 3, // Começa a ser cobrado a partir do nível 3
    },
    salesTax: {
      rate: 0.1, // 10% de imposto sobre vendas
      minLevel: 1, // Começa a ser cobrado desde o início
    },
    seedTax: {
      baseRate: 0.01, // 1% de imposto base sobre compra de sementes
      ratePerLevel: 0.01, // Aumenta 1% por nível
      maxRate: 0.05, // Máximo de 5% de imposto
      minLevel: 1, // Começa a ser cobrado desde o início
    },
  },
}

// Traduções do jogo
export const translations = {
  "pt-BR": {
    // Geral
    gameName: "Fazendinha Feliz",
    farmer: "Fazendeiro",
    level: "Nível",
    coins: "moedas",
    save: "Salvar",
    load: "Carregar",

    // Ações
    plant: "Plantar",
    water: "Regar",
    harvest: "Colher",
    sell: "Vender",
    buy: "Comprar",
    upgrade: "Melhorar",

    // Estados das plantas
    seed: "Semente",
    seeded: "Semeado",
    growing: "Crescendo",
    ready: "Pronto para colher",
    rotten: "Podre",
    state: "Estado",
    progress: "Progresso",
    timeRemaining: "Tempo restante",

    // Notificações
    needsWater: "Precisa de água!",
    readyToHarvest: "Pronto para colher!",
    plantRotted: "A planta apodreceu!",
    clickToHarvest: "Clique para colher!",
    clickToRemove: "Clique para remover!",
    clickToLocate: "Clique para localizar",
    emptyPlot: "Canteiro vazio",
    plotOccupied: "Canteiro ocupado",
    plotHasPlant: "Este canteiro já tem uma planta",
    youPlanted: "Você plantou",
    seedPlanted: "Semente plantada com sucesso",
    plantWatered: "Planta regada com sucesso",
    youHarvested: "Você colheu a planta com sucesso",
    plantNotReady: "Esta planta ainda não está pronta para colheita",
    yourPlant: "Sua planta",

    // Inventário
    inventory: "Inventário",
    seeds: "Sementes",
    crops: "Colheitas",
    emptyInventory: "Seu inventário está vazio.",
    emptySilo: "Seu silo está vazio.",
    seedsToPlant: "Sementes para plantar",
    chooseSeed: "Escolha uma semente",
    growsIn: "Cresce em",
    value: "Valor",

    // Loja
    shop: "Loja",
    seedShop: "Loja de Sementes",
    buySeeds: "Comprar Sementes",
    notEnoughCoins: "Moedas insuficientes",
    notEnoughLevel: "Nível insuficiente",
    purchaseSuccessful: "Compra realizada!",
    youBought: "Você comprou",

    // Áreas
    unlockArea: "Desbloquear Área",
    unlockAreaConfirm: "Deseja desbloquear a {area}?",
    areaUnlocked: "Área desbloqueada!",
    areaAlreadyUnlocked: "Esta área já está desbloqueada",
    enjoyNewArea: "Aproveite sua nova área de plantio!",
    levelTooLow: "Nível insuficiente",
    needLevel: "Você precisa ser nível {level} para desbloquear esta área",
    needCoins: "Você precisa de {coins} moedas para desbloquear esta área",
    cost: "Custo",
    requiredLevel: "Nível necessário",
    plotsAdded: "Canteiros adicionados",
    unlock: "Desbloquear",
    cancel: "Cancelar",

    // Upgrades
    upgradeShop: "Loja de Melhorias",
    upgradeWaterBucket: "Melhorar Balde de Água",
    upgradeWell: "Melhorar Poço",
    upgradeFertilizer: "Comprar Fertilizante",
    currentLevel: "Nível atual",
    maxLevel: "Nível máximo",
    upgradeEffect: "Efeito da melhoria",
    bucketCapacity: "Capacidade do balde",
    wellRefillTime: "Tempo de recarga do poço",
    growthSpeed: "Velocidade de crescimento",
    upgradeSuccess: "Melhoria realizada!",
    maxLevelReached: "Nível máximo atingido",
    bucketUpgraded: "Balde de água melhorado!",
    wellUpgraded: "Poço melhorado!",
    fertilizerUpgraded: "Fertilizante melhorado!",
    bucketMaxLevel: "Seu balde já está no nível máximo",
    wellMaxLevel: "Seu poço já está no nível máximo",
    fertilizerMaxLevel: "Seu fertilizante já está no nível máximo",

    // Silo
    silo: "Silo",
    siloCapacity: "Capacidade do Silo",
    siloUpgrade: "Melhorar Silo",
    siloUpgrading: "Melhorando",
    siloUpgraded: "Silo melhorado!",
    siloFull: "Silo cheio!",
    upgradeCost: "Custo para melhorar",
    sellCropsFirst: "Venda algumas colheitas primeiro",

    // Água
    water: "Água",
    refillWater: "Reabastecer Balde",
    refilling: "Reabastecendo",
    bucketFull: "Balde cheio",
    noWater: "Sem água!",
    refillBucket: "Reabasteça no poço",

    // Mensagens de sucesso
    planted: "Plantado!",
    watered: "Regado!",
    harvested: "Colhido!",
    removed: "Removido!",
    sold: "Vendido!",

    // Mensagens de erro
    noSeeds: "Sem sementes",
    visitShop: "Visite a loja!",
    notReady: "Não está pronto",

    // Progresso
    progress: "Progresso",
    tasks: "Tarefas",
    currentTasks: "Tarefas Atuais",
    completed: "Concluído",
    reward: "Recompensa",
    unlocks: "Desbloqueios",
    nextLevel: "Próximo nível",
    plants: "plantas",
    times: "vezes",

    // Bem-vindo
    welcome: "Bem-vindo à Fazendinha Feliz!",
    enterName: "Como devemos chamar você, fazendeiro?",
    startPlaying: "Começar a Jogar",
    yourName: "Seu nome",
    nameTooShort: "Nome muito curto",
    nameMinLength: "Por favor, digite um nome com pelo menos 2 caracteres.",
    adventureBegins: "Sua aventura na fazenda começa agora.",

    // Configurações e Hacks
    settings: "Configurações",
    gameSettings: "Configurações do Jogo",
    hackMode: "Modo Hack",
    addCoins: "Adicionar Moedas",
    addLevel: "Aumentar Nível",
    addWater: "Encher Água",
    addSeeds: "Adicionar Sementes",
    unlockAllAreas: "Desbloquear Todas Áreas",
    resetGame: "Resetar Jogo",
    confirmReset: "Tem certeza que deseja resetar o jogo?",
    gameReset: "Jogo resetado com sucesso!",
    resourceAdded: "Recurso adicionado com sucesso!",
    amount: "Quantidade",
    add: "Adicionar",
    close: "Fechar",
    apply: "Aplicar",
    gameSpeed: "Velocidade do Jogo",
    normal: "Normal",
    fast: "Rápido",
    superFast: "Super Rápido",
    plantGrowthSpeed: "Velocidade de Crescimento",
    waterConsumption: "Consumo de Água",
    rotSpeed: "Velocidade de Apodrecimento",
    slower: "Mais Lento",
    faster: "Mais Rápido",
    areaEast: "Área Leste",
    areaWest: "Área Oeste",
    cannotUnlockYet: "Não é possível desbloquear ainda",
    unlockAdjacentFirst: "Desbloqueie as áreas adjacentes primeiro",
    unlockAll: "Desbloquear Tudo",
    areasUnlocked: "Áreas desbloqueadas",
    allAreasUnlocked: "Todas as áreas foram desbloqueadas",
    settingsApplied: "Configurações aplicadas",
    settingsAppliedDescription: "As configurações do jogo foram aplicadas com sucesso",
    currentCoins: "Moedas atuais",
    currentLevel: "Nível atual",
    currentWater: "Água atual",
    fillWater: "Encher Balde",
    waterFilled: "Water bucket filled",
    invalidAmount: "Quantidade inválida",
    enterPositiveNumber: "Digite um número positivo",
    added: "adicionado(s)",
    reset: "Resetar",
    gameResetDescription: "Todos os dados do jogo foram resetados",
    areaNorth: "Área Norte",
    areaSouth: "Área Sul",
    areaEast: "Área Leste",
    areaWest: "Área Oeste",

    // Impostos
    taxes: "Impostos",
    incomeTax: "Imposto de Renda",
    capitalGainsTax: "Imposto sobre Ganhos de Capital",
    salesTax: "Imposto sobre Vendas",
    taxHistory: "Histórico de Impostos",
    taxesPaid: "Impostos Pagos",
    taxRate: "Alíquota",
    taxAmount: "Valor",
    taxDate: "Data",
    taxType: "Tipo de Imposto",
    taxesCollected: "Impostos Coletados!",
    governmentCollected: "O governo coletou {amount} moedas em impostos.",
    taxMeter: "Impostrômetro",
    totalTaxesPaid: "Total de impostos pagos",
    nextTaxCollection: "Próxima coleta de impostos em",
    viewTaxHistory: "Ver histórico de impostos",
  },
  en: {
    // General
    gameName: "Happy Farm",
    farmer: "Farmer",
    level: "Level",
    coins: "coins",
    save: "Save",
    load: "Load",

    // Actions
    plant: "Plant",
    water: "Water",
    harvest: "Harvest",
    sell: "Sell",
    buy: "Buy",
    upgrade: "Upgrade",

    // Plant states
    seed: "Seed",
    seeded: "Seeded",
    growing: "Growing",
    ready: "Ready to harvest",
    rotten: "Rotten",
    state: "State",
    progress: "Progress",
    timeRemaining: "Time remaining",

    // Notifications
    needsWater: "Needs water!",
    readyToHarvest: "Ready to harvest!",
    plantRotted: "The plant has rotted!",
    clickToHarvest: "Click to harvest!",
    clickToRemove: "Click to remove!",
    clickToLocate: "Click to locate",
    emptyPlot: "Empty plot",
    plotOccupied: "Plot occupied",
    plotHasPlant: "This plot already has a plant",
    youPlanted: "You planted",
    seedPlanted: "Seed planted successfully",
    plantWatered: "Plant watered successfully",
    youHarvested: "You harvested the plant successfully",
    plantNotReady: "This plant is not ready for harvest yet",
    yourPlant: "Your plant",

    // Inventory
    inventory: "Inventory",
    seeds: "Seeds",
    crops: "Crops",
    emptyInventory: "Your inventory is empty.",
    emptySilo: "Your silo is empty.",
    seedsToPlant: "Seeds to plant",
    chooseSeed: "Choose a seed",
    growsIn: "Grows in",
    value: "Value",

    // Shop
    shop: "Shop",
    seedShop: "Seed Shop",
    buySeeds: "Buy Seeds",
    notEnoughCoins: "Not enough coins",
    notEnoughLevel: "Not enough level",
    purchaseSuccessful: "Purchase successful!",
    youBought: "You bought",

    // Areas
    unlockArea: "Unlock Area",
    unlockAreaConfirm: "Do you want to unlock the {area}?",
    areaUnlocked: "Area unlocked!",
    areaAlreadyUnlocked: "This area is already unlocked",
    enjoyNewArea: "Enjoy your new planting area!",
    levelTooLow: "Level too low",
    needLevel: "You need to be level {level} to unlock this area",
    needCoins: "You need {coins} coins to unlock this area",
    cost: "Cost",
    requiredLevel: "Required level",
    plotsAdded: "Plots added",
    unlock: "Unlock",
    cancel: "Cancel",

    // Upgrades
    upgradeShop: "Upgrade Shop",
    upgradeWaterBucket: "Upgrade Water Bucket",
    upgradeWell: "Upgrade Well",
    upgradeFertilizer: "Buy Fertilizer",
    currentLevel: "Current level",
    maxLevel: "Max level",
    upgradeEffect: "Upgrade effect",
    bucketCapacity: "Bucket capacity",
    wellRefillTime: "Well refill time",
    growthSpeed: "Growth speed",
    upgradeSuccess: "Upgrade successful!",
    maxLevelReached: "Max level reached",
    bucketUpgraded: "Water bucket upgraded!",
    wellUpgraded: "Well upgraded!",
    fertilizerUpgraded: "Fertilizer upgraded!",
    bucketMaxLevel: "Your bucket is already at max level",
    wellMaxLevel: "Your well is already at max level",
    fertilizerMaxLevel: "Your fertilizer is already at max level",

    // Silo
    silo: "Silo",
    siloCapacity: "Silo Capacity",
    siloUpgrade: "Upgrade Silo",
    siloUpgrading: "Upgrading",
    siloUpgraded: "Silo upgraded!",
    siloFull: "Silo full!",
    upgradeCost: "Upgrade cost",
    sellCropsFirst: "Sell some crops first",

    // Water
    water: "Water",
    refillWater: "Refill Bucket",
    refilling: "Refilling",
    bucketFull: "Bucket full",
    noWater: "No water!",
    refillBucket: "Refill at the well",

    // Success messages
    planted: "Planted!",
    watered: "Watered!",
    harvested: "Harvested!",
    removed: "Removed!",
    sold: "Sold!",

    // Error messages
    noSeeds: "No seeds",
    visitShop: "Visit the shop!",
    notReady: "Not ready",

    // Progress
    progress: "Progress",
    tasks: "Tasks",
    currentTasks: "Current Tasks",
    completed: "Completed",
    reward: "Reward",
    unlocks: "Unlocks",
    nextLevel: "Next level",
    plants: "plants",
    times: "times",

    // Welcome
    welcome: "Welcome to Happy Farm!",
    enterName: "What should we call you, farmer?",
    startPlaying: "Start Playing",
    yourName: "Your name",
    nameTooShort: "Name too short",
    nameMinLength: "Please enter a name with at least 2 characters.",
    adventureBegins: "Your farm adventure begins now.",

    // Settings and Hacks
    settings: "Settings",
    gameSettings: "Game Settings",
    hackMode: "Hack Mode",
    addCoins: "Add Coins",
    addLevel: "Increase Level",
    addWater: "Fill Water",
    addSeeds: "Add Seeds",
    unlockAllAreas: "Unlock All Areas",
    resetGame: "Reset Game",
    confirmReset: "Are you sure you want to reset the game?",
    gameReset: "Game reset successfully!",
    resourceAdded: "Resource added successfully!",
    amount: "Amount",
    add: "Add",
    close: "Close",
    apply: "Apply",
    gameSpeed: "Game Speed",
    normal: "Normal",
    fast: "Fast",
    superFast: "Super Fast",
    plantGrowthSpeed: "Plant Growth Speed",
    waterConsumption: "Water Consumption",
    rotSpeed: "Rot Speed",
    slower: "Slower",
    faster: "Faster",
    areaEast: "East Area",
    areaWest: "West Area",
    cannotUnlockYet: "Cannot unlock yet",
    unlockAdjacentFirst: "Unlock adjacent areas first",
    unlockAll: "Unlock All",
    areasUnlocked: "Areas unlocked",
    allAreasUnlocked: "All areas have been unlocked",
    settingsApplied: "Settings applied",
    settingsAppliedDescription: "Game settings have been applied successfully",
    currentCoins: "Current coins",
    currentLevel: "Current level",
    currentWater: "Current water",
    fillWater: "Fill Bucket",
    waterFilled: "Water bucket filled",
    invalidAmount: "Invalid amount",
    enterPositiveNumber: "Enter a positive number",
    added: "added",
    reset: "Reset",
    gameResetDescription: "All game data has been reset",
    areaNorth: "North Area",
    areaSouth: "South Area",
    areaEast: "East Area",
    areaWest: "West Area",

    // Taxes
    taxes: "Taxes",
    incomeTax: "Income Tax",
    capitalGainsTax: "Capital Gains Tax",
    salesTax: "Sales Tax",
    taxHistory: "Tax History",
    taxesPaid: "Taxes Paid",
    taxRate: "Tax Rate",
    taxAmount: "Amount",
    taxDate: "Date",
    taxType: "Tax Type",
    taxesCollected: "Taxes Collected!",
    governmentCollected: "The government collected {amount} coins in taxes.",
    taxMeter: "Tax Meter",
    totalTaxesPaid: "Total taxes paid",
    nextTaxCollection: "Next tax collection in",
    viewTaxHistory: "View tax history",
  },
}

// Função para obter tradução
export function getTranslation(key: string, language: Language): string {
  return translations[language][key] || key
}

// Função para obter nome da planta
export function getPlantName(plantType: PlantType, language: Language): string {
  return plantConfigs[plantType].names[language]
}

// Função para obter descrição da planta
export function getPlantDescription(plantType: PlantType, language: Language): string {
  return plantConfigs[plantType].descriptions[language]
}

