'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, Environment, ContactShadows, Bounds, useBounds } from '@react-three/drei'
import * as THREE from 'three'

type AnimState = 'idle' | 'listening' | 'processing' | 'speaking'

const ANIM_MAP: Record<AnimState, { body: string; face: string }> = {
  idle:       { body: 'idle',       face: 'idle_face' },
  listening:  { body: 'listening',  face: 'listening_face' },
  processing: { body: 'processing', face: 'processing_face' },
  speaking:   { body: 'speaking',   face: 'speaking_face' },
}

const STATE_COLORS: Record<AnimState, string> = {
  idle:       '#7A8F9E',
  listening:  '#0066FF',
  processing: '#FFBA00',
  speaking:   '#22E8E8',
}

const STATE_LABELS: Record<AnimState, string> = {
  idle:       '😌 Idle',
  listening:  '👂 Listening',
  processing: '🤔 Processing',
  speaking:   '🗣 Speaking',
}

// Inner component — auto-fits camera on load via Bounds
function AutoFitModel({ state, url }: { state: AnimState; url: string }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, group)
  const prevState = useRef<AnimState>('idle')
  const bounds = useBounds()

  // Auto-fit camera once model is loaded
  useEffect(() => {
    if (scene) {
      bounds.refresh().fit()
    }
  }, [scene, bounds])

  // Start idle on mount
  useEffect(() => {
    if (!actions) return
    const idleBody = actions['idle']
    const idleFace = actions['idle_face']
    if (idleBody) { idleBody.reset().play(); idleBody.setLoop(THREE.LoopRepeat, Infinity) }
    if (idleFace) { idleFace.reset().play(); idleFace.setLoop(THREE.LoopRepeat, Infinity) }
  }, [actions])

  // Crossfade to new state
  useEffect(() => {
    if (!actions) return
    if (prevState.current === state) return
    const prev = ANIM_MAP[prevState.current]
    const next = ANIM_MAP[state]
    actions[prev.body]?.fadeOut(0.5)
    actions[prev.face]?.fadeOut(0.5)
    const nb = actions[next.body]
    const nf = actions[next.face]
    if (nb) { nb.reset().fadeIn(0.5).play(); nb.setLoop(THREE.LoopRepeat, Infinity) }
    if (nf) { nf.reset().fadeIn(0.5).play(); nf.setLoop(THREE.LoopRepeat, Infinity) }
    prevState.current = state
  }, [state, actions])

  // Subtle idle float — only Y drift, no rotation (orbit controls handles rotation)
  useFrame(() => {
    if (group.current) {
      group.current.position.y = Math.sin(Date.now() * 0.0008) * 0.015
    }
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

export default function LOBuddyAvatar() {
  const [state, setState] = useState<AnimState>('idle')
  const [autoDemo, setAutoDemo] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const states: AnimState[] = ['idle', 'listening', 'processing', 'speaking']

  useEffect(() => {
    if (autoDemo) {
      let i = 0
      intervalRef.current = setInterval(() => {
        i = (i + 1) % states.length
        setState(states[i])
      }, 3500)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoDemo])

  return (
    <div style={{
      background: '#0a0a0a',
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Portrait 3D Viewport */}
      <div style={{ position: 'relative', height: 640 }}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 42 }}
          style={{ background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)' }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow />
          <directionalLight position={[-3, 2, -3]} intensity={0.35} color="#3366ff" />
          <pointLight position={[0, 3, 2]} intensity={0.4} color="#ffffff" />

          {/* Bounds auto-fits camera to model bounding box */}
          <Bounds fit clip observe margin={1.15}>
            <AutoFitModel state={state} url="/assets/lo-buddy-character/3d/lo-buddy-animated.glb" />
          </Bounds>

          <ContactShadows position={[0, -1.05, 0]} opacity={0.45} blur={2.5} scale={3} />
          <Environment preset="city" />

          <OrbitControls
            enablePan={false}
            minDistance={1.5}
            maxDistance={8}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 1.7}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>

        {/* State badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
          borderRadius: 8, padding: '7px 12px',
          border: `1px solid ${STATE_COLORS[state]}33`,
        }}>
          <div style={{
            width: 9, height: 9, borderRadius: '50%',
            background: STATE_COLORS[state],
            boxShadow: `0 0 8px ${STATE_COLORS[state]}`,
          }} />
          <span style={{ color: '#f8f7f4', fontSize: 12, fontWeight: 600 }}>
            {STATE_LABELS[state]}
          </span>
        </div>

        {/* Hint */}
        <div style={{
          position: 'absolute', bottom: 12, right: 14,
          color: 'rgba(255,255,255,0.2)', fontSize: 11,
        }}>
          drag to rotate · scroll to zoom
        </div>
      </div>

      {/* Controls row */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        background: '#111',
      }}>
        {states.map(s => (
          <button
            key={s}
            onClick={() => { setAutoDemo(false); setState(s) }}
            style={{
              padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
              transition: 'all 0.15s',
              background: state === s ? STATE_COLORS[s] : 'rgba(255,255,255,0.07)',
              color: state === s ? '#0a0a0a' : '#7A8F9E',
              outline: state === s ? `1.5px solid ${STATE_COLORS[s]}` : 'none',
            }}
          >
            {s}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setAutoDemo(!autoDemo)}
          style={{
            padding: '7px 14px', borderRadius: 7,
            border: `1.5px solid ${autoDemo ? '#22E8E8' : 'rgba(255,255,255,0.15)'}`,
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            background: autoDemo ? 'rgba(34,232,232,0.12)' : 'transparent',
            color: autoDemo ? '#22E8E8' : '#7A8F9E',
            transition: 'all 0.15s',
          }}
        >
          {autoDemo ? '⏸ Stop Demo' : '▶ Auto Demo'}
        </button>
      </div>
    </div>
  )
}
