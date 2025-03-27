import type React from "react"
interface SpriteProps {
  spriteSheet: string
  x: number
  y: number
  width: number
  height: number
  scale?: number
  className?: string
  style?: React.CSSProperties
}

export function Sprite({ spriteSheet, x, y, width, height, scale = 1, className = "", style = {} }: SpriteProps) {
  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: width * scale,
        height: height * scale,
        backgroundImage: `url(${spriteSheet})`,
        backgroundPosition: `-${x * scale}px -${y * scale}px`,
        backgroundSize: `${(spriteSheet.includes("tilemap") ? 256 : 128) * scale}px auto`,
        imageRendering: "pixelated",
        ...style,
      }}
    />
  )
}

