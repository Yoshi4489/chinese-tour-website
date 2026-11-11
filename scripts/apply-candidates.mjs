// นำรูปตัวเลือกที่คัดแล้วเข้าแอป: แปลงเป็น webp, ใส่เครดิตลง food-credits.json (อาหาร) / credits.json (สถานที่)
// ใช้: node scripts/apply-candidates.mjs <candsDir> <selection.json>
// selection.json: { "dl-erkuai": [1,2], "p-xizhou": [10] }  (คีย์ขึ้นต้น p- = สถานที่, เลือกได้ 1 รูปต่อสถานที่)
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const [dir, selFile] = process.argv.slice(2)
const sel = JSON.parse(fs.readFileSync(selFile, 'utf8'))
const FOOD_CREDITS = 'src/data/food-credits.json'
const PLACE_CREDITS = 'src/data/credits.json'
const food = JSON.parse(fs.readFileSync(FOOD_CREDITS, 'utf8'))
const place = JSON.parse(fs.readFileSync(PLACE_CREDITS, 'utf8'))

const lic = (l, v) => {
  const base = { cc0: 'CC0', pdm: 'Public domain', by: 'CC BY', 'by-sa': 'CC BY-SA' }[l] ?? l
  return l === 'cc0' || l === 'pdm' ? base : `${base} ${v}`
}

for (const [key, nums] of Object.entries(sel)) {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, key, 'meta.json'), 'utf8'))
  const isPlace = key.startsWith('p-')
  const id = isPlace ? key.slice(2) : key
  for (const n of nums) {
    const m = meta[n - 1]
    const src = path.join(dir, key, `${n}.jpg`)
    if (!m || !fs.existsSync(src)) { console.log('SKIP', key, n); continue }
    const credit = { title: m.title, author: m.creator || 'Unknown', license: lic(m.license, m.version), source: m.landing }
    if (isPlace) {
      await sharp(src).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 72 }).toFile(`public/images/places/${id}.webp`)
      place[id] = credit
    } else {
      const list = (food[id] ??= [])
      if (list.some((c) => c.source === m.landing)) { console.log('DUP ', key, n); continue }
      const file = `${id}-${Math.max(0, ...list.map((c) => parseInt(c.file.match(/-(\d+)\.webp$/)[1]))) + 1}.webp`
      await sharp(src).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 70 }).toFile(`public/images/food/${file}`)
      list.push({ file, ...credit })
    }
    console.log('OK  ', key, n, '<-', m.title)
  }
}
fs.writeFileSync(FOOD_CREDITS, JSON.stringify(food, null, 2))
fs.writeFileSync(PLACE_CREDITS, JSON.stringify(place, null, 2))
