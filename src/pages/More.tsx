import { useState } from 'react'
import { useLocal } from '../lib'
import credits from '../data/credits.json'
import { places } from '../data/places'
import DriverModal from '../components/DriverModal'

const checklist = [
  'พาสปอร์ต + วีซ่า/เอกสารเข้าจีน (ใช้ซื้อตั๋วทุกที่)',
  'Alipay/WeChat Pay ผูกบัตรต่างประเทศ + เงินสดสำรอง',
  'eSIM/ซิมโรมมิ่ง (ใช้ Google/LINE ได้โดยไม่ต้อง VPN)',
  'ติดตั้ง Amap (高德), Didi, Trip.com, Dianping ล่วงหน้า',
  'จองตั๋วกระเช้าภูเขามังกรหยกผ่านมินิโปรแกรม WeChat',
  'เสื้อดาวน์/ฮีทเทค หมวก ถุงมือ สำหรับแชงกรีล่าและมังกรหยก',
  'ยาแก้แพ้ที่สูง ออกซิเจนกระป๋อง ยาประจำตัว ครีมกันแดด ลิปมัน',
  'พาวเวอร์แบงก์ (ห้ามโหลดใต้เครื่อง) + หัวแปลงปลั๊กจีน',
  'ติดตั้งแอปนี้แล้วรอ "พร้อมออฟไลน์ ✓" และทดสอบโหมดเครื่องบิน',
  'จดชื่อ/ที่อยู่ที่พักเป็นภาษาจีนไว้โชว์คนขับ',
]

const phrases = [
  ['ไปที่นี่', 'Qù zhèlǐ', '去这里'],
  ['เท่าไหร่', 'Duōshao qián?', '多少钱？'],
  ['แพงไป ลดหน่อยได้ไหม', 'Tài guì le, piányi diǎn', '太贵了，便宜点'],
  ['ห้องน้ำอยู่ไหน', 'Cèsuǒ zài nǎlǐ?', '厕所在哪里？'],
  ['ไม่เผ็ด', 'Bú yào là', '不要辣'],
  ['ขอเมนู/ขอใบเสร็จ', 'Qǐng gěi wǒ càidān / fāpiào', '请给我菜单 / 发票'],
  ['ผมแพ้…', 'Wǒ guòmǐn…', '我过敏…'],
  ['ช่วยด้วย / โทรหาหมอ', 'Jiùmìng / Jiào yīshēng', '救命 / 叫医生'],
  ['ขอจุดจอดตรงนี้', 'Qǐng zài zhèlǐ tíngchē', '请在这里停车'],
]

export default function More() {
  const [done, setDone] = useLocal<number[]>('checklist', [])
  const [show, setShow] = useState<string | null>(null)
  const used = Object.keys(credits as Record<string, unknown>)
  return (
    <section>
      <h2>เช็กลิสต์ก่อนเดินทาง</h2>
      <ul className="list">
        {checklist.map((t, i) => (
          <li key={i}>
            <label className="check">
              <input
                type="checkbox"
                checked={done.includes(i)}
                onChange={() => setDone(done.includes(i) ? done.filter((x) => x !== i) : [...done, i])}
              />
              {t}
            </label>
          </li>
        ))}
      </ul>

      <h2>วลีจีนที่ใช้บ่อย</h2>
      <ul className="list">
        {phrases.map(([th, py, zh]) => (
          <li key={py}>
            <button className="card pad phrase" onClick={() => setShow(zh)}>
              <strong>{th}</strong>
              <div className="muted">{py}</div>
              <div className="zh">{zh}</div>
            </button>
          </li>
        ))}
      </ul>
      {show && <DriverModal zh={show} th="" onClose={() => setShow(null)} />}

      <h2>เครดิตรูปภาพ</h2>
      <p className="muted small">
        รูปจาก Wikimedia Commons ใช้ตามสัญญาอนุญาตของแต่ละรูป สถานที่ที่ยังไม่มีรูปจะแสดงเป็นกรอบสีพร้อมชื่อจีนแทน
      </p>
      <ul className="small">
        {used.map((id) => {
          const c = (credits as Record<string, { title: string; author: string; license: string; source: string }>)[id]
          const p = places.find((x) => x.id === id)
          return (
            <li key={id}>
              {p?.th ?? id}: {c.author} · {c.license} · {c.source ? <a href={c.source}>{c.title}</a> : c.title}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
