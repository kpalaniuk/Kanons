export const BANDS = ['Neo-Somatic', 'StronGnome', 'Personal', 'Well Well Well', 'Tu Lengua', 'Covers'] as const
export type Band = typeof BANDS[number]

export const BAND_ORDER: Record<Band, number> = {
  'Neo-Somatic': 0,
  'StronGnome': 1,
  'Personal': 2,
  'Well Well Well': 3,
  'Tu Lengua': 4,
  'Covers': 5,
}
