'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Cpu, MemoryStick, Clock, Brain, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  status: 'ok' | 'pending_setup' | 'error' | 'unreachable'
  message?: string
  generated_at?: string
  container?: {
    hostname: string
    uptime: { seconds: number; pretty: string }
  }
  memory?: {
    total_mb: number
    used_mb: number
    available_mb: number
    pct: number
  }
  cpu?: {
    load_1m: number
    load_5m: number
    load_15m: number
    cpu_count: number
  }
  node?: { version: string; pid: number }
  model?: string
  log_tail?: Array<{ ts: string | null; event: string; detail: string }>
}

const POLL_MS = 60_000

function formatTs(iso: string | null) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch { return iso }
}

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 8, background: '#e5e5e5', borderRadius: 4, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
    </div>
  )
}

function StatCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 14, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#7A8F9E', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {icon} {label}
      </div>
      {children}
    </div>
  )
}

export default function JasperHealth() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(POLL_MS / 1000)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/jasper-health', { cache: 'no-store' })
      const data: Stats = await res.json()
      setStats(data)
      setLastFetch(new Date())
      setCountdown(POLL_MS / 1000)
    } catch {
      setStats({ status: 'unreachable', message: 'Could not reach API', generated_at: new Date().toISOString() })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const poll = setInterval(fetchStats, POLL_MS)
    return () => clearInterval(poll)
  }, [fetchStats])

  useEffect(() => {
    const tick = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(tick)
  }, [])

  const memColor = stats?.memory ? (stats.memory.pct > 85 ? '#ef4444' : stats.memory.pct > 65 ? '#FFB366' : '#22c55e') : '#22c55e'
  const cpuLoad = stats?.cpu ? (stats.cpu.load_1m / stats.cpu.cpu_count) * 100 : 0
  const cpuColor = cpuLoad > 85 ? '#ef4444' : cpuLoad > 60 ? '#FFB366' : '#22c55e'

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', padding: '32px 20px', fontFamily: 'Inter, sans-serif', maxWidth: 900, margin: '0 auto' }}>

      {/* Back */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/workshop/personal" style={{ color: '#7A8F9E', fontSize: 14, textDecoration: 'none' }}>← Personal</Link>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>
            Jasper Health
          </h1>
          <p style={{ color: '#7A8F9E', marginTop: 6, fontSize: 14 }}>
            Container stats · read-only · no secrets
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <button
            onClick={fetchStats}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#0a0a0a', color: '#f8f7f4', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: loading ? 0.6 : 1 }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
          {lastFetch && (
            <div style={{ fontSize: 12, color: '#7A8F9E' }}>
              Updated {formatTs(lastFetch.toISOString())} · next in {countdown}s
            </div>
          )}
        </div>
      </div>

      {/* Status banner */}
      {stats && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, marginBottom: 28,
          background: stats.status === 'ok' ? '#f0fdf4' : stats.status === 'pending_setup' ? '#fefce8' : '#fef2f2',
          border: `1px solid ${stats.status === 'ok' ? '#bbf7d0' : stats.status === 'pending_setup' ? '#fef08a' : '#fecaca'}`,
        }}>
          {stats.status === 'ok'
            ? <CheckCircle size={16} color="#22c55e" />
            : stats.status === 'pending_setup'
            ? <Loader size={16} color="#eab308" />
            : <AlertCircle size={16} color="#ef4444" />}
          <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a' }}>
            {stats.status === 'ok'
              ? `Online · data as of ${formatTs(stats.generated_at || null)}`
              : stats.message || stats.status}
          </span>
        </div>
      )}

      {!stats && loading && (
        <div style={{ textAlign: 'center', padding: 60, color: '#7A8F9E' }}>Loading…</div>
      )}

      {stats?.status === 'ok' && (
        <>
          {/* Top row: uptime + model */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>

            <StatCard icon={<Clock size={14} />} label="Uptime">
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#0a0a0a', letterSpacing: -0.5 }}>
                {stats.container?.uptime.pretty ?? '—'}
              </div>
              <div style={{ fontSize: 12, color: '#7A8F9E', marginTop: 4 }}>
                host: {stats.container?.hostname}
              </div>
            </StatCard>

            <StatCard icon={<Brain size={14} />} label="Active Model">
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', wordBreak: 'break-all', lineHeight: 1.4 }}>
                {stats.model ?? '—'}
              </div>
              <div style={{ fontSize: 12, color: '#7A8F9E', marginTop: 4 }}>
                Node {stats.node?.version} · PID {stats.node?.pid}
              </div>
            </StatCard>

          </div>

          {/* Second row: memory + CPU */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>

            <StatCard icon={<MemoryStick size={14} />} label="Memory">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#0a0a0a' }}>
                  {stats.memory?.pct ?? 0}%
                </span>
                <span style={{ fontSize: 12, color: '#7A8F9E' }}>
                  {stats.memory?.used_mb ?? 0} / {stats.memory?.total_mb ?? 0} MB
                </span>
              </div>
              <Bar pct={stats.memory?.pct ?? 0} color={memColor} />
              <div style={{ fontSize: 12, color: '#7A8F9E', marginTop: 6 }}>
                {stats.memory?.available_mb ?? 0} MB available
              </div>
            </StatCard>

            <StatCard icon={<Cpu size={14} />} label="CPU Load">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#0a0a0a' }}>
                  {stats.cpu?.load_1m.toFixed(2) ?? '—'}
                </span>
                <span style={{ fontSize: 12, color: '#7A8F9E' }}>
                  {stats.cpu?.cpu_count} core{(stats.cpu?.cpu_count ?? 1) > 1 ? 's' : ''}
                </span>
              </div>
              <Bar pct={cpuLoad} color={cpuColor} />
              <div style={{ fontSize: 12, color: '#7A8F9E', marginTop: 6 }}>
                5m: {stats.cpu?.load_5m.toFixed(2)} · 15m: {stats.cpu?.load_15m.toFixed(2)}
              </div>
            </StatCard>

          </div>

          {/* Log tail */}
          {stats.log_tail && stats.log_tail.length > 0 && (
            <StatCard icon={<FileText size={14} />} label="Recent Log Entries">
              <div style={{ fontFamily: 'monospace', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {stats.log_tail.map((entry, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 110px 1fr', gap: 8, padding: '4px 0', borderBottom: i < stats.log_tail!.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <span style={{ color: '#7A8F9E' }}>{formatTs(entry.ts)}</span>
                    <span style={{ color: '#0066FF', fontWeight: 500 }}>{entry.event}</span>
                    <span style={{ color: '#0a0a0a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.detail}</span>
                  </div>
                ))}
              </div>
            </StatCard>
          )}
        </>
      )}

      {/* Pending setup instructions */}
      {stats?.status === 'pending_setup' && (
        <div style={{ background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', margin: '0 0 12px', color: '#0a0a0a' }}>Setup Required</h3>
          <p style={{ color: '#7A8F9E', fontSize: 14, margin: '0 0 16px' }}>
            Three steps to complete on the host. See <code>/data/projects/jasper-health/README.md</code> for full details.
          </p>
          <ol style={{ color: '#0a0a0a', fontSize: 14, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
            <li>Start the stats server: <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>bash /data/projects/jasper-health/start.sh</code></li>
            <li>Add Caddy reverse proxy block (see README)</li>
            <li>Add <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>JASPER_STATS_URL</code> to Vercel env vars</li>
          </ol>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
