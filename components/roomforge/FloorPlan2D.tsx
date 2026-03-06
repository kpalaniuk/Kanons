'use client'

import React from 'react'
import type { RoomSpec, Cabinet } from './RoomCanvas'

interface Props {
  roomSpec: RoomSpec
  cabinets: Cabinet[]
  containerWidth?: number
}

const CABINET_COLORS: Record<string, string> = {
  base: '#8FAF6F',
  upper: '#B5CFA0',
  tall: '#7A9E60',
  desk: '#A5C490',
  murphy: '#6B8A52',
  appliance: '#aaaaaa',
}

function getCabinetColor(type: string, color?: string): string {
  if (color) return color
  return CABINET_COLORS[type] || CABINET_COLORS.base
}

function abbreviate(label: string | undefined, index: number, type: string): string {
  if (label) {
    // Take first letters of each word, max 3 chars
    const abbr = label.split(/\s+/).map((w) => w[0]?.toUpperCase() || '').join('')
    return abbr.slice(0, 3) || `${type[0].toUpperCase()}${index + 1}`
  }
  const prefix: Record<string, string> = {
    base: 'B',
    upper: 'U',
    tall: 'T',
    desk: 'D',
    murphy: 'MB',
    appliance: 'AP',
  }
  return `${prefix[type] || 'C'}${index + 1}`
}

export default function FloorPlan2D({ roomSpec, cabinets, containerWidth = 320 }: Props) {
  const W = roomSpec.walls
  const roomW = W.back.length   // X axis (left to right)
  const roomD = W.left.length   // Z axis (back to front)

  // Padding around the plan in SVG units
  const padding = 40
  const dimLineOffset = 18

  // Scale to fit container width
  const drawableW = containerWidth - padding * 2
  const scale = drawableW / roomW
  const drawableD = roomD * scale

  const svgW = containerWidth
  const svgH = drawableD + padding * 2 + 20

  // Convert room coords to SVG
  function rx(inches: number) { return padding + inches * scale }
  function ry(inches: number) { return padding + inches * scale }

  // Cabinets grouped by wall for z-ordering (walls first, then cabinets)
  const wallThicknessPx = 4

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ display: 'block', maxWidth: '100%' }}
      aria-label="2D floor plan top-down view"
    >
      {/* Background */}
      <rect x={0} y={0} width={svgW} height={svgH} fill="#1a1a1a" rx={8} />

      {/* Floor area */}
      <rect
        x={rx(0)}
        y={ry(0)}
        width={drawableW}
        height={drawableD}
        fill="#2a2a2a"
        stroke="none"
      />

      {/* Walls — thin solid black lines on the perimeter */}
      {/* Back wall (top) */}
      <rect x={rx(0)} y={ry(0)} width={drawableW} height={wallThicknessPx} fill="#555" />
      {/* Front wall (bottom) */}
      <rect x={rx(0)} y={ry(roomD) - wallThicknessPx} width={drawableW} height={wallThicknessPx} fill="#555" />
      {/* Left wall */}
      <rect x={rx(0)} y={ry(0)} width={wallThicknessPx} height={drawableD} fill="#555" />
      {/* Right wall */}
      <rect x={rx(roomW) - wallThicknessPx} y={ry(0)} width={wallThicknessPx} height={drawableD} fill="#555" />

      {/* Openings — cut white slots in walls */}
      {roomSpec.openings.map((op, i) => {
        const w = op.width * scale
        const openingH = wallThicknessPx + 2
        if (op.wall === 'back') {
          return (
            <rect
              key={`op-${i}`}
              x={rx(op.offsetFromLeft)}
              y={ry(0) - 1}
              width={w}
              height={openingH}
              fill="#1a1a1a"
            />
          )
        } else if (op.wall === 'front') {
          return (
            <rect
              key={`op-${i}`}
              x={rx(op.offsetFromLeft)}
              y={ry(roomD) - openingH + 1}
              width={w}
              height={openingH}
              fill="#1a1a1a"
            />
          )
        } else if (op.wall === 'left') {
          return (
            <rect
              key={`op-${i}`}
              x={rx(0) - 1}
              y={ry(op.offsetFromLeft)}
              width={openingH}
              height={w}
              fill="#1a1a1a"
            />
          )
        } else if (op.wall === 'right') {
          return (
            <rect
              key={`op-${i}`}
              x={rx(roomW) - openingH + 1}
              y={ry(op.offsetFromLeft)}
              width={openingH}
              height={w}
              fill="#1a1a1a"
            />
          )
        }
        return null
      })}

      {/* Wall outline border */}
      <rect
        x={rx(0)}
        y={ry(0)}
        width={drawableW}
        height={drawableD}
        fill="none"
        stroke="#888"
        strokeWidth={1}
      />

      {/* Cabinets — top-down footprint */}
      {cabinets.map((cab, i) => {
        const cabW = cab.width * scale
        const cabD = cab.depth * scale
        const color = getCabinetColor(cab.type, cab.color)
        const label = abbreviate(cab.label, i, cab.type)

        let x = 0, y = 0, w = 0, d = 0

        if (cab.wall === 'back') {
          x = rx(cab.offsetFromLeft)
          y = ry(0) + wallThicknessPx
          w = cabW
          d = cabD
        } else if (cab.wall === 'front') {
          x = rx(cab.offsetFromLeft)
          y = ry(roomD) - wallThicknessPx - cabD
          w = cabW
          d = cabD
        } else if (cab.wall === 'left') {
          x = rx(0) + wallThicknessPx
          y = ry(cab.offsetFromLeft)
          w = cabD  // depth becomes width in plan view
          d = cabW  // width becomes depth
        } else if (cab.wall === 'right') {
          x = rx(roomW) - wallThicknessPx - cabD
          y = ry(cab.offsetFromLeft)
          w = cabD
          d = cabW
        } else {
          // island — centered
          x = rx(roomW / 2) - cabW / 2
          y = ry(roomD / 2) - cabD / 2
          w = cabW
          d = cabD
        }

        const textX = x + w / 2
        const textY = y + d / 2 + 3

        return (
          <g key={cab.id}>
            <rect
              x={x}
              y={y}
              width={w}
              height={d}
              fill={color}
              fillOpacity={0.85}
              stroke={color}
              strokeWidth={1}
              strokeOpacity={0.5}
            />
            <text
              x={textX}
              y={textY}
              textAnchor="middle"
              fontSize={Math.max(7, Math.min(10, Math.min(w, d) * 0.5))}
              fill="#fff"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {label}
            </text>
          </g>
        )
      })}

      {/* Dimension lines */}
      {/* Width dimension (along bottom) */}
      <g>
        <line
          x1={rx(0)}
          y1={ry(roomD) + dimLineOffset}
          x2={rx(roomW)}
          y2={ry(roomD) + dimLineOffset}
          stroke="#666"
          strokeWidth={1}
        />
        {/* End ticks */}
        <line x1={rx(0)} y1={ry(roomD) + dimLineOffset - 4} x2={rx(0)} y2={ry(roomD) + dimLineOffset + 4} stroke="#666" strokeWidth={1} />
        <line x1={rx(roomW)} y1={ry(roomD) + dimLineOffset - 4} x2={rx(roomW)} y2={ry(roomD) + dimLineOffset + 4} stroke="#666" strokeWidth={1} />
        <text
          x={(rx(0) + rx(roomW)) / 2}
          y={ry(roomD) + dimLineOffset + 12}
          textAnchor="middle"
          fontSize={9}
          fill="#aaa"
          fontFamily="monospace"
        >
          {`${Math.floor(roomW / 12)}'${roomW % 12 > 0 ? `${roomW % 12}"` : ''}`}
        </text>
      </g>

      {/* Depth dimension (along right side) */}
      <g>
        <line
          x1={rx(roomW) + dimLineOffset}
          y1={ry(0)}
          x2={rx(roomW) + dimLineOffset}
          y2={ry(roomD)}
          stroke="#666"
          strokeWidth={1}
        />
        <line x1={rx(roomW) + dimLineOffset - 4} y1={ry(0)} x2={rx(roomW) + dimLineOffset + 4} y2={ry(0)} stroke="#666" strokeWidth={1} />
        <line x1={rx(roomW) + dimLineOffset - 4} y1={ry(roomD)} x2={rx(roomW) + dimLineOffset + 4} y2={ry(roomD)} stroke="#666" strokeWidth={1} />
        <text
          x={rx(roomW) + dimLineOffset + 4}
          y={(ry(0) + ry(roomD)) / 2 + 3}
          textAnchor="start"
          fontSize={9}
          fill="#aaa"
          fontFamily="monospace"
          transform={`rotate(-90, ${rx(roomW) + dimLineOffset + 4}, ${(ry(0) + ry(roomD)) / 2 + 3})`}
          style={{ writingMode: 'vertical-rl' }}
        >
          {`${Math.floor(roomD / 12)}'${roomD % 12 > 0 ? `${roomD % 12}"` : ''}`}
        </text>
      </g>

      {/* Label */}
      <text
        x={rx(roomW / 2)}
        y={ry(0) - 10}
        textAnchor="middle"
        fontSize={10}
        fill="#666"
        fontFamily="monospace"
      >
        TOP VIEW
      </text>

      {/* North indicator */}
      <text x={svgW - 16} y={padding + 14} textAnchor="middle" fontSize={9} fill="#555" fontFamily="monospace">↑N</text>
    </svg>
  )
}
