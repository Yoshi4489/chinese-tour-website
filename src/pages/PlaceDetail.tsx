import { useParams, Link } from 'react-router-dom'
import { placeById, cityById } from '../data/places'
import PlaceImage from '../components/PlaceImage'
import PlaceCard from '../components/PlaceCard'
import credits from '../data/credits.json'
import { cny } from '../lib'

type Credit = { title: string; author: string; license: string; source: string }

export default function PlaceDetail() {
  const { id } = useParams()
  const p = id ? placeById(id) : undefined
  if (!p) return <p>ไม่พบสถานที่</p>
  const c = (credits as Record<string, Credit>)[p.id]
  return (
    <section>
      <PlaceImage id={p.id} zh={p.zh} />
      <h2>{p.th}</h2>
      <p className="zh">{p.zh} · {cityById(p.city).th}</p>
      <p>{p.desc}</p>
      <ul>
        <li>ค่าเข้า: {p.fee ? `~${cny(p.fee)}` : 'ฟรี'} {p.feeNote && <span className="muted">({p.feeNote})</span>}</li>
        <li>วิธีไป (ประหยัด): {p.how} (~{cny(p.travel)} ต่อเที่ยว)</li>
        {p.alt && <li>ทางเลือก: {p.alt}</li>}
        {p.time && <li>ใช้เวลา: {p.time}</li>}
        {p.tip && <li>เคล็ดลับ: {p.tip}</li>}
      </ul>
      <p className="muted">ราคาและสายรถเป็นการประมาณการ ตรวจใน Amap/Didi/มินิโปรแกรมก่อนไป</p>
      <PlaceCard place={p} compact />
      {c && (
        <p className="muted small">
          รูป: {c.author} · {c.license} · <a href={c.source}>แหล่งที่มา</a>
        </p>
      )}
      <Link to="/places">← สถานที่ทั้งหมด</Link>
    </section>
  )
}
