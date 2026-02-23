'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AirStepSetupPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back nav */}
        <Link
          href="/workshop/personal"
          className="inline-flex items-center gap-2 text-steel hover:text-midnight transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Personal
        </Link>

        <h1 className="font-display text-3xl text-midnight mb-2">
          AIRSTEP + AUM Trumpet Rig
        </h1>
        <p className="text-midnight/50 mb-8">
          Setup guide for XSONIC AIRSTEP, M-Audio expression pedal, Scarlett interface, trumpet mic, AUM on iPad
        </p>

        <div className="space-y-8">
          {/* Section 1 */}
          <Section title="1. Connect AIRSTEP via Bluetooth MIDI">
            <ol className="list-decimal list-inside space-y-2 text-midnight/80">
              <li>On iPad → <strong>Settings → Bluetooth</strong> — pair the AIRSTEP first</li>
              <li>Open <strong>AUM</strong> → tap the <strong>MIDI icon</strong> (top bar) → <strong>Bluetooth MIDI</strong></li>
              <li>Your AIRSTEP should appear — tap to connect</li>
              <li>AUM now sees the AIRSTEP as a standard MIDI device via CoreMIDI (no adapter needed)</li>
            </ol>
          </Section>

          {/* Section 2 */}
          <Section title="2. Set Up Delay Toggle (On/Off)">
            <ol className="list-decimal list-inside space-y-2 text-midnight/80">
              <li>In AUM, load your delay plugin on the trumpet mic channel (or bus)</li>
              <li><strong>Long-press the power button</strong> on the delay plugin → tap <strong>MIDI Learn</strong></li>
              <li>Step on the AIRSTEP button you want to assign</li>
              <li>Done — that button now toggles the delay bypass on/off</li>
            </ol>
          </Section>

          {/* Section 3 */}
          <Section title="3. Expression Pedal for Volume (M-Audio → AIRSTEP EXP)">
            <h4 className="font-medium text-midnight mb-2">Hardware</h4>
            <p className="text-midnight/80 mb-4">
              Plug the M-Audio expression pedal into the <strong>EXP jack</strong> on the AIRSTEP (standard TRS)
            </p>

            <h4 className="font-medium text-midnight mb-2">AIRSTEP App Config</h4>
            <ol className="list-decimal list-inside space-y-2 text-midnight/80 mb-4">
              <li>Open the AIRSTEP app → navigate to the EXP pedal settings</li>
              <li>Set output to <strong>CC#7</strong> (MIDI volume) on your chosen MIDI channel</li>
              <li>If the pedal responds backwards → <strong>flip the polarity</strong> in the app</li>
              <li>Optional: set <strong>min/max CC range</strong> (e.g., 60–127) so you never cut signal completely mid-performance</li>
            </ol>

            <h4 className="font-medium text-midnight mb-2">AUM MIDI Learn</h4>
            <ol className="list-decimal list-inside space-y-2 text-midnight/80">
              <li>In AUM → <strong>long-press the channel fader</strong> on your trumpet mic channel</li>
              <li>Tap <strong>MIDI Learn</strong></li>
              <li>Sweep the expression pedal through its range</li>
              <li>Done — toe down = full volume, heel = minimum</li>
            </ol>
          </Section>

          {/* Section 4 - Signal Chain */}
          <Section title="4. Signal Chain">
            <div className="bg-midnight/5 rounded-xl p-4 font-mono text-sm text-midnight/70 space-y-1">
              <p>Trumpet Mic → Scarlett Interface → AUM (trumpet channel)</p>
              <p className="pl-40">↓</p>
              <p className="pl-32">[Reverb — send/return bus]</p>
              <p className="pl-32">[Delay — on channel or bus, MIDI toggled]</p>
              <p className="pl-40">↓</p>
              <p className="pl-36">Main Out</p>
            </div>
            <div className="mt-4 text-midnight/80">
              <p><strong>AIRSTEP controls:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><strong>Button</strong> → Delay on/off (bypass toggle)</li>
                <li><strong>EXP Pedal</strong> → Channel volume (CC#7)</li>
              </ul>
            </div>
          </Section>

          {/* Section 5 - Reverb */}
          <Section title="5. Reverb Recommendations (AUv3)">
            <p className="text-midnight/60 mb-3">Load on a bus send in AUM</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-midnight/10">
                    <th className="text-left py-2 pr-4 font-medium text-midnight">Plugin</th>
                    <th className="text-left py-2 pr-4 font-medium text-midnight">Price</th>
                    <th className="text-left py-2 font-medium text-midnight">Best For</th>
                  </tr>
                </thead>
                <tbody className="text-midnight/70">
                  <tr className="border-b border-midnight/5">
                    <td className="py-2 pr-4 font-medium">Valhalla Vintage Verb</td>
                    <td className="py-2 pr-4">~$20</td>
                    <td className="py-2">Best all-around — warm, musical, realistic rooms</td>
                  </tr>
                  <tr className="border-b border-midnight/5">
                    <td className="py-2 pr-4 font-medium">FabFilter Pro-R</td>
                    <td className="py-2 pr-4">~$30</td>
                    <td className="py-2">Most transparent/musical, great Space + Character</td>
                  </tr>
                  <tr className="border-b border-midnight/5">
                    <td className="py-2 pr-4 font-medium">Eventide SP2016</td>
                    <td className="py-2 pr-4">~$20</td>
                    <td className="py-2">Classic studio algorithms — Room mode gorgeous on brass</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">Eventide Blackhole</td>
                    <td className="py-2 pr-4">~$10</td>
                    <td className="py-2">Ambient/lush — big ethereal sound, stunning for trumpet</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-midnight/60 text-sm">
              Recommended starting point: <strong>Valhalla Vintage Verb</strong> — best price-to-quality for trumpet in a live AUM setup.
            </p>
          </Section>

          {/* Tips */}
          <Section title="Tips">
            <ul className="list-disc list-inside space-y-2 text-midnight/80">
              <li>Set up the AIRSTEP layout in the AIRSTEP app before your session — label each button by function</li>
              <li>Run reverb on a <strong>bus send</strong> (not directly on the channel) so you can blend wet/dry</li>
              <li>Test expression pedal sweep range in a quiet moment before performing</li>
              <li>The AIRSTEP can forward MIDI from its 5-pin/USB input to Bluetooth output — useful for adding more controllers later</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="font-display text-xl text-midnight mb-4">{title}</h2>
      {children}
    </div>
  );
}
