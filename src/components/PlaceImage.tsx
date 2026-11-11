import { useState } from 'react'

/** รูปสถานที่ (แคชออฟไลน์) ถ้าไม่มีรูปแสดงกรอบสีพร้อมชื่อจีน */
export default function PlaceImage({ id, zh, className = '' }: { id: string; zh: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`img fallback ${className}`} aria-label={zh}>
        <span>{zh}</span>
      </div>
    )
  }
  return <img className={`img ${className}`} src={`/images/places/${id}.webp`} alt={zh} loading="lazy" decoding="async" onError={() => setFailed(true)} />
}
