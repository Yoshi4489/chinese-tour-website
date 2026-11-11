import { amapSearch } from '../lib'

/** แสดงชื่อจีนตัวใหญ่เต็มจอ ให้คนขับ/คนท้องถิ่นดู */
export default function DriverModal({ zh, th, onClose }: { zh: string; th: string; onClose: () => void }) {
  return (
    <div className="modal" onClick={onClose} role="dialog">
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <p className="muted">请带我去这里 · กรุณาพาฉันไปที่นี่</p>
        <h1 className="big-zh">{zh}</h1>
        <p className="muted">{th}</p>
        <a className="btn" href={amapSearch(zh)} target="_blank" rel="noreferrer">
          เปิดใน Amap 高德
        </a>
        <button className="btn ghost" onClick={onClose}>
          ปิด
        </button>
      </div>
    </div>
  )
}
