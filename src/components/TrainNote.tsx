import { useLocal } from '../lib'

/** ช่องจดขบวน/เวลา/ที่นั่ง รถไฟหรือเที่ยวบินที่จองไว้ เก็บในเครื่อง */
export default function TrainNote({ date }: { date: string }) {
  const [note, setNote] = useLocal(`transit-${date}`, '')
  return (
    <label className="note">
      <span>🚄 ตั๋ว/ขบวน/เวลา (กรอกเอง)</span>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="เช่น G8xxx 14:20 → 16:30 ตู้ 5 ที่นั่ง 12A" rows={2} />
    </label>
  )
}
