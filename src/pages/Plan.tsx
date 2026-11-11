import { Link } from 'react-router-dom'
import { days } from '../data/trip'
import { cityById } from '../data/places'
import { fmtDate } from '../lib'

export default function Plan() {
  return (
    <section>
      <h2>แผนรายวัน</h2>
      <ul className="list">
        {days.map((d, i) => (
          <li key={d.date}>
            <Link to={`/day/${d.date}`} className="card row-link">
              <div className={`dot ${d.city}`}>{i + 1}</div>
              <div>
                <strong>{d.title}</strong>
                <div className="muted">
                  {fmtDate(d.date)} · {cityById(d.city).th}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
