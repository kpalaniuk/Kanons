'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export interface RoomSpec {
  walls: {
    left: { length: number }
    back: { length: number }
    right: { length: number }
    front: { length: number }
  }
  ceiling: {
    type: 'flat' | 'shed-vault' | 'cathedral'
    height: number
    peakHeight?: number
  }
  openings: Array<{
    wall: 'left' | 'back' | 'right' | 'front'
    type: 'door' | 'window' | 'opening' | 'trifold'
    offsetFromLeft: number
    width: number
    height?: number
  }>
}

export interface Cabinet {
  id: string
  wall: 'left' | 'back' | 'right' | 'front' | 'island'
  offsetFromLeft: number
  offsetFromFloor: number
  width: number
  depth: number
  height: number
  type: 'base' | 'upper' | 'tall' | 'desk' | 'murphy'
  color?: string
  label?: string
}

interface Props {
  roomSpec: RoomSpec
  cabinets: Cabinet[]
}

// Scale factor: inches to Three.js units (1 inch = 0.01 units)
const SCALE = 0.01
const WALL_THICKNESS = 0.03

function inToU(inches: number) {
  return inches * SCALE
}

export default function RoomCanvas({ roomSpec, cabinets }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const roomGroupRef = useRef<THREE.Group | null>(null)

  // Initialize scene once
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.01,
      100
    )
    camera.position.set(2.5, 1.8, 2.5)
    camera.lookAt(0.8, 0.5, 0.8)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.target.set(0.8, 0.5, 0.8)
    controlsRef.current = controls

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(3, 5, 3)
    dirLight.castShadow = true
    scene.add(dirLight)

    // Animate loop
    let running = true
    function animate() {
      if (!running) return
      animFrameRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    function onResize() {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(mount)

    return () => {
      running = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      controls.dispose()
      renderer.dispose()
      resizeObserver.disconnect()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Rebuild room geometry when spec changes
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    // Remove old room group
    if (roomGroupRef.current) {
      scene.remove(roomGroupRef.current)
      roomGroupRef.current.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose()
      })
    }

    const group = new THREE.Group()
    roomGroupRef.current = group
    scene.add(group)

    const wallMat = new THREE.MeshLambertMaterial({ color: 0xd4ccbb, side: THREE.DoubleSide })
    const ceilMat = new THREE.MeshLambertMaterial({
      color: 0xf0ece0,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    })

    const W = roomSpec.walls
    const leftLen = inToU(W.left.length)
    const backLen = inToU(W.back.length)
    const frontLen = inToU(W.front.length)
    const rightLen = inToU(W.right.length)

    const hLeft = inToU(roomSpec.ceiling.height)
    const hRight = roomSpec.ceiling.type === 'shed-vault' && roomSpec.ceiling.peakHeight
      ? inToU(roomSpec.ceiling.peakHeight)
      : hLeft

    // Build openings lookup by wall
    type Opening = RoomSpec['openings'][0]
    const openingsByWall: Record<string, Opening[]> = {
      left: [], back: [], right: [], front: []
    }
    for (const op of roomSpec.openings) {
      openingsByWall[op.wall].push(op)
    }

    // Helper to build a wall with gaps cut out
    // wallDir: direction along wall, wallLen: length, wallH: function(t) -> height at position t
    // Returns array of meshes
    function buildWallWithOpenings(
      openings: Opening[],
      wallLen: number,
      wallH: (t: number) => number,
      wallDepth: number,
      transform: (geo: THREE.BufferGeometry) => THREE.BufferGeometry
    ): THREE.Mesh[] {
      const meshes: THREE.Mesh[] = []

      // Sort openings by offset
      const sorted = [...openings].sort((a, b) => a.offsetFromLeft - b.offsetFromLeft)

      // Build segments
      let cursor = 0
      const segments: Array<{ start: number; end: number }> = []

      for (const op of sorted) {
        const start = inToU(op.offsetFromLeft)
        const end = start + inToU(op.width)
        if (cursor < start) {
          segments.push({ start: cursor, end: start })
        }
        cursor = end
      }
      if (cursor < wallLen) {
        segments.push({ start: cursor, end: wallLen })
      }

      // If no openings, one full segment
      if (sorted.length === 0) {
        segments.push({ start: 0, end: wallLen })
      }

      for (const seg of segments) {
        const segLen = seg.end - seg.start
        if (segLen <= 0) continue
        const midT = (seg.start + seg.end) / 2
        const h = wallH(midT / wallLen)
        const geo = new THREE.BoxGeometry(segLen, h, wallDepth)
        const tGeo = transform(geo)
        // Position: center of segment horizontally, half-height vertically
        // transform handles rotation/positioning
        const mesh = new THREE.Mesh(tGeo, wallMat)
        meshes.push(mesh)
      }

      return meshes
    }

    // Average height helper for flat sections
    function avgH(len: number, hL: number, hR: number) {
      // For a segment, the interpolated height at center
      return (hL + hR) / 2
    }

    // --- LEFT WALL (runs from front to back, along Z axis) ---
    // Left wall x=0, z from 0 to leftLen
    // Height varies: at z=0 (front) = hLeft if flat, shed-vault: hLeft throughout (it's the left side)
    // Actually for shed vault: height at x position (left=hLeft, right=hRight)
    // Left wall is at x=0, so all points are at x=0 -> height = hLeft
    {
      const open = openingsByWall['left']
      const sorted = [...open].sort((a, b) => a.offsetFromLeft - b.offsetFromLeft)
      let cursor = 0
      const segments: Array<{ start: number; end: number }> = []
      for (const op of sorted) {
        const s = inToU(op.offsetFromLeft)
        const e = s + inToU(op.width)
        if (cursor < s) segments.push({ start: cursor, end: s })
        cursor = e
      }
      if (cursor < leftLen) segments.push({ start: cursor, end: leftLen })
      if (sorted.length === 0) segments.push({ start: 0, end: leftLen })

      for (const seg of segments) {
        const segLen = seg.end - seg.start
        if (segLen <= 0) continue
        const geo = new THREE.BoxGeometry(WALL_THICKNESS, hLeft, segLen)
        const mesh = new THREE.Mesh(geo, wallMat)
        mesh.position.set(0, hLeft / 2, seg.start + segLen / 2)
        group.add(mesh)
      }
    }

    // --- RIGHT WALL (x=backLen, z from 0 to rightLen) ---
    {
      const open = openingsByWall['right']
      const sorted = [...open].sort((a, b) => a.offsetFromLeft - b.offsetFromLeft)
      let cursor = 0
      const segments: Array<{ start: number; end: number }> = []
      for (const op of sorted) {
        const s = inToU(op.offsetFromLeft)
        const e = s + inToU(op.width)
        if (cursor < s) segments.push({ start: cursor, end: s })
        cursor = e
      }
      if (cursor < rightLen) segments.push({ start: cursor, end: rightLen })
      if (sorted.length === 0) segments.push({ start: 0, end: rightLen })

      for (const seg of segments) {
        const segLen = seg.end - seg.start
        if (segLen <= 0) continue
        const geo = new THREE.BoxGeometry(WALL_THICKNESS, hRight, segLen)
        const mesh = new THREE.Mesh(geo, wallMat)
        mesh.position.set(backLen, hRight / 2, seg.start + segLen / 2)
        group.add(mesh)
      }
    }

    // --- BACK WALL (z=0, x from 0 to backLen) ---
    // Height varies with shed vault: left end (x=0) hLeft, right end (x=backLen) hRight
    {
      const open = openingsByWall['back']
      const sorted = [...open].sort((a, b) => a.offsetFromLeft - b.offsetFromLeft)
      let cursor = 0
      const segments: Array<{ start: number; end: number }> = []
      for (const op of sorted) {
        const s = inToU(op.offsetFromLeft)
        const e = s + inToU(op.width)
        if (cursor < s) segments.push({ start: cursor, end: s })
        cursor = e
      }
      if (cursor < backLen) segments.push({ start: cursor, end: backLen })
      if (sorted.length === 0) segments.push({ start: 0, end: backLen })

      for (const seg of segments) {
        const segLen = seg.end - seg.start
        if (segLen <= 0) continue
        const t = (seg.start + seg.end) / 2 / backLen
        const h = hLeft + (hRight - hLeft) * t
        // For shed vault, wall height varies — use average for this segment
        const geo = new THREE.BoxGeometry(segLen, h, WALL_THICKNESS)
        const mesh = new THREE.Mesh(geo, wallMat)
        mesh.position.set(seg.start + segLen / 2, h / 2, 0)
        group.add(mesh)
      }
    }

    // --- FRONT WALL (z=frontLen side, actually z=leftLen, x from 0 to frontLen) ---
    {
      const open = openingsByWall['front']
      const sorted = [...open].sort((a, b) => a.offsetFromLeft - b.offsetFromLeft)
      let cursor = 0
      const segments: Array<{ start: number; end: number }> = []
      for (const op of sorted) {
        const s = inToU(op.offsetFromLeft)
        const e = s + inToU(op.width)
        if (cursor < s) segments.push({ start: cursor, end: s })
        cursor = e
      }
      if (cursor < frontLen) segments.push({ start: cursor, end: frontLen })
      if (sorted.length === 0) segments.push({ start: 0, end: frontLen })

      for (const seg of segments) {
        const segLen = seg.end - seg.start
        if (segLen <= 0) continue
        const t = (seg.start + seg.end) / 2 / frontLen
        const h = hLeft + (hRight - hLeft) * t
        const geo = new THREE.BoxGeometry(segLen, h, WALL_THICKNESS)
        const mesh = new THREE.Mesh(geo, wallMat)
        mesh.position.set(seg.start + segLen / 2, h / 2, leftLen)
        group.add(mesh)
      }
    }

    // --- FLOOR ---
    const gridHelper = new THREE.GridHelper(
      Math.max(backLen, leftLen) * 1.2,
      20,
      0x444466,
      0x333355
    )
    gridHelper.position.set(backLen / 2, 0, leftLen / 2)
    group.add(gridHelper)

    // Solid floor
    const floorGeo = new THREE.PlaneGeometry(backLen, leftLen)
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x2a2a3e })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(backLen / 2, 0, leftLen / 2)
    group.add(floor)

    // --- CEILING ---
    if (roomSpec.ceiling.type === 'flat') {
      const ceilGeo = new THREE.PlaneGeometry(backLen, leftLen)
      const ceil = new THREE.Mesh(ceilGeo, ceilMat)
      ceil.rotation.x = Math.PI / 2
      ceil.position.set(backLen / 2, hLeft, leftLen / 2)
      group.add(ceil)
    } else if (roomSpec.ceiling.type === 'shed-vault') {
      // Sloped ceiling plane — build as a sloped quad
      // Four corners: (0,hLeft,0), (backLen,hRight,0), (backLen,hRight,leftLen), (0,hLeft,leftLen)
      const ceilVerts = new Float32Array([
        0, hLeft, 0,
        backLen, hRight, 0,
        backLen, hRight, leftLen,

        0, hLeft, 0,
        backLen, hRight, leftLen,
        0, hLeft, leftLen,
      ])
      const ceilGeo = new THREE.BufferGeometry()
      ceilGeo.setAttribute('position', new THREE.BufferAttribute(ceilVerts, 3))
      ceilGeo.computeVertexNormals()
      const ceil = new THREE.Mesh(ceilGeo, ceilMat)
      group.add(ceil)
    }

    // --- CABINETS ---
    for (const cab of cabinets) {
      const cabColor = cab.color || '#C4975A'
      const cabMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(cabColor) })
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x5a3a1a })

      const w = inToU(cab.width)
      const d = inToU(cab.depth)
      const h = inToU(cab.height)
      const oL = inToU(cab.offsetFromLeft)
      const oF = inToU(cab.offsetFromFloor)

      const geo = new THREE.BoxGeometry(w, h, d)
      const mesh = new THREE.Mesh(geo, cabMat)

      // Edges
      const edges = new THREE.EdgesGeometry(geo)
      const edgeLines = new THREE.LineSegments(edges, edgeMat)

      let cx = 0, cy = oF + h / 2, cz = 0

      if (cab.wall === 'left') {
        cx = d / 2
        cz = oL + w / 2
        mesh.rotation.y = Math.PI / 2
        edgeLines.rotation.y = Math.PI / 2
        // Reposition after rotation
        mesh.rotation.y = 0
        edgeLines.rotation.y = 0
        // For left wall (x=0), cabinet extends inward (+x), runs along z
        cx = d / 2
        cz = oL + w / 2
      } else if (cab.wall === 'right') {
        cx = backLen - d / 2
        cz = oL + w / 2
      } else if (cab.wall === 'back') {
        cx = oL + w / 2
        cz = d / 2
      } else if (cab.wall === 'front') {
        cx = oL + w / 2
        cz = leftLen - d / 2
      } else {
        // island
        cx = backLen / 2
        cz = leftLen / 2
      }

      mesh.position.set(cx, cy, cz)
      edgeLines.position.set(cx, cy, cz)
      group.add(mesh)
      group.add(edgeLines)
    }

    // Reposition camera target to room center
    const cx = backLen / 2
    const cz = leftLen / 2
    if (controlsRef.current) {
      controlsRef.current.target.set(cx, hLeft * 0.4, cz)
      // Only set camera once (first load)
      if (cameraRef.current) {
        const dist = Math.max(backLen, leftLen) * 1.4
        cameraRef.current.position.set(cx + dist, hLeft * 1.2, cz + dist)
        controlsRef.current.update()
      }
    }
  }, [roomSpec, cabinets])

  return <div ref={mountRef} className="w-full h-full" />
}
