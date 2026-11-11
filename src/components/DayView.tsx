import { Link } from 'react-router-dom'
import type { Day } from '../data/types'
import { cityById, placeById } from '../data/places'
import PlaceCard from './PlaceCard'
import TrainNote from './TrainNote'
import { fmtDate } from '../lib'

export default function DayView({ day }: { day: Day }) {
  const city = cityById(day.city)
  return (
    <section>
      <p className="muted">
        {fmtDate(day.date)} · {city.th} {city.zh} · {city.altitude}
      </p>
      <h2>{day.title}</h2>
      <p>{day.summary}</p>
      {day.warn && <p className="warn">⚠️ {day.warn}</p>}
      <TrainNote date={day.date} />
      <ol className="timeline">
        {day.items.map((it, i) => {
          const p = it.placeId ? placeById(it.placeId) : undefined
          return (
            <li key={i} className={it.optional ? 'optional' : ''}>
              <div className="when">
                {it.time}
                {it.optional && <span className="chip alt">ทางเลือก</span>}
              </div>
              {p ? (
                <>
                  {it.note && <p className="muted">{it.note}</p>}
                  <PlaceCard place={p} compact />
                </>
              ) : (
                <p>{it.text}</p>
              )}
            </li>
          )
        })}
      </ol>
      <p>
        <Link to="/plan">← กลับไปแผนทั้งหมด</Link>
      </p>
    </section>
  )
}
