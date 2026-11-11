import { useEffect, useState } from 'react'

/** useState ที่เก็บค่าใน localStorage (ปลอดภัยถ้า storage ใช้ไม่ได้) */
export function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore */
    }
  }, [key, value])
  return [value, setValue] as const
}

/** ลิงก์ค้นหาใน Amap (高德) ใช้ได้ในจีนโดยไม่ต้องใช้ VPN */
export const amapSearch = (zh: string) => `https://uri.amap.com/search?keyword=${encodeURIComponent(zh)}&src=yunnan-trip`

const th = new Intl.DateTimeFormat('th-TH', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Shanghai' })
export const fmtDate = (iso: string) => th.format(new Date(iso + 'T12:00:00+08:00'))

/** วันที่ตามเวลาจีน (YYYY-MM-DD) */
export const todayCN = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())

export const cny = (n: number) => `¥${Math.round(n).toLocaleString()}`
