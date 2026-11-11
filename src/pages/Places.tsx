import { useState } from 'react'
import { cities, places } from '../data/places'
import PlaceCard from '../components/PlaceCard'
import type { CityId } from '../data/types'

export default function Places() {
  const [city, setCity] = useState<CityId>('kunming')
  const c = cities.find((x) => x.id === city)!
  return (
    <section>
      <div className="seg">
        {cities.map((x) => (
          <button key={x.id} className={x.id === city ? 'on' : ''} onClick={() => setCity(x.id)}>
            {x.th}
          </button>
        ))}
      </div>
      <p className="muted">
        {c.zh} · สูง {c.altitude} · {c.weather}
      </p>
      <p>{c.tip}</p>
      {city === 'dali' && <img className="img map" src="/maps/dali.png" alt="แผนที่สถานที่ท่องเที่ยวต้าลี่" />}
      {places
        .filter((p) => p.city === city)
        .map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
    </section>
  )
}
