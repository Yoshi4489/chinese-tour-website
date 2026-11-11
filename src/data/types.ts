export type CityId = 'kunming' | 'dali' | 'lijiang' | 'shangrila'

export interface City {
  id: CityId
  th: string
  zh: string
  altitude: string
  weather: string
  tip: string
}

export interface Place {
  id: string
  city: CityId
  th: string
  zh: string
  /** คำอธิบายสั้น ๆ */
  desc: string
  /** ค่าเข้า/ค่ากระเช้า ต่อคน (CNY) ประมาณการ */
  fee: number
  feeNote?: string
  /** วิธีไปแบบประหยัดจากตัวเมือง/ที่พัก */
  how: string
  /** ค่าเดินทางไป (CNY ต่อคน ขาเดียว ประมาณการ) */
  travel: number
  /** ทางเลือกอื่น (เหมารถ/ทัวร์) */
  alt?: string
  time?: string
  tip?: string
}

export interface Activity {
  time?: string
  placeId?: string
  text?: string
  note?: string
  /** แผนสำรอง/ทางเลือก ไม่นับเข้างบหลัก */
  optional?: boolean
}

export interface Day {
  date: string // YYYY-MM-DD
  city: CityId
  title: string
  summary: string
  items: Activity[]
  /** ข้อความเตือนประจำวัน */
  warn?: string
}

export interface Food {
  id: string
  city: CityId
  th: string
  zh: string
  dish: string
  price: string
  note?: string
}
