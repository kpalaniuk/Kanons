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
    { id: 'LW-D1', wall: 'left', offsetFromLeft: 45, offsetFromFloor: 0, width: 22, depth: 24, height: 34.5, type: 'base', label: 'Drawer Base 1', color: '#8FAF6F' },
    { id: 'LW-D2', wall: 'left', offsetFromLeft: 115, offsetFromFloor: 0, width: 22, depth: 24, height: 34.5, type: 'base', label: 'Drawer Base 2', color: '#8FAF6F' },
    { id: 'LW-WRAP', wall: 'left', offsetFromLeft: 185, offsetFromFloor: 0, width: 24, depth: 24, height: 34.5, type: 'base', label: 'Corner Wrap', color: '#8FAF6F' },
    { id: 'BW-C1', wall: 'back', offsetFromLeft: 0, offsetFromFloor: 0, width: 22, depth: 24, height: 34.5, type: 'base', label: 'Corner Cabinet', color: '#8FAF6F' },
    { id: 'BW-D1', wall: 'back', offsetFromLeft: 22, offsetFromFloor: 0, width: 25, depth: 24, height: 34.5, type: 'base', label: 'Drawer Base', color: '#8FAF6F' },
    { id: 'BW-OS1', wall: 'back', offsetFromLeft: 0, offsetFromFloor: 0, width: 47, depth: 12, height: 144, type: 'tall', label: 'Open Shelves', color: '#8FAF6F' },
    { id: 'BW-MB1', wall: 'back', offsetFromLeft: 47, offsetFromFloor: 0, width: 65, depth: 24, height: 96, type: 'murphy', label: 'Murphy Bed Queen', color: '#8FAF6F' },
    { id: 'BW-P1', wall: 'back', offsetFromLeft: 112, offsetFromFloor: 0, width: 48, depth: 24, height: 96, type: 'tall', label: 'Pantry', color: '#8FAF6F' },
    { id: 'BW-TU1', wall: 'back', offsetFromLeft: 47, offsetFromFloor: 96, width: 113, depth: 24, height: 48, type: 'upper', label: 'Trapezoidal Uppers', color: '#8FAF6F' },
    { id: 'RW-WD1', wall: 'right', offsetFromLeft: 0, offsetFromFloor: 0, width: 27, depth: 24, height: 34.5, type: 'base', label: 'Washer', color: '#9B9B9B' },
    { id: 'RW-WD2', wall: 'right', offsetFromLeft: 27, offsetFromFloor: 0, width: 27, depth: 24, height: 34.5, type: 'base', label: 'Dryer', color: '#9B9B9B' },
    { id: 'RW-S1', wall: 'right', offsetFromLeft: 54, offsetFromFloor: 0, width: 24, depth: 24, height: 34.5, type: 'base', label: 'Sink Base', color: '#8FAF6F' },
    { id: 'RW-G1', wall: 'right', offsetFromLeft: 78, offsetFromFloor: 0, width: 18, depth: 24, height: 34.5, type: 'base', label: 'Garbage Pullout', color: '#8FAF6F' },
    { id: 'RW-DB1', wall: 'right', offsetFromLeft: 96, offsetFromFloor: 0, width: 24, depth: 24, height: 34.5, type: 'base', label: 'Drawer Base', color: '#8FAF6F' },
    { id: 'RW-U1', wall: 'right', offsetFromLeft: 0, offsetFromFloor: 54, width: 27, depth: 16, height: 57, type: 'upper', label: 'Upper Linens 1', color: '#8FAF6F' },
    { id: 'RW-U2', wall: 'right', offsetFromLeft: 27, offsetFromFloor: 54, width: 27, depth: 16, height: 57, type: 'upper', label: 'Upper Linens 2', color: '#8FAF6F' },
    { id: 'REF-1', wall: 'right', offsetFromLeft: 120, offsetFromFloor: 0, width: 36, depth: 24, height: 72, type: 'tall', label: 'Refrigerator', color: '#C0C0C0' },
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
