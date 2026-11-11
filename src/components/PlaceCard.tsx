import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Place } from '../data/types'
import PlaceImage from './PlaceImage'
import DriverModal from './DriverModal'
import { amapSearch, cny } from '../lib'

export default function PlaceCard({ place, compact = false }: { place: Place; compact?: boolean }) {
  const [show, setShow] = useState(false)
  return (
    <article className="card place">
      <Link to={`/place/${place.id}`}>
        <PlaceImage id={place.id} zh={place.zh} />
      </Link>
      <div className="pad">
        <h3>
          <Link to={`/place/${place.id}`}>{place.th}</Link>
        </h3>
        <p className="zh">{place.zh}</p>
        {!compact && <p>{place.desc}</p>}
        <p className="chips">
          <span className="chip">{place.fee ? `ค่าเข้า ~${cny(place.fee)}` : 'ฟรี'}</span>
          <span className="chip">เดินทาง ~{cny(place.travel)}</span>
          {place.time && <span className="chip">{place.time}</span>}
        </p>
        <p className="how">🚌 {place.how}</p>
        <div className="row">
          <button className="btn small" onClick={() => setShow(true)}>
            แสดงให้คนขับดู
          </button>
          <a className="btn small ghost" href={amapSearch(place.zh)} target="_blank" rel="noreferrer">
            เปิด Amap
          </a>
        </div>
      </div>
      {show && <DriverModal zh={place.zh} th={place.th} onClose={() => setShow(false)} />}
    </article>
  )
}
