# ทริปยูนนาน 12–24 พ.ย. 2026 (PWA ใช้ออฟไลน์ได้)

เส้นทาง: คุนหมิง → ต้าลี่ → ลี่เจียง → แชงกรีล่า → คุนหมิง
เว็บแอปเก็บแผนรายวัน ที่เที่ยว วิธีเดินทางแบบประหยัด ค่าใช้จ่าย ร้านอาหาร เช็กลิสต์ และวลีจีน โหลดครั้งเดียวที่ไทยแล้วใช้ในจีนแบบออฟไลน์ได้

## หลักการออฟไลน์ (สำคัญสำหรับจีน)
- Google และ `*.vercel.app` มักเข้าไม่ได้ในจีน จึงไม่ใช้ Google Fonts / CDN / analytics ทุกอย่าง bundle มากับแอปและถูก precache โดย Service Worker (Workbox)
- ข้อมูลทั้งหมดอยู่ใน `src/data/*.ts` รูปอยู่ใน `public/images/places/` แผนที่ต้าลี่อยู่ใน `public/maps/`
- ปุ่ม "แสดงให้คนขับดู" โชว์ชื่อสถานที่เป็นตัวจีนตัวใหญ่ และลิงก์ค้นหา Amap (高德) ที่ใช้ได้ในจีนโดยไม่ต้องใช้ VPN
- ช่องจดตั๋ว/ขบวน งบ เช็กลิสต์ เก็บใน localStorage ของเครื่อง

## วิธีใช้งานก่อนเดินทาง (ทำที่ไทย)
1. เปิดเว็บที่ deploy แล้ว รอป้าย **"พร้อมออฟไลน์ ✓"** มุมขวาบน
2. iOS Safari: แชร์ → เพิ่มไปยังหน้าจอโฮม / Android Chrome: ติดตั้งแอป
3. ทดสอบเปิดโหมดเครื่องบิน แล้วเปิดแอปจากไอคอน ต้องใช้ได้ทุกหน้า

## พัฒนา
```bash
npm install
npm run dev        # โหมดพัฒนา
npm run build      # typecheck + build (สร้าง sw.js ใน dist/)
npm run preview    # เสิร์ฟ dist ที่ http://127.0.0.1:4173
node scripts/offline-test.mjs   # ทดสอบออฟไลน์ด้วย Playwright (ต้องรัน preview อยู่)
node scripts/make-icons.mjs     # สร้างไอคอน PNG จาก public/icons/icon.svg
node scripts/fetch-images.mjs   # โหลดรูปจาก Wikimedia Commons (ต้องเข้าเน็ตได้) + เขียน src/data/credits.json
```

## Deploy บน Vercel
เชื่อม repo นี้กับ Vercel (Framework preset: Vite, Output: `dist`) ไฟล์ `vercel.json` ตั้ง header ไม่ให้แคช `sw.js`
แนะนำใส่ custom domain เพราะ `*.vercel.app` มักเข้าไม่ได้ในจีน (แต่แอปที่ติดตั้งแล้วทำงานจากแคชได้โดยไม่ต้องต่อ)

## หมายเหตุข้อมูล
ราคาค่าเข้า ค่ารถ และสายรถเมล์เป็น **ประมาณการ** (CNY) อิงข้อมูลปี 2025–26 ควรตรวจใน Amap / Didi / Trip.com / มินิโปรแกรมของสถานที่อีกครั้ง
รถไฟความเร็วสูงระหว่างเมืองและที่พักจองไว้แล้ว ไม่ได้รวมในงบ

เครดิตรูปภาพ: Wikimedia Commons ตามสัญญาอนุญาตของแต่ละรูป ดูในหน้า "อื่น ๆ" ในแอป

## รูปอาหาร
รูปอยู่ใน `public/images/food/` เครดิตอยู่ใน `src/data/food-credits.json` (แสดงในการ์ดอาหารแต่ละเมนู) ดึงจาก Wikimedia Commons ด้วย `scripts/fetch-food-images.mjs` (ถูกจำกัดอัตราเรียกมาก ช้า) ตอนนี้บางเมนูยังไม่มีรูปและแสดงกรอบสีพร้อมชื่อจีนแทน ใส่รูปเพิ่มได้โดยวางไฟล์ `.webp` แล้วเพิ่ม entry ใน `food-credits.json`

รูปเพิ่มเติมดึงจาก Openverse (เฉพาะ CC0 / PDM / BY / BY-SA) ด้วย `scripts/openverse-candidates.mjs` (ดึงตัวเลือก) → คัดด้วยตา → `scripts/apply-candidates.mjs` (แปลงเป็น webp + ใส่เครดิต) บางรูปเป็นภาพบรรยากาศ/ของประเภทเดียวกัน ไม่ได้ถ่ายที่ร้านหรือสถานที่นั้นโดยตรง
