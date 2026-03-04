'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

type AnimState = 'idle' | 'listening' | 'processing' | 'speaking'

const ANIM_MAP: Record<AnimState, { body: string; face: string }> = {
  idle:       { body: 'idle',       face: 'idle_face' },
  listening:  { body: 'listening',  face: 'listening_face' },
  processing: { body: 'processing', face: 'processing_face' },
  speaking:   { body: 'speaking',   face: 'speaking_face' },
}

const STATE_COLORS: Record<AnimState, string> = {
  idle: '#7A8F9E',
  listening: '#0066FF',
  processing: '#FFBA00',
  speaking: '#22E8E8',
}

function Model({ state, url }: { state: AnimState; url: string }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(url)
  const { actions, mixer } = useAnimations(animations, group)
  const prevState = useRef<AnimState>('idle')

  useEffect(() => {
    if (!actions) return

    const config = ANIM_MAP[state]
    const prevConfig = ANIM_MAP[prevState.current]

    // Fade out previous animations
    const prevBody = actions[prevConfig.body]
    const prevFace = actions[prevConfig.face]
    if (prevBody) prevBody.fadeOut(0.4)
    if (prevFace) prevFace.fadeOut(0.4)

    // Fade in new animations
    const newBody = actions[config.body]
    const newFace = actions[config.face]

    if (newBody) {
      newBody.reset().fadeIn(0.4).play()
      newBody.setLoop(THREE.LoopRepeat, Infinity)
    }
    if (newFace) {
      newFace.reset().fadeIn(0.4).play()
      newFace.setLoop(THREE.LoopRepeat, Infinity)
    }

    prevState.current = state
  }, [state, actions])

  // Start idle on mount
  useEffect(() => {
    if (!actions) return
    const idleBody = actions['idle']
    const idleFace = actions['idle_face']
    if (idleBody) { idleBody.play(); idleBody.setLoop(THREE.LoopRepeat, Infinity) }
    if (idleFace) { idleFace.play(); idleFace.setLoop(THREE.LoopRepeat, Infinity) }
  }, [actions])

  // Gentle floating motion
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(Date.now() * 0.0005) * 0.05
      group.current.position.y = Math.sin(Date.now() * 0.001) * 0.02
    }
  })

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.8} position={[0, -1.8, 0]} />
    </group>
  )
}

export default function LOBuddyAvatar() {
  const [state, setState] = useState<AnimState>('idle')
  const [autoDemo, setAutoDemo] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const states: AnimState[] = ['idle', 'listening', 'processing', 'speaking']

  // Auto-demo cycles through states
  useEffect(() => {
    if (autoDemo) {
      let i = 0
      intervalRef.current = setInterval(() => {
        i = (i + 1) % states.length
        setState(states[i])
      }, 3000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoDemo])

  return (
    <div style={{ background: '#0a0a0a', borderRadius: 16, overflow: 'hidden' }}>
      {/* 3D Viewport */}
      <div style={{ height: 500, position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 0.3, 3.8], fov: 40 }}
          style={{ background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#4488ff" />
          <Model
            state={state}
            url="/assets/lo-buddy-character/3d/lo-buddy-animated.glb"
          />
          <ContactShadows position={[0, -1.8, 0]} opacity={0.4} blur={2} />
          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={6}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.8}
            target={[0, 0.2, 0]}
          />
        </Canvas>

        {/* State indicator */}
        <div style={{
          position: 'absolute', top: 16, left: 16,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '8px 14px',
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: STATE_COLORS[state],
            boxShadow: `0 0 8px ${STATE_COLORS[state]}`,
            animation: state !== 'idle' ? 'pulse 1.5s ease-in-out infinite' : undefined,
          }} />
          <span style={{ color: '#f8f7f4', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
            {state}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        {states.map(s => (
          <button
            key={s}
            onClick={() => { setAutoDemo(false); setState(s) }}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
              transition: 'all 0.15s',
              background: state === s ? STATE_COLORS[s] : 'rgba(255,255,255,0.08)',
              color: state === s ? '#0a0a0a' : '#7A8F9E',
            }}
          >
            {s}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setAutoDemo(!autoDemo)}
          style={{
            padding: '8px 16px', borderRadius: 8, border: '1.5px solid',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
            transition: 'all 0.15s',
            background: autoDemo ? 'rgba(34,232,232,0.15)' : 'transparent',
            color: autoDemo ? '#22E8E8' : '#7A8F9E',
            borderColor: autoDemo ? '#22E8E8' : 'rgba(255,255,255,0.15)',
          }}
        >
          {autoDemo ? '⏸ Stop Demo' : '▶ Auto Demo'}
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
