'use client'

import { useEffect, useRef, useState } from 'react'
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
  type: 'base' | 'upper' | 'tall' | 'desk' | 'murphy' | 'countertop'
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

// ── Trapezoid wall geometry ────────────────────────────────────────────────
// Builds a trapezoidal prism where the top edge slopes from y0L (at x0) to y0R (at x1).
// Used for BACK and FRONT walls under a shed-vault ceiling.
function makeTrapezoidWall(
  x0: number, x1: number,   // start/end X (absolute scene coords)
  y0L: number, y0R: number, // top height at x0 and x1
  zPos: number,             // Z position of the wall face (front face)
  thickness: number         // wall thickness (Z depth, positive direction)
): THREE.BufferGeometry {
  const zBack = zPos + thickness
  const verts = new Float32Array([
    // Front face (z = zPos) — two triangles
    x0, 0,   zPos,   x1, 0,   zPos,   x1, y0R, zPos,
    x0, 0,   zPos,   x1, y0R, zPos,   x0, y0L, zPos,
    // Back face (z = zBack) — wound opposite for correct normal
    x0, 0,   zBack,  x1, y0R, zBack,  x1, 0,   zBack,
    x0, 0,   zBack,  x0, y0L, zBack,  x1, y0R, zBack,
    // Top face (sloped)
    x0, y0L, zPos,   x1, y0R, zPos,   x1, y0R, zBack,
    x0, y0L, zPos,   x1, y0R, zBack,  x0, y0L, zBack,
    // Bottom face
    x0, 0,   zPos,   x1, 0,   zBack,  x1, 0,   zPos,
    x0, 0,   zPos,   x0, 0,   zBack,  x1, 0,   zBack,
    // Left cap
    x0, 0,   zPos,   x0, y0L, zPos,   x0, y0L, zBack,
    x0, 0,   zPos,   x0, y0L, zBack,  x0, 0,   zBack,
    // Right cap
    x1, 0,   zPos,   x1, y0R, zBack,  x1, y0R, zPos,
    x1, 0,   zPos,   x1, 0,   zBack,  x1, y0R, zBack,
  ])
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(verts, 3))
  geo.computeVertexNormals()
  return geo
}

export default function RoomCanvas({ roomSpec, cabinets }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const roomGroupRef = useRef<THREE.Group | null>(null)
  const wallGroupRef = useRef<THREE.Group | null>(null)

  const [wallsVisible, setWallsVisible] = useState(true)

  // Touch state refs
  const touchStateRef = useRef<{
    lastX: number
    lastY: number
    lastDist: number
    lastMidX: number
    lastMidY: number
    touches: number
  }>({
    lastX: 0,
    lastY: 0,
    lastDist: 0,
    lastMidX: 0,
    lastMidY: 0,
    touches: 0,
  })

  // Initialize scene once
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f0f0f)
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Orbit controls (for desktop mouse/trackpad)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.target.set(0.8, 0.5, 0.8)
    // Disable touch on OrbitControls — we handle it manually
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    }
    controlsRef.current = controls

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(3, 5, 3)
    dirLight.castShadow = true
    scene.add(dirLight)
    const fillLight = new THREE.DirectionalLight(0x8899ff, 0.3)
    fillLight.position.set(-3, 2, -3)
    scene.add(fillLight)

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

    // ── Touch controls ────────────────────────────────────────────────────

    const canvas = renderer.domElement
    const ts = touchStateRef.current

    function getTouchDist(t1: Touch, t2: Touch) {
      const dx = t1.clientX - t2.clientX
      const dy = t1.clientY - t2.clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    function getTouchMid(t1: Touch, t2: Touch) {
      return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      }
    }

    function onTouchStart(e: TouchEvent) {
      e.preventDefault()
      ts.touches = e.touches.length

      if (e.touches.length === 1) {
        ts.lastX = e.touches[0].clientX
        ts.lastY = e.touches[0].clientY
      } else if (e.touches.length === 2) {
        ts.lastDist = getTouchDist(e.touches[0], e.touches[1])
        const mid = getTouchMid(e.touches[0], e.touches[1])
        ts.lastMidX = mid.x
        ts.lastMidY = mid.y
      }
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      const cam = cameraRef.current
      const ctrl = controlsRef.current
      if (!cam || !ctrl) return

      if (e.touches.length === 1 && ts.touches === 1) {
        // ── 1 finger: orbital rotate ───────────────────────────────────
        const dx = e.touches[0].clientX - ts.lastX
        const dy = e.touches[0].clientY - ts.lastY

        // Rotate orbit around target
        const spherical = new THREE.Spherical()
        const offset = cam.position.clone().sub(ctrl.target)
        spherical.setFromVector3(offset)
        spherical.theta -= dx * 0.008
        spherical.phi -= dy * 0.008
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi))
        offset.setFromSpherical(spherical)
        cam.position.copy(ctrl.target).add(offset)
        cam.lookAt(ctrl.target)

        ts.lastX = e.touches[0].clientX
        ts.lastY = e.touches[0].clientY
      } else if (e.touches.length === 2 && ts.touches === 2) {
        const newDist = getTouchDist(e.touches[0], e.touches[1])
        const newMid = getTouchMid(e.touches[0], e.touches[1])

        const distDelta = newDist - ts.lastDist
        const midDX = newMid.x - ts.lastMidX
        const midDY = newMid.y - ts.lastMidY

        const offset = cam.position.clone().sub(ctrl.target)
        const currentRadius = offset.length()

        if (Math.abs(distDelta) > Math.abs(midDX) + Math.abs(midDY)) {
          // ── 2 fingers pinch: zoom ──────────────────────────────────
          const zoomFactor = 1 - distDelta * 0.004
          const newRadius = Math.max(0.3, Math.min(15, currentRadius * zoomFactor))
          offset.normalize().multiplyScalar(newRadius)
          cam.position.copy(ctrl.target).add(offset)
          cam.lookAt(ctrl.target)
        } else {
          // ── 2 fingers drag: pan ───────────────────────────────────
          // Pan perpendicular to look direction
          const right = new THREE.Vector3()
          const up = new THREE.Vector3()
          cam.getWorldDirection(new THREE.Vector3()) // forward
          right.crossVectors(cam.getWorldDirection(new THREE.Vector3()), cam.up).normalize()
          up.copy(cam.up)

          const panSpeed = currentRadius * 0.003
          const panX = right.multiplyScalar(-midDX * panSpeed)
          const panY = up.multiplyScalar(midDY * panSpeed)

          ctrl.target.add(panX).add(panY)
          cam.position.add(panX).add(panY)
          cam.lookAt(ctrl.target)
        }

        ts.lastDist = newDist
        ts.lastMidX = newMid.x
        ts.lastMidY = newMid.y
      }
    }

    function onTouchEnd(e: TouchEvent) {
      ts.touches = e.touches.length
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      running = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      controls.dispose()
      renderer.dispose()
      resizeObserver.disconnect()
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Toggle wall visibility
  useEffect(() => {
    if (wallGroupRef.current) {
      wallGroupRef.current.visible = wallsVisible
    }
  }, [wallsVisible])

  // Helper: create diagonal hatch lines across a wall plane
  function buildWallHatch(
    width: number,
    height: number,
    position: THREE.Vector3,
    rotation: THREE.Euler
  ): THREE.LineSegments[] {
    const lines: THREE.LineSegments[] = []
    const mat = new THREE.LineBasicMaterial({ color: 0xaaaaaa, opacity: 0.2, transparent: true })
    // Spacing every 24 inches = 0.24 units
    const spacing = inToU(24)
    // diagonal lines going from bottom-left to top-right (and bottom-right to top-left)
    const diagonalCount = Math.ceil((width + height) / spacing)

    for (let i = -diagonalCount; i <= diagonalCount; i++) {
      const offset = i * spacing
      // "/" direction lines
      const x1 = Math.max(0, offset)
      const y1 = Math.max(0, -offset)
      const x2 = Math.min(width, offset + height)
      const y2 = Math.min(height, height - offset)

      if (x2 > x1 || y2 > y1) {
        const pts = new Float32Array([
          x1 - width / 2, y1 - height / 2, 0,
          x2 - width / 2, y2 - height / 2, 0,
        ])
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
        const seg = new THREE.LineSegments(geo, mat)
        seg.position.copy(position)
        seg.rotation.copy(rotation)
        lines.push(seg)
      }
    }
    return lines
  }

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

    // Wall group for visibility toggling
    const wallGroup = new THREE.Group()
    wallGroup.visible = wallsVisible
    wallGroupRef.current = wallGroup
    group.add(wallGroup)

    // Very faint fill material for walls
    const wallFillMat = new THREE.MeshLambertMaterial({
      color: 0xd4ccbb,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.05,
    })
    const wallEdgeMat = new THREE.LineBasicMaterial({
      color: 0x888888,
      opacity: 0.6,
      transparent: true,
    })

    const ceilMat = new THREE.MeshLambertMaterial({
      color: 0xf0ece0,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    })

    const W = roomSpec.walls
    const leftLen = inToU(W.left.length)
    const backLen = inToU(W.back.length)
    const frontLen = inToU(W.front.length)
    const rightLen = inToU(W.right.length)

    const hLeft = inToU(roomSpec.ceiling.height)
    const hRight =
      roomSpec.ceiling.type === 'shed-vault' && roomSpec.ceiling.peakHeight
        ? inToU(roomSpec.ceiling.peakHeight)
        : hLeft

    type Opening = RoomSpec['openings'][0]
    const openingsByWall: Record<string, Opening[]> = {
      left: [],
      back: [],
      right: [],
      front: [],
    }
    for (const op of roomSpec.openings) {
      openingsByWall[op.wall].push(op)
    }

    function buildWallSegments(
      openings: Opening[],
      wallLen: number
    ): Array<{ start: number; end: number }> {
      const sorted = [...openings].sort((a, b) => a.offsetFromLeft - b.offsetFromLeft)
      const segments: Array<{ start: number; end: number }> = []
      let cursor = 0

      for (const op of sorted) {
        const s = inToU(op.offsetFromLeft)
        const e = s + inToU(op.width)
        if (cursor < s) segments.push({ start: cursor, end: s })
        cursor = e
      }
      if (cursor < wallLen) segments.push({ start: cursor, end: wallLen })
      if (sorted.length === 0) segments.push({ start: 0, end: wallLen })

      return segments
    }

    function addBoxWallSegment(geo: THREE.BoxGeometry, mesh: THREE.Mesh) {
      mesh.material = wallFillMat
      wallGroup.add(mesh)

      // Edge lines
      const edges = new THREE.EdgesGeometry(geo)
      const edgeLines = new THREE.LineSegments(edges, wallEdgeMat)
      edgeLines.position.copy(mesh.position)
      edgeLines.rotation.copy(mesh.rotation)
      wallGroup.add(edgeLines)
    }

    function addTrapWallSegment(geo: THREE.BufferGeometry, mesh: THREE.Mesh) {
      mesh.material = wallFillMat
      wallGroup.add(mesh)
      // EdgesGeometry works on BufferGeometry too
      const edges = new THREE.EdgesGeometry(geo)
      const edgeLines = new THREE.LineSegments(edges, wallEdgeMat)
      wallGroup.add(edgeLines)
    }

    // --- LEFT WALL ---
    for (const seg of buildWallSegments(openingsByWall['left'], leftLen)) {
      const segLen = seg.end - seg.start
      if (segLen <= 0) continue
      const geo = new THREE.BoxGeometry(WALL_THICKNESS, hLeft, segLen)
      const mesh = new THREE.Mesh(geo, wallFillMat)
      mesh.position.set(0, hLeft / 2, seg.start + segLen / 2)
      addBoxWallSegment(geo, mesh)

      // Diagonal hatch — on xz plane of left wall (rotated)
      const hatchLines = buildWallHatch(
        segLen, hLeft,
        new THREE.Vector3(0, hLeft / 2, seg.start + segLen / 2),
        new THREE.Euler(0, Math.PI / 2, 0)
      )
      hatchLines.forEach(l => wallGroup.add(l))
    }

    // --- RIGHT WALL ---
    for (const seg of buildWallSegments(openingsByWall['right'], rightLen)) {
      const segLen = seg.end - seg.start
      if (segLen <= 0) continue
      const geo = new THREE.BoxGeometry(WALL_THICKNESS, hRight, segLen)
      const mesh = new THREE.Mesh(geo, wallFillMat)
      mesh.position.set(backLen, hRight / 2, seg.start + segLen / 2)
      addBoxWallSegment(geo, mesh)

      const hatchLines = buildWallHatch(
        segLen, hRight,
        new THREE.Vector3(backLen, hRight / 2, seg.start + segLen / 2),
        new THREE.Euler(0, Math.PI / 2, 0)
      )
      hatchLines.forEach(l => wallGroup.add(l))
    }

    // --- BACK WALL (z=0) — trapezoidal geometry for shed vault ---
    for (const seg of buildWallSegments(openingsByWall['back'], backLen)) {
      const segLen = seg.end - seg.start
      if (segLen <= 0) continue
      const segStartU = seg.start
      const segEndU = seg.end
      const hAtStart = hLeft + (hRight - hLeft) * (segStartU / backLen)
      const hAtEnd   = hLeft + (hRight - hLeft) * (segEndU   / backLen)
      // zPos=-WALL_THICKNESS so the face is flush with z=0, thickness extends into room
      const geo = makeTrapezoidWall(segStartU, segEndU, hAtStart, hAtEnd, -WALL_THICKNESS, WALL_THICKNESS)
      const mesh = new THREE.Mesh(geo, wallFillMat)
      // No position.set needed — verts are in absolute scene coords
      addTrapWallSegment(geo, mesh)

      // Hatch: approximate center position for hatch overlay
      const avgH = (hAtStart + hAtEnd) / 2
      const hatchLines = buildWallHatch(
        segLen, avgH,
        new THREE.Vector3(seg.start + segLen / 2, avgH / 2, 0),
        new THREE.Euler(0, 0, 0)
      )
      hatchLines.forEach(l => wallGroup.add(l))
    }

    // --- FRONT WALL (z=leftLen) — trapezoidal geometry for shed vault ---
    for (const seg of buildWallSegments(openingsByWall['front'], frontLen)) {
      const segLen = seg.end - seg.start
      if (segLen <= 0) continue
      const segStartU = seg.start
      const segEndU = seg.end
      const hAtStart = hLeft + (hRight - hLeft) * (segStartU / frontLen)
      const hAtEnd   = hLeft + (hRight - hLeft) * (segEndU   / frontLen)
      // zPos=leftLen, thickness extends outward (positive Z)
      const geo = makeTrapezoidWall(segStartU, segEndU, hAtStart, hAtEnd, leftLen, WALL_THICKNESS)
      const mesh = new THREE.Mesh(geo, wallFillMat)
      addTrapWallSegment(geo, mesh)

      const avgH = (hAtStart + hAtEnd) / 2
      const hatchLines = buildWallHatch(
        segLen, avgH,
        new THREE.Vector3(seg.start + segLen / 2, avgH / 2, leftLen),
        new THREE.Euler(0, 0, 0)
      )
      hatchLines.forEach(l => wallGroup.add(l))
    }

    // --- FLOOR: refined grid ---
    const floorGeo = new THREE.PlaneGeometry(backLen, leftLen)
    const floorMat = new THREE.MeshLambertMaterial({ color: 0xc8c8c8 })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(backLen / 2, 0, leftLen / 2)
    group.add(floor)

    // Fine grid — every 12 inches (1 foot)
    const fineGrid = new THREE.GridHelper(
      Math.max(backLen, leftLen) * 1.5,
      Math.ceil(Math.max(backLen, leftLen) * 1.5 / inToU(12)),
      0xaaaaaa,
      0xaaaaaa
    )
    fineGrid.position.set(backLen / 2, 0.001, leftLen / 2)
    ;(fineGrid.material as THREE.LineBasicMaterial).opacity = 0.5
    ;(fineGrid.material as THREE.LineBasicMaterial).transparent = true
    group.add(fineGrid)

    // Coarse grid — every 48 inches (4 feet)
    const coarseGrid = new THREE.GridHelper(
      Math.max(backLen, leftLen) * 1.5,
      Math.ceil(Math.max(backLen, leftLen) * 1.5 / inToU(48)),
      0x888888,
      0x888888
    )
    coarseGrid.position.set(backLen / 2, 0.002, leftLen / 2)
    ;(coarseGrid.material as THREE.LineBasicMaterial).opacity = 0.8
    ;(coarseGrid.material as THREE.LineBasicMaterial).transparent = true
    group.add(coarseGrid)

    // --- CEILING ---
    if (roomSpec.ceiling.type === 'flat') {
      const ceilGeo = new THREE.PlaneGeometry(backLen, leftLen)
      const ceil = new THREE.Mesh(ceilGeo, ceilMat)
      ceil.rotation.x = Math.PI / 2
      ceil.position.set(backLen / 2, hLeft, leftLen / 2)
      group.add(ceil)
    } else if (roomSpec.ceiling.type === 'shed-vault') {
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

      // Darker edge color
      const baseColor = new THREE.Color(cabColor)
      const edgeColor = baseColor.clone().multiplyScalar(0.6)

      const cabW = inToU(cab.width)   // width = runs ALONG the wall
      const cabD = inToU(cab.depth)   // depth = sticks OUT from the wall
      const h = inToU(cab.height)
      const oL = inToU(cab.offsetFromLeft)
      const oF = inToU(cab.offsetFromFloor)

      // For left/right walls: cabinet runs along Z axis (width=Z, depth=X)
      // For back/front walls: cabinet runs along X axis (width=X, depth=Z)
      let geoW: number, geoH: number, geoD: number
      if (cab.wall === 'left' || cab.wall === 'right') {
        geoW = cabD   // X axis = depth (into room)
        geoH = h
        geoD = cabW   // Z axis = width (along wall)
      } else {
        geoW = cabW   // X axis = width (along wall)
        geoH = h
        geoD = cabD   // Z axis = depth (into room)
      }

      const geo = new THREE.BoxGeometry(geoW, geoH, geoD)
      const mesh = new THREE.Mesh(geo, cabMat)
      const cabinetEdges = new THREE.EdgesGeometry(geo)
      const edgeLines = new THREE.LineSegments(
        cabinetEdges,
        new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 1 })
      )

      let cx = 0,
        cy = oF + h / 2,
        cz = 0

      if (cab.wall === 'left') {
        cx = cabD / 2                   // depth/2 from left wall (x=0)
        cz = oL + cabW / 2              // offset + width/2 along Z
      } else if (cab.wall === 'right') {
        cx = backLen - cabD / 2         // depth/2 from right wall (x=backLen)
        cz = oL + cabW / 2
      } else if (cab.wall === 'back') {
        cx = oL + cabW / 2              // offset + width/2 along X
        cz = cabD / 2                   // depth/2 from back wall (z=0)
      } else if (cab.wall === 'front') {
        cx = oL + cabW / 2
        cz = leftLen - cabD / 2         // depth/2 from front wall (z=leftLen)
      } else {
        cx = backLen / 2
        cz = leftLen / 2
      }

      mesh.position.set(cx, cy, cz)
      edgeLines.position.set(cx, cy, cz)
      group.add(mesh)
      group.add(edgeLines)

      // ── Shelf lines for tall and upper cabinets ──────────────────────
      if (cab.type === 'tall' || cab.type === 'upper') {
        const shelfCount = 4
        const shelfSpacing = h / (shelfCount + 1)
        const lineMat = new THREE.LineBasicMaterial({
          color: edgeColor,
          opacity: 0.8,
          transparent: true,
        })

        for (let s = 1; s <= shelfCount; s++) {
          const shelfY = cy - h / 2 + shelfSpacing * s
          const shelfGeo = new THREE.BufferGeometry()

          if (cab.wall === 'left' || cab.wall === 'right') {
            // Shelf runs along Z (the wall length axis)
            shelfGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
              cx, shelfY, cz - cabW / 2,
              cx, shelfY, cz + cabW / 2,
            ]), 3))
          } else {
            // Shelf runs along X (the wall length axis)
            shelfGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
              cx - cabW / 2, shelfY, cz,
              cx + cabW / 2, shelfY, cz,
            ]), 3))
          }

          const shelfLine = new THREE.Line(shelfGeo, lineMat)
          group.add(shelfLine)
        }
      }
    }

    // Reposition camera target to room center
    const cx = backLen / 2
    const cz = leftLen / 2
    if (controlsRef.current) {
      controlsRef.current.target.set(cx, hLeft * 0.4, cz)
      if (cameraRef.current) {
        const dist = Math.max(backLen, leftLen) * 1.4
        cameraRef.current.position.set(cx + dist, hLeft * 1.2, cz + dist)
        controlsRef.current.update()
      }
    }
  }, [roomSpec, cabinets]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={mountRef} className="w-full h-full bg-[#0f0f0f] relative">
      {/* Wall visibility toggle */}
      <button
        onClick={() => setWallsVisible((v) => !v)}
        className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg bg-black/70 border border-white/20 text-white text-xs font-medium hover:bg-black/90 transition-colors"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {wallsVisible ? 'Walls ●' : 'Walls ○'}
      </button>
    </div>
  )
}
