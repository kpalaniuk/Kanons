'use client'

import { useState } from 'react'

interface FormData {
  // Cabinet construction constraints
  minDrawerWidth: string
  minDrawerHeight: string
  minCabinetWidth: string
  maxSpanWithoutSupport: string
  minUpperCabinetDepth: string
  standardBaseDepth: string
  standardUpperDepth: string
  toeKickHeight: string
  toeKickDepth: string

  // Materials
  primaryMaterial: string
  sheetSize: string
  materialThickness: string
  edgeBandingThickness: string

  // Hardware
  drawerSlideOptions: string
  hingeOptions: string
  minimumDoorWidth: string
  minimumDoorHeight: string

  // Structural
  maxUpperCabinetHeight: string
  requiresMiddleShelf: string
  maxShelfSpanWithoutBrace: string

  // Things that simply can't be done
  hardConstraints: string

  // CNC / fabrication
  hasCNC: string
  cncDetails: string
  preferredJoinery: string

  // Countertops
  countertopThickness: string
  countertopOverhang: string
  sinkCutoutNotes: string

  // Countertop options
  countertopMaterials: string
  countertopEdgeProfiles: string
  countertopPriceRange: string

  // Cabinet finishes / styles available
  cabinetStyles: string
  cabinetFinishes: string
  paintOrStainOptions: string
  customColorProcess: string

  // Hardware catalog
  pullsAndKnobs: string
  drawerOrganizers: string
  specialtyHardware: string

  // Special builds
  murphyBedExperience: string
  murphyBedSizes: string
  openShelvingOptions: string
  glassInsertOptions: string
  lightingIntegration: string

  // Pricing
  laborRatePerHour: string
  materialMarkup: string
  leadTime: string
  depositRequired: string

  // Communication preferences
  preferredContact: string
  notes: string
}

const INITIAL: FormData = {
  minDrawerWidth: '',
  minDrawerHeight: '',
  minCabinetWidth: '',
  maxSpanWithoutSupport: '',
  minUpperCabinetDepth: '',
  standardBaseDepth: '',
  standardUpperDepth: '',
  toeKickHeight: '',
  toeKickDepth: '',
  primaryMaterial: '',
  sheetSize: '',
  materialThickness: '',
  edgeBandingThickness: '',
  drawerSlideOptions: '',
  hingeOptions: '',
  minimumDoorWidth: '',
  minimumDoorHeight: '',
  maxUpperCabinetHeight: '',
  requiresMiddleShelf: '',
  maxShelfSpanWithoutBrace: '',
  hardConstraints: '',
  hasCNC: '',
  cncDetails: '',
  preferredJoinery: '',
  countertopThickness: '',
  countertopOverhang: '',
  sinkCutoutNotes: '',
  countertopMaterials: '',
  countertopEdgeProfiles: '',
  countertopPriceRange: '',
  cabinetStyles: '',
  cabinetFinishes: '',
  paintOrStainOptions: '',
  customColorProcess: '',
  pullsAndKnobs: '',
  drawerOrganizers: '',
  specialtyHardware: '',
  murphyBedExperience: '',
  murphyBedSizes: '',
  openShelvingOptions: '',
  glassInsertOptions: '',
  lightingIntegration: '',
  laborRatePerHour: '',
  materialMarkup: '',
  leadTime: '',
  depositRequired: '',
  preferredContact: '',
  notes: '',
}

export default function RoomforgeOnboard() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('/api/roomforge-onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      alert('Something went wrong — please try again or text Kyle directly.')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-6">🪵</div>
          <h1 className="font-display text-3xl text-midnight mb-4">That&apos;s exactly what we needed.</h1>
          <p className="text-midnight/60 leading-relaxed mb-6">
            Your answers just became the brain of RoomForge. Kyle and Paige will review everything and be in touch soon. This is going to be something special.
          </p>
          <p className="text-sm text-midnight/40">— The RoomForge Team</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="bg-midnight text-cream px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber/20 text-amber px-3 py-1 rounded-full text-sm font-semibold mb-6">
            🪵 RoomForge — Cabinet Maker Onboarding
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6 leading-tight">
            David, you're why this exists.
          </h1>
          <div className="space-y-4 text-cream/75 leading-relaxed text-sm md:text-base">
            <p>
              When Paige and I were trying to design the cabinets for our home, the whole process felt impossible — clunky software, guesswork on dimensions, back-and-forth that went nowhere. Then you walked in and said <em>"yes, I can build whatever you want"</em> with the kind of energy that made us actually believe it.
            </p>
            <p>
              That moment is why I&apos;m building this. <strong className="text-cream">RoomForge</strong> is a tool Paige will use as an interior designer — clients take photos of their space, describe what they want, and the AI helps them visualize exactly how custom built-ins will look before a single cut is made. Paige runs it through <strong className="text-cream">Granada House Design</strong>. You build what comes out of it.
            </p>
            <p>
              The goal is simple: make it so the gap between "I can imagine it" and "here are the exact dimensions to build it" basically disappears.
            </p>
            <p>
              But the AI needs to know what's actually <em>possible</em> — and that&apos;s you. Your constraints become the rules the system follows. If someone asks for 24 three-inch drawer units side-by-side on a 6-foot wall, the AI should push back the same way you would.
            </p>
            <p>
              Take your time with this. Every answer shapes how the tool works. And yes — if this takes off, you're the cabinet maker behind it.
            </p>
            <p className="text-cream/50 text-sm">— Kyle</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-12 space-y-10">

        {/* Standard Dimensions */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Standard Dimensions</h2>
          <p className="text-midnight/50 text-sm mb-6">Your go-to starting points. What do you build most often?</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'standardBaseDepth', label: 'Standard base cabinet depth', placeholder: 'e.g. 24"' },
              { key: 'standardUpperDepth', label: 'Standard upper cabinet depth', placeholder: 'e.g. 12"' },
              { key: 'toeKickHeight', label: 'Toe kick height', placeholder: 'e.g. 3.5"' },
              { key: 'toeKickDepth', label: 'Toe kick depth (setback)', placeholder: 'e.g. 3"' },
              { key: 'countertopThickness', label: 'Countertop thickness', placeholder: 'e.g. 1.5"' },
              { key: 'countertopOverhang', label: 'Standard countertop overhang', placeholder: 'e.g. 1.5"' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof FormData]}
                  onChange={set(key as keyof FormData)}
                  className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Minimum Constraints */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Minimum Constraints</h2>
          <p className="text-midnight/50 text-sm mb-6">What's the smallest something can physically be and still work?</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'minDrawerWidth', label: 'Minimum functional drawer width', placeholder: 'e.g. 9"' },
              { key: 'minDrawerHeight', label: 'Minimum drawer height (front face)', placeholder: 'e.g. 4"' },
              { key: 'minCabinetWidth', label: 'Minimum cabinet box width', placeholder: 'e.g. 9"' },
              { key: 'minUpperCabinetDepth', label: 'Minimum upper cabinet depth', placeholder: 'e.g. 10"' },
              { key: 'minimumDoorWidth', label: 'Minimum door width', placeholder: 'e.g. 8"' },
              { key: 'minimumDoorHeight', label: 'Minimum door height', placeholder: 'e.g. 12"' },
              { key: 'maxSpanWithoutSupport', label: 'Max shelf span without center support', placeholder: 'e.g. 36"' },
              { key: 'maxShelfSpanWithoutBrace', label: 'Max upper cabinet span without wall brace', placeholder: 'e.g. 48"' },
              { key: 'maxUpperCabinetHeight', label: 'Max single upper cabinet height (doors)', placeholder: 'e.g. 48"' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof FormData]}
                  onChange={set(key as keyof FormData)}
                  className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Materials */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Materials</h2>
          <p className="text-midnight/50 text-sm mb-6">What you&apos;re typically working with.</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'primaryMaterial', label: 'Primary material', placeholder: 'e.g. 3/4" laminated birch plywood' },
              { key: 'sheetSize', label: 'Standard sheet size', placeholder: 'e.g. 4x8' },
              { key: 'materialThickness', label: 'Material thickness', placeholder: 'e.g. 3/4"' },
              { key: 'edgeBandingThickness', label: 'Edge banding thickness', placeholder: 'e.g. 1/32" PVC' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof FormData]}
                  onChange={set(key as keyof FormData)}
                  className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Hardware */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Hardware</h2>
          <p className="text-midnight/50 text-sm mb-6">Slides, hinges, and what you prefer to work with.</p>
          <div className="space-y-4">
            {[
              { key: 'drawerSlideOptions', label: 'Drawer slide brands/types you use', placeholder: 'e.g. Blum Tandem, undermount, soft-close standard', large: true },
              { key: 'hingeOptions', label: 'Hinge types/brands you prefer', placeholder: 'e.g. Blum clip-top, 110° concealed, soft-close', large: true },
              { key: 'requiresMiddleShelf', label: 'When do you require a middle shelf in a cabinet?', placeholder: 'e.g. Any cabinet over 30" tall gets a fixed middle shelf', large: true },
            ].map(({ key, label, placeholder, large }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">{label}</label>
                {large ? (
                  <textarea
                    placeholder={placeholder}
                    value={form[key as keyof FormData]}
                    onChange={set(key as keyof FormData)}
                    rows={2}
                    className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none"
                  />
                ) : (
                  <input type="text" placeholder={placeholder} value={form[key as keyof FormData]} onChange={set(key as keyof FormData)}
                    className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Fabrication */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Fabrication</h2>
          <p className="text-midnight/50 text-sm mb-6">How you build and what helps the cut list work for you.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Do you use a CNC router?</label>
              <select value={form.hasCNC} onChange={set('hasCNC')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber">
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No — table saw / track saw</option>
                <option value="sometimes">Sometimes — I have access to one</option>
              </select>
            </div>
            {form.hasCNC === 'yes' || form.hasCNC === 'sometimes' ? (
              <div>
                <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">CNC details (machine, kerf width, file format needed)</label>
                <textarea value={form.cncDetails} onChange={set('cncDetails')} rows={2} placeholder="e.g. ShopBot, 1/8in bit, exports DXF or SVG"
                  className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none" />
              </div>
            ) : null}
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Preferred joinery method</label>
              <input type="text" placeholder="e.g. Pocket screws + glue, dowels, dado joints" value={form.preferredJoinery} onChange={set('preferredJoinery')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
          </div>
        </section>

        {/* Sink/countertop */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Sinks & Countertops</h2>
          <div>
            <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Notes on sink cutouts, undermount vs drop-in, anything to know</label>
            <textarea value={form.sinkCutoutNotes} onChange={set('sinkCutoutNotes')} rows={2}
              placeholder="e.g. I always do undermount, need 1.5in lip minimum from edge for granite"
              className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none" />
          </div>
        </section>

        {/* Countertop options */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Countertop Options</h2>
          <p className="text-midnight/50 text-sm mb-6">What materials and styles can you work with or source?</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Countertop materials you can source / install</label>
              <textarea value={form.countertopMaterials} onChange={set('countertopMaterials')} rows={2}
                placeholder="e.g. Butcher block, laminate, quartz (via sub), concrete, tile — list what you can do directly vs. what needs a sub-contractor"
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Edge profiles available</label>
              <input type="text" placeholder="e.g. Square, eased, bullnose, ogee, waterfall"
                value={form.countertopEdgeProfiles} onChange={set('countertopEdgeProfiles')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Rough price range per linear foot (installed)</label>
              <input type="text" placeholder="e.g. Butcher block $40-80/lft, laminate $20-40/lft"
                value={form.countertopPriceRange} onChange={set('countertopPriceRange')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
          </div>
        </section>

        {/* Cabinet styles and finishes */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Cabinet Styles & Finishes</h2>
          <p className="text-midnight/50 text-sm mb-6">What styles can you build and what finish options do you offer?</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Cabinet door styles you build</label>
              <textarea value={form.cabinetStyles} onChange={set('cabinetStyles')} rows={2}
                placeholder="e.g. Flat slab, shaker (5-piece), euro frameless, raised panel, beadboard inset, open (no doors)"
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Finish options (what can clients choose from?)</label>
              <textarea value={form.cabinetFinishes} onChange={set('cabinetFinishes')} rows={2}
                placeholder="e.g. Natural birch (clear coat), white paint, navy paint, custom color, wood veneer, melamine"
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Paint / stain process — do you spray, brush, or sub it out?</label>
              <input type="text" placeholder="e.g. Spray in shop, 2-coat lacquer; stain + poly by hand"
                value={form.paintOrStainOptions} onChange={set('paintOrStainOptions')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Custom colors — how does that work? (RAL, Sherwin-Williams match, etc.)</label>
              <input type="text" placeholder="e.g. Client picks any SW color, we mix a tinted lacquer"
                value={form.customColorProcess} onChange={set('customColorProcess')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
          </div>
        </section>

        {/* Hardware catalog */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Hardware & Accessories</h2>
          <p className="text-midnight/50 text-sm mb-6">What options do clients have for the finishing touches?</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Pulls, knobs, and handles — brands or styles you stock/source</label>
              <textarea value={form.pullsAndKnobs} onChange={set('pullsAndKnobs')} rows={2}
                placeholder="e.g. Richelieu catalog, client supplies their own, simple bar pulls standard"
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Drawer organizers / inserts you can build or source</label>
              <input type="text" placeholder="e.g. Peg drawer inserts, knife blocks, pull-out trash, cutlery dividers"
                value={form.drawerOrganizers} onChange={set('drawerOrganizers')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Specialty hardware (lazy susans, pull-out shelves, blind corner units, etc.)</label>
              <textarea value={form.specialtyHardware} onChange={set('specialtyHardware')} rows={2}
                placeholder="e.g. Rev-A-Shelf pull-outs, Blum Aventos lift systems, lazy susans, magic corners"
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Glass inserts — can you do them? What types?</label>
              <input type="text" placeholder="e.g. Clear glass, frosted, reed — I supply the frame, client sources glass OR I sub it"
                value={form.glassInsertOptions} onChange={set('glassInsertOptions')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Under-cabinet or interior lighting — can you integrate it?</label>
              <input type="text" placeholder="e.g. I rough in the channel, electrician finishes; or I do full LED strip integration"
                value={form.lightingIntegration} onChange={set('lightingIntegration')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
          </div>
        </section>

        {/* Special builds */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Special Builds</h2>
          <p className="text-midnight/50 text-sm mb-6">Murphy beds, open shelving, and anything beyond standard cabinets.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Murphy bed experience — have you built them? What hardware do you use?</label>
              <textarea value={form.murphyBedExperience} onChange={set('murphyBedExperience')} rows={2}
                placeholder="e.g. Yes, use Wallbeds hardware kit, I build the surround cabinet — or No, haven't done these yet"
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Murphy bed sizes you can do (twin/full/queen/king)</label>
              <input type="text" placeholder="e.g. Twin, full, queen — king requires extra wall backing"
                value={form.murphyBedSizes} onChange={set('murphyBedSizes')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Open shelving — floating shelves, bracket types, max span</label>
              <input type="text" placeholder="e.g. Up to 48in floating with proper wall anchors, live edge slabs available"
                value={form.openShelvingOptions} onChange={set('openShelvingOptions')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
          </div>
        </section>

        {/* Pricing and process */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">Pricing & Process</h2>
          <p className="text-midnight/50 text-sm mb-6">Rough numbers help the AI generate realistic estimates for clients. These are internal only.</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'laborRatePerHour', label: 'Rough labor rate ($/hr)', placeholder: 'e.g. $75-95/hr' },
              { key: 'materialMarkup', label: 'Material markup %', placeholder: 'e.g. 20%' },
              { key: 'leadTime', label: 'Typical lead time from deposit', placeholder: 'e.g. 4-6 weeks' },
              { key: 'depositRequired', label: 'Deposit required to start', placeholder: 'e.g. 50% upfront' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">{label}</label>
                <input type="text" placeholder={placeholder} value={form[key as keyof FormData]} onChange={set(key as keyof FormData)}
                  className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
              </div>
            ))}
          </div>
        </section>

        {/* Hard constraints */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">The "That&apos;s Not Possible" List</h2>
          <p className="text-midnight/50 text-sm mb-4">
            What are the things that clients ask for that physically won't work, or that you'd push back on hard?
            The AI needs to know these so it can tell designers before they get excited about something that can't be built.
          </p>
          <textarea
            value={form.hardConstraints}
            onChange={set('hardConstraints')}
            rows={5}
            placeholder={`Examples:\n- Can't do drawers narrower than 9" — slides don't fit\n- Upper cabinets over 54" tall are too heavy for standard wall mounting\n- Murphy beds need minimum 84" ceiling clearance for a queen\n- Can't span more than 36" without a vertical divider on a shelf\n- Add yours here...`}
            className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none"
          />
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-display text-xl text-midnight mb-1">How to Reach You</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Best way to follow up (phone, email, text)</label>
              <input type="text" placeholder="e.g. Text me at (619) 555-1234" value={form.preferredContact} onChange={set('preferredContact')}
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-midnight/60 mb-1 uppercase tracking-wider">Anything else we should know?</label>
              <textarea value={form.notes} onChange={set('notes')} rows={3} placeholder="Anything at all — process notes, preferences, questions for us..."
                className="w-full border border-midnight/20 rounded-lg px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-amber resize-none" />
            </div>
          </div>
        </section>

        <button type="submit" disabled={submitting}
          className="w-full bg-midnight text-cream font-semibold py-4 rounded-xl hover:bg-midnight/90 transition-colors disabled:opacity-50 text-sm tracking-wide">
          {submitting ? 'Sending...' : 'Submit → Build the Brain'}
        </button>

        <p className="text-center text-xs text-midnight/30 pb-8">
          This goes directly to Kyle and Paige. Nothing is public.
        </p>
      </form>
    </div>
  )
}
