import { Link } from 'react-router-dom'
import { days } from '../data/trip'
import DayView from '../components/DayView'
import { todayCN } from '../lib'

export default function Home() {
  const today = todayCN()
  const day = days.find((d) => d.date === today)
  if (day) return <DayView day={day} />
  const first = days[0].date
  const before = today < first
  return (
    <section>
      <h2>{before ? 'ยังไม่ถึงวันเดินทาง' : 'ทริปจบแล้ว 🎉'}</h2>
      <p>
        ทริปคุนหมิง → ต้าลี่ → ลี่เจียง → แชงกรีล่า → คุนหมิง ระหว่าง 12–24 พ.ย. 2026 หน้านี้จะแสดงแผนของวันนั้นอัตโนมัติ (เวลาจีน)
      </p>
      <p>
        <Link className="btn" to={`/day/${first}`}>
          ดูวันแรก (12 พ.ย.)
        </Link>{' '}
        <Link className="btn ghost" to="/plan">
          แผนทั้งหมด
        </Link>
      </p>
      <p className="muted">ติดตั้งแอปและรอให้ขึ้น "พร้อมออฟไลน์ ✓" ตอนอยู่ไทย แล้วทดสอบเปิดโหมดเครื่องบิน</p>
    </section>
  )
}
