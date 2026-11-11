import { useState } from 'react'
import { days } from '../data/trip'
import { placeById } from '../data/places'
import { useLocal, cny } from '../lib'

interface Expense {
  id: number
  label: string
  cny: number
}

export default function Budget() {
  const [people, setPeople] = useLocal('b-people', 1)
  const [rate, setRate] = useLocal('b-rate', 4.8)
  const [foodPerDay, setFoodPerDay] = useLocal('b-food', 80)
  const [withOptional, setWithOptional] = useLocal('b-optional', false)
  const [expenses, setExpenses] = useLocal<Expense[]>('b-expenses', [])
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')

  let fees = 0
  let travel = 0
  for (const d of days) {
    const seen = new Set<string>()
    for (const it of d.items) {
      if (!it.placeId || seen.has(it.placeId) || (it.optional && !withOptional)) continue
      seen.add(it.placeId)
      const p = placeById(it.placeId)!
      fees += p.fee
      travel += p.travel * 2 // ไป-กลับ
    }
  }
  const food = foodPerDay * days.length
  const total = fees + travel + food
  const spent = expenses.reduce((s, e) => s + e.cny, 0)
  const thb = (v: number) => `฿${Math.round(v * rate).toLocaleString()}`

  const add = () => {
    const n = Number(amount)
    if (!label.trim() || !n) return
    setExpenses([...expenses, { id: Date.now(), label: label.trim(), cny: n }])
    setLabel('')
    setAmount('')
  }

  return (
    <section>
      <h2>งบประมาณ (ไม่รวมที่พัก/รถไฟระหว่างเมือง)</h2>
      <div className="form">
        <label>
          จำนวนคน
          <input type="number" min={1} value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))} />
        </label>
        <label>
          1 CNY = ? บาท
          <input type="number" step="0.01" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
        <label>
          ค่าอาหารต่อวัน (¥/คน)
          <input type="number" value={foodPerDay} onChange={(e) => setFoodPerDay(Number(e.target.value))} />
        </label>
        <label className="check">
          <input type="checkbox" checked={withOptional} onChange={(e) => setWithOptional(e.target.checked)} />
          รวมแผนสำรอง/ทางเลือกด้วย
        </label>
      </div>
      <table className="table">
        <tbody>
          <tr><td>ค่าเข้าสถานที่</td><td>{cny(fees)}</td></tr>
          <tr><td>ค่าเดินทางไปที่เที่ยว (ไป-กลับ)</td><td>{cny(travel)}</td></tr>
          <tr><td>อาหาร {days.length} วัน</td><td>{cny(food)}</td></tr>
          <tr className="total"><td>รวมต่อคน</td><td>{cny(total)} ≈ {thb(total)}</td></tr>
          <tr className="total"><td>รวม {people} คน</td><td>{cny(total * people)} ≈ {thb(total * people)}</td></tr>
        </tbody>
      </table>
      <p className="muted">ราคาเป็นการประมาณการ ค่าเดินทางอ้างอิงตัวเลือกประหยัด (รถเมล์/ทัวร์ร่วม)</p>

      <h3>บันทึกค่าใช้จ่ายจริง</h3>
      <div className="row">
        <input placeholder="รายการ" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input placeholder="¥" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: 90 }} />
        <button className="btn small" onClick={add}>เพิ่ม</button>
      </div>
      <ul className="list">
        {expenses.map((e) => (
          <li key={e.id} className="row between">
            <span>{e.label}</span>
            <span>
              {cny(e.cny)} <button className="x" onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))}>✕</button>
            </span>
          </li>
        ))}
      </ul>
      <p><strong>ใช้ไปแล้ว {cny(spent)} ≈ {thb(spent)}</strong></p>
    </section>
  )
}
