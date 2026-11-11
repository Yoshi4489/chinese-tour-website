import { useState } from 'react'
import { food } from '../data/food'
import { cities } from '../data/places'
import type { CityId } from '../data/types'
import DriverModal from '../components/DriverModal'

export default function FoodPage() {
  const [city, setCity] = useState<CityId>('kunming')
  const [show, setShow] = useState<{ zh: string; th: string } | null>(null)
  return (
    <section>
      <h2>อาหารแนะนำ (ประหยัด)</h2>
      <div className="seg">
        {cities.map((c) => (
          <button key={c.id} className={c.id === city ? 'on' : ''} onClick={() => setCity(c.id)}>
            {c.th}
          </button>
        ))}
      </div>
      <p className="muted">ราคาต่อคน ¥ โดยประมาณ ตรวจชื่อร้านใน Dianping/Amap ก่อนไป กดปุ่มเพื่อโชว์ชื่อเมนูภาษาจีนให้ร้านดู</p>
      {food
        .filter((f) => f.city === city)
        .map((f) => (
          <article className="card pad" key={f.id}>
            <h3>
              {f.th} <span className="zh">{f.zh}</span>
            </h3>
            <p>{f.dish}</p>
            <p className="chips">
              <span className="chip">¥{f.price}</span>
              {f.note && <span className="chip">{f.note}</span>}
            </p>
            <button className="btn small" onClick={() => setShow({ zh: f.zh, th: f.th })}>
              แสดงชื่อเมนู
            </button>
          </article>
        ))}
      {show && <DriverModal zh={show.zh} th={show.th} onClose={() => setShow(null)} />}
    </section>
  )
}
