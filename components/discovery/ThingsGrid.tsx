"use client"

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

// Tipos de dados para o componente
type Position = { x: number; y: number }
export type ItemConfig = {
  gridIndex: number
  columnIndex: number
  rowIndex: number
  isMoving: boolean
}
type ThiingsGridProps = {
  items: any[]
  gridSize: number
  renderItem: (config: ItemConfig & { item: any }) => ReactNode
  className?: string
  initialPosition?: Position
}

// Constantes físicas para a animação
const DRAG_FRICTION = 0.92
const MOMENTUM_DAMPING = 0.95
const OVERSCROLL_DAMPING = 0.2
const OVERSCROLL_TENSION = 0.2

export const ThingsGrid = ({
  gridSize,
  items,
  renderItem,
  className,
  initialPosition = { x: 0, y: 0 },
}: ThiingsGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<Position>(initialPosition)
  const [velocity, setVelocity] = useState<Position>({ x: 0, y: 0 })
  const [isMoving, setIsMoving] = useState(false)
  const isDraggingRef = useRef(false)
  const lastPositionRef = useRef<Position>({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const gridDimensions = useMemo(() => {
    const numColumns = Math.max(1, Math.floor(containerSize.width / gridSize))
    const numRows = Math.ceil(items.length / numColumns)
    return {
      numColumns,
      numRows,
      width: numColumns * gridSize,
      height: numRows * gridSize,
    }
  }, [containerSize, gridSize, items.length])

  const clampPosition = useCallback(
    (pos: Position): Position => {
      const minX = containerSize.width - gridDimensions.width
      const minY = containerSize.height - gridDimensions.height
      return {
        x: Math.max(minX - gridSize, Math.min(gridSize, pos.x)),
        y: Math.max(minY - gridSize, Math.min(gridSize, pos.y)),
      }
    },
    [containerSize, gridDimensions, gridSize]
  )

  const visibleRange = useMemo(() => {
    const { numColumns } = gridDimensions
    const startColumn = Math.floor(-position.x / gridSize)
    const endColumn = Math.ceil((-position.x + containerSize.width) / gridSize)
    const startRow = Math.floor(-position.y / gridSize)
    const endRow = Math.ceil((-position.y + containerSize.height) / gridSize)

    const visibleItems = []
    for (let r = startRow; r < endRow; r++) {
      for (let c = startColumn; c < endColumn; c++) {
        const index = r * numColumns + c
        if (index >= 0 && index < items.length) {
          visibleItems.push({
            gridIndex: index,
            columnIndex: c,
            rowIndex: r,
          })
        }
      }
    }
    return visibleItems
  }, [position, containerSize, gridDimensions, items.length, gridSize])

  const animate = useCallback(() => {
    animationFrameRef.current = requestAnimationFrame(() => {
      setPosition((prevPos) => {
        let newX = prevPos.x + velocity.x
        let newY = prevPos.y + velocity.y
        let newVelX = velocity.x
        let newVelY = velocity.y

        const minX = containerSize.width - gridDimensions.width
        const minY = containerSize.height - gridDimensions.height

        if (newX > 0 || newX < minX) {
          newX = prevPos.x + (0 - prevPos.x) * OVERSCROLL_TENSION
          newVelX *= OVERSCROLL_DAMPING
        }
        if (newY > 0 || newY < minY) {
          newY = prevPos.y + (0 - prevPos.y) * OVERSCROLL_TENSION
          newVelY *= OVERSCROLL_DAMPING
        }

        newVelX *= MOMENTUM_DAMPING
        newVelY *= MOMENTUM_DAMPING

        setVelocity({ x: newVelX, y: newVelY })

        const isStillMoving =
          Math.abs(newVelX) > 0.01 || Math.abs(newVelY) > 0.01
        setIsMoving(isStillMoving)

        if (!isStillMoving) {
          cancelAnimationFrame(animationFrameRef.current!)
        } else {
          animate()
        }
        return { x: newX, y: newY }
      })
    })
  }, [velocity.x, velocity.y, containerSize, gridDimensions.width, gridDimensions.height])

  useEffect(() => {
    if (isMoving && !isDraggingRef.current) {
      animate()
    }
    return () => cancelAnimationFrame(animationFrameRef.current!)
  }, [isMoving, animate])

  const startDrag = useCallback((clientX: number, clientY: number) => {
    isDraggingRef.current = true
    cancelAnimationFrame(animationFrameRef.current!)
    lastPositionRef.current = { x: clientX, y: clientY }
    setVelocity({ x: 0, y: 0 })
  }, [])

  const onDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDraggingRef.current) return
      const deltaX = clientX - lastPositionRef.current.x
      const deltaY = clientY - lastPositionRef.current.y
      lastPositionRef.current = { x: clientX, y: clientY }
      setPosition((prev) => clampPosition({ x: prev.x + deltaX, y: prev.y + deltaY }))
      setVelocity((prev) => ({
        x: (prev.x + deltaX) * DRAG_FRICTION,
        y: (prev.y + deltaY) * DRAG_FRICTION,
      }))
    },
    [clampPosition]
  )

  const endDrag = useCallback(() => {
    isDraggingRef.current = false
    setIsMoving(true)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => startDrag(e.clientX, e.clientY)
  const handleMouseMove = (e: React.MouseEvent) => onDrag(e.clientX, e.clientY)
  const handleMouseUp = () => endDrag()
  const handleTouchStart = (e: React.TouchEvent) => startDrag(e.touches[0].clientX, e.touches[0].clientY)
  const handleTouchMove = (e: React.TouchEvent) => onDrag(e.touches[0].clientX, e.touches[0].clientY)
  const handleTouchEnd = () => endDrag()
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    cancelAnimationFrame(animationFrameRef.current!)
    setPosition((prev) => clampPosition({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }))
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div
        className="absolute top-0 left-0"
        style={{
          width: gridDimensions.width,
          height: gridDimensions.height,
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        {visibleRange.map(({ gridIndex, columnIndex, rowIndex }) => (
          <div
            key={gridIndex}
            className="absolute"
            style={{
              width: gridSize,
              height: gridSize,
              transform: `translate3d(${columnIndex * gridSize}px, ${
                rowIndex * gridSize
              }px, 0)`,
            }}
          >
            {renderItem({
              item: items[gridIndex],
              gridIndex,
              columnIndex,
              rowIndex,
              isMoving,
            })}
          </div>
        ))}
      </div>
    </div>
  )
}