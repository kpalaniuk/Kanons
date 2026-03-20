import Link from 'next/link'
import { FileText, MessageSquare, ArrowRight } from 'lucide-react'

const specs = [
  {
    href: '/workshop/pph/specs/sms-inbox',
    title: 'SMS Inbox Redesign',
    description: 'Threaded conversation hub — split-pane layout, unread tracking, auto-drafts, spam detection, name reconciliation. 8-phase implementation plan.',
    date: 'Mar 19, 2026',
    status: 'Ready to Build',
    statusColor: 'bg-green-100 text-green-700',
    icon: MessageSquare,
  },
]

export default function SpecsIndex() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-ocean/10 rounded-xl flex items-center justify-center">
            <FileText className="text-ocean" size={20} />
          </div>
          <h1 className="font-display text-3xl text-midnight">LO Buddy Build Specs</h1>
        </div>
        <p className="text-midnight/50 text-sm">Technical specs and build plans — authored by LOB-Jasper, reviewed by Kyle.</p>
      </div>

      <div className="space-y-4">
        {specs.map((spec) => (
          <Link
            key={spec.href}
            href={spec.href}
            className="group block bg-white rounded-2xl p-6 border border-midnight/8 hover:border-ocean/30 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-ocean/5 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <spec.icon className="text-ocean" size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-semibold text-midnight group-hover:text-ocean transition-colors">{spec.title}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${spec.statusColor}`}>{spec.status}</span>
                  </div>
                  <p className="text-sm text-midnight/60 mb-2">{spec.description}</p>
                  <p className="text-xs text-midnight/30">{spec.date}</p>
                </div>
              </div>
              <ArrowRight className="text-midnight/20 group-hover:text-ocean transition-colors flex-shrink-0 mt-1" size={18} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
