import foodCredits from '../data/food-credits.json'

type Credit = { file: string; title: string; author: string; license: string; source: string }
const all = foodCredits as Record<string, Credit[]>

/** แกลเลอรีรูปอาหารเลื่อนข้าง (รูปแคชออฟไลน์) ถ้าไม่มีรูปแสดงกรอบสีพร้อมชื่อจีน */
export default function FoodGallery({ id, zh }: { id: string; zh: string }) {
  const imgs = all[id] ?? []
  if (!imgs.length) {
    return (
      <div className="img fallback">
        <span>{zh}</span>
      </div>
    )
  }
  return (
    <>
      <div className="gallery" aria-label={zh}>
        {imgs.map((c) => (
          <img key={c.file} src={`/images/food/${c.file}`} alt={`${zh} — ${c.title}`} loading="lazy" decoding="async" />
        ))}
      </div>
      <details className="credit small muted">
        <summary>เครดิตรูป ({imgs.length})</summary>
        <ul>
          {imgs.map((c) => (
            <li key={c.file}>
              {c.author} · {c.license} · <a href={c.source}>{c.title}</a>
            </li>
          ))}
        </ul>
      </details>
    </>
  )
}
