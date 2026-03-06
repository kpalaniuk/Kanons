import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const HOUSE_PROJECT = {
  roomSpec: {
    walls: {
      left: { length: 212 },
      back: { length: 160 },
      right: { length: 212 },
      front: { length: 160 },
    },
    ceiling: { type: 'shed-vault', height: 121, peakHeight: 144 },
    openings: [
      { wall: 'front', type: 'trifold', offsetFromLeft: 8, width: 108, height: 80 },
      { wall: 'right', type: 'opening', offsetFromLeft: 0, width: 116, height: 108 },
    ],
  },
  cabinets: [
    // ── LEFT WALL — desk run starts at back wall corner (z=0), no gap, no LW-WRAP ──
    { id: 'LW-D1',  wall: 'left', offsetFromLeft: 0,  offsetFromFloor: 0,    width: 22,  depth: 24, height: 34.5, type: 'base',       label: 'Drawer Base 1',        color: '#8FAF6F' },
    { id: 'LW-D2',  wall: 'left', offsetFromLeft: 70, offsetFromFloor: 0,    width: 22,  depth: 24, height: 34.5, type: 'base',       label: 'Drawer Base 2',        color: '#8FAF6F' },
    // Continuous countertop from back wall to end of desk run (0"→140")
    { id: 'CT-LW',  wall: 'left', offsetFromLeft: 0,  offsetFromFloor: 34.5, width: 140, depth: 24, height: 1.5,  type: 'countertop', label: 'Left Wall Countertop', color: '#d4c9b8' },

    // ── BACK WALL — base cabinets slide left to meet open shelves at z=47" ──
    { id: 'BW-OS1', wall: 'back', offsetFromLeft: 0,  offsetFromFloor: 0,    width: 47,  depth: 12, height: 144, type: 'tall',       label: 'Open Shelves',         color: '#8FAF6F' },
    // Base cabinets flush against shelves (47"→94"), with countertop over them
    { id: 'BW-C1',  wall: 'back', offsetFromLeft: 47, offsetFromFloor: 0,    width: 22,  depth: 24, height: 34.5, type: 'base',      label: 'Corner Cabinet',       color: '#8FAF6F' },
    { id: 'BW-D1',  wall: 'back', offsetFromLeft: 69, offsetFromFloor: 0,    width: 25,  depth: 24, height: 34.5, type: 'base',      label: 'Drawer Base',          color: '#8FAF6F' },
    { id: 'CT-BW',  wall: 'back', offsetFromLeft: 47, offsetFromFloor: 34.5, width: 47,  depth: 24, height: 1.5,  type: 'countertop', label: 'Back Wall Countertop', color: '#d4c9b8' },
    // Murphy + pantry (95"→160"), trapezoidal uppers above
    { id: 'BW-MB1', wall: 'back', offsetFromLeft: 95,  offsetFromFloor: 0,   width: 65,  depth: 24, height: 96,  type: 'murphy',     label: 'Murphy Bed Queen',     color: '#6B8A52' },
    { id: 'BW-P1',  wall: 'back', offsetFromLeft: 112, offsetFromFloor: 0,   width: 48,  depth: 24, height: 96,  type: 'tall',       label: 'Pantry',               color: '#8FAF6F' },
    { id: 'BW-TU1', wall: 'back', offsetFromLeft: 95,  offsetFromFloor: 96,  width: 65,  depth: 24, height: 48,  type: 'upper',      label: 'Trapezoidal Uppers',   color: '#8FAF6F' },

    // ── RIGHT WALL — washer/dryer adjacent to FRONT wall (z=185-212), sink closer to passage ──
    // Order from passage end (116") toward front wall (212"):
    // Garbage(18) + Sink(24) + Dryer(27) + Washer(27) = 96" → 116"→212" ✓
    { id: 'RW-G1',  wall: 'right', offsetFromLeft: 116, offsetFromFloor: 0,    width: 18, depth: 24, height: 34.5, type: 'base',       label: 'Garbage Pullout',      color: '#8FAF6F' },
    { id: 'RW-S1',  wall: 'right', offsetFromLeft: 134, offsetFromFloor: 0,    width: 24, depth: 24, height: 34.5, type: 'base',       label: 'Sink Base',            color: '#8FAF6F' },
    { id: 'RW-WD2', wall: 'right', offsetFromLeft: 158, offsetFromFloor: 0,    width: 27, depth: 24, height: 34.5, type: 'base',       label: 'Dryer',                color: '#9B9B9B' },
    { id: 'RW-WD1', wall: 'right', offsetFromLeft: 185, offsetFromFloor: 0,    width: 27, depth: 24, height: 34.5, type: 'base',       label: 'Washer (adj. front)',  color: '#9B9B9B' },
    // Countertop over full laundry run
    { id: 'CT-RW',  wall: 'right', offsetFromLeft: 116, offsetFromFloor: 34.5, width: 96, depth: 24, height: 1.5,  type: 'countertop', label: 'Right Wall Countertop', color: '#d4c9b8' },
    // Uppers: over dryer and washer (not over sink or garbage)
    { id: 'RW-U2',  wall: 'right', offsetFromLeft: 158, offsetFromFloor: 54,   width: 27, depth: 16, height: 57,   type: 'upper',      label: 'Upper Over Dryer',     color: '#8FAF6F' },
    { id: 'RW-U1',  wall: 'right', offsetFromLeft: 185, offsetFromFloor: 54,   width: 27, depth: 16, height: 57,   type: 'upper',      label: 'Upper Over Washer',    color: '#8FAF6F' },
    // Fridge in other room — side at z=116, extends into passage (z=80→116)
    { id: 'REF-1',  wall: 'right', offsetFromLeft: 80,  offsetFromFloor: 0,    width: 36, depth: 30, height: 72,   type: 'tall',       label: 'Refrigerator',         color: '#C0C0C0' },
  ],
  concept: {
    style: 'euro-frameless',
    finish: 'Sage Green (Benjamin Moore Salisbury Green HC-139)',
    hardware: 'Sleek European brushed nickel bar pulls',
    colors: ['#8FAF6F', '#d4c9b8', '#c0c0c0'],
    notes: 'Euro frameless sage green with grey/beige quartz countertops. Blum soft-close hardware throughout.',
  },
}

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json()
    // projectId is accepted but currently returns the same hardcoded spec
    // Future: look up by projectId from a DB
    void projectId
    return NextResponse.json({ ok: true, ...HOUSE_PROJECT })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
