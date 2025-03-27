// Definições de sprites para plantas
export const PLANT_SPRITES = {
  // Posições X, Y, largura e altura dos sprites na imagem plants.png
  carrot: {
    seed: { x: 0, y: 48, width: 16, height: 16 },
    growing1: { x: 16, y: 48, width: 16, height: 16 },
    growing2: { x: 32, y: 48, width: 16, height: 16 },
    ready: { x: 48, y: 48, width: 16, height: 16 },
  },
  corn: {
    seed: { x: 0, y: 64, width: 16, height: 16 },
    growing1: { x: 16, y: 64, width: 16, height: 16 },
    growing2: { x: 32, y: 64, width: 16, height: 16 },
    ready: { x: 48, y: 64, width: 16, height: 16 },
  },
  strawberry: {
    seed: { x: 0, y: 32, width: 16, height: 16 },
    growing1: { x: 16, y: 32, width: 16, height: 16 },
    growing2: { x: 32, y: 32, width: 16, height: 16 },
    ready: { x: 48, y: 32, width: 16, height: 16 },
  },
  tomato: {
    seed: { x: 0, y: 16, width: 16, height: 16 },
    growing1: { x: 16, y: 16, width: 16, height: 16 },
    growing2: { x: 32, y: 16, width: 16, height: 16 },
    ready: { x: 48, y: 16, width: 16, height: 16 },
  },
  potato: {
    seed: { x: 0, y: 0, width: 16, height: 16 },
    growing1: { x: 16, y: 0, width: 16, height: 16 },
    growing2: { x: 32, y: 0, width: 16, height: 16 },
    ready: { x: 48, y: 0, width: 16, height: 16 },
  },
}

// Sprites para os canteiros
export const PLOT_SPRITES = {
  empty: { x: 32, y: 0, width: 32, height: 32 },
  wet: { x: 64, y: 0, width: 32, height: 32 },
}

// Sprites para os itens colhidos
export const ITEM_SPRITES = {
  carrot: { x: 0, y: 0, width: 16, height: 16 },
  corn: { x: 16, y: 0, width: 16, height: 16 },
  strawberry: { x: 32, y: 0, width: 16, height: 16 },
  tomato: { x: 48, y: 0, width: 16, height: 16 },
  potato: { x: 64, y: 0, width: 16, height: 16 },
}

// Sprites para decorações
export const DECORATION_SPRITES = {
  tree1: { x: 32, y: 0, width: 32, height: 48 },
  tree2: { x: 64, y: 0, width: 32, height: 48 },
  house: { x: 0, y: 48, width: 48, height: 48 },
  haystack: { x: 96, y: 0, width: 32, height: 32 },
  flower1: { x: 0, y: 32, width: 16, height: 16 },
  flower2: { x: 16, y: 32, width: 16, height: 16 },
}

// Sprites para animais
export const ANIMAL_SPRITES = {
  cow: { x: 144, y: 32, width: 32, height: 32 },
  chicken: { x: 112, y: 32, width: 16, height: 16 },
  sheep: { x: 80, y: 32, width: 16, height: 16 },
}

