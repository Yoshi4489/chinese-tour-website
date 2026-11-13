// ดึงรูปตัวเลือกจาก Openverse (CC0 / PDM / BY / BY-SA เท่านั้น) ไปไว้ในโฟลเดอร์ชั่วคราว เพื่อคัดด้วยตาก่อนใช้จริง
// ใช้: NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node scripts/openverse-candidates.mjs <outDir> [key ...]
import fs from 'node:fs'
import path from 'node:path'

const UA = 'YunnanTripOfflineGuide/1.0 (personal trip planner; offline PWA build script)'
const OUT = process.argv[2]
const only = process.argv.slice(3)
const ALLOWED = new Set(['cc0', 'pdm', 'by', 'by-sa'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// kind: food|place  want: จำนวนรูปที่ต้องการอย่างน้อย (ดึงตัวเลือกมาเกินไว้คัดทิ้ง)
export const TARGETS = {
  // ----- อาหาร -----
  'km-qiguo': ['Yunnan steam pot chicken', 'qiguo chicken Kunming', 'Yunnan steamed chicken soup'],
  'km-xianhuabing': ['Yunnan flower cake', 'rose flower cake Kunming', 'xianhuabing'],
  'dl-xizhou': ['Xizhou baba', 'Dali baba bread', 'Dali pastry Xizhou'],
  'dl-shaguoyu': ['Dali fish casserole', 'Erhai fish', 'Dali clay pot fish'],
  'dl-erkuai': ['erkuai', 'Yunnan rice cake erkuai', 'Dali grilled rice cake'],
  'lj-laipai': ['Lijiang ribs hot pot', 'Lijiang smoked pork ribs', 'Naxi cuisine'],
  'lj-jidou': ['Lijiang liangfen', 'chickpea jelly Lijiang', 'Yunnan liangfen'],
  'lj-kaoyu': ['Lijiang grilled fish', 'Naxi grilled fish', 'grilled fish Yunnan'],
  'lj-baba': ['Lijiang baba', 'Lijiang street food', 'Naxi baba bread'],
  'sg-yak': ['yak hot pot', 'yak meat Shangri-La', 'yak meat dish Tibet'],
  'sg-tea': ['butter tea', 'Tibetan butter tea', 'yak butter tea'],
  'sg-qingke': ['tsampa', 'highland barley bread', 'Tibetan barley bread'],
  'sg-yogurt': ['yak yogurt', 'Tibetan yogurt', 'yak milk Shangri-La'],
  // ----- สถานที่ -----
  'p-kunming-night-market': ['Kunming night market', 'Kunming street food night'],
  'p-xizhou': ['Xizhou Dali', 'Xizhou ancient town'],
  'p-zhoucheng': ['Zhoucheng Dali tie-dye', 'Zhoucheng village', 'Dali tie dye Bai'],
  'p-jade-dragon': ['Jade Dragon Snow Mountain', 'Yulong Snow Mountain', 'Lijiang snow mountain'],
  'p-blue-moon': ['Blue Moon Valley Lijiang', 'Lanyue Valley', 'Yulong blue moon valley'],
  'p-jade-water-village': ['Yushuizhai Lijiang', 'Jade Water Village Lijiang', 'Yushui village Lijiang'],
  'p-baisha': ['Baisha Lijiang', 'Baisha old town', 'Baisha village Lijiang'],
  'p-lashihai': ['Lashi Hai', 'Lashihai Lijiang', 'Lashi Lake Lijiang'],
  'p-lion-hill': ['Lijiang Wangu Tower', 'Lijiang old town view Lion Hill', 'Lijiang old town aerial'],
  'p-guishan': ['Guishan prayer wheel Shangri-La', 'Tortoise Hill Shangri-La', 'Dukezong prayer wheel'],
  'p-napahai': ['Napahai', 'Napahai wetland Shangri-La', 'Napa Lake Shangri-La'],
  // ----- สถานที่เสริม (รอบที่ 2) -----
  'p-butterfly-spring': ['Butterfly Spring Dali', 'Hudiequan Dali', 'Butterfly Spring Yunnan'],
  'p-shaxi': ['Shaxi ancient town', 'Shaxi Yunnan', 'Shaxi Sideng Street', 'Yujin Bridge Shaxi'],
  'p-mu-residence': ['Mu Residence Lijiang', 'Mufu Lijiang', 'Mu Palace Lijiang'],
  'p-yunshanping': ['Yunshanping Lijiang', 'Spruce Meadow Jade Dragon Snow Mountain', 'Yunshan Ping'],
  'p-lugu-lake': ['Lugu Lake', 'Lugu Lake Mosuo', 'Lugu Lake Yunnan'],
  'p-baiji-temple': ['Baiji Temple Shangri-La', 'Hundred Chicken Temple', 'Baiji Monastery Shangri-La'],
  'p-dongzhulin': ['Dongzhulin Monastery', 'Dongzhulin Deqin', 'Dongzhulin Temple'],
}

async function getJson(url) {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } })
      if (r.ok) return r.json()
    } catch {}
    await sleep(5000 * (i + 1))
  }
  return null
}

async function getBuf(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } })
      if (r.ok) return Buffer.from(await r.arrayBuffer())
    } catch {}
    await sleep(3000 * (i + 1))
  }
  return null
}

const keys = only.length ? only : Object.keys(TARGETS)
for (const key of keys) {
  const dir = path.join(OUT, key)
  fs.mkdirSync(dir, { recursive: true })
  const meta = []
  const seen = new Set()
  for (const q of TARGETS[key]) {
    const data = await getJson(
      `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial&page_size=20&mature=false`,
    )
    await sleep(800)
    for (const r of data?.results ?? []) {
      if (!ALLOWED.has(r.license) || seen.has(r.id) || (r.width && r.width < 500)) continue
      seen.add(r.id)
      meta.push({ id: r.id, title: r.title, creator: r.creator, license: r.license, version: r.license_version, source: r.source, landing: r.foreign_landing_url, query: q })
    }
    if (meta.length >= 14) break
  }
  const picked = meta.slice(0, 14)
  let n = 0
  await Promise.all(
    [0, 1, 2].map(async (w) => {
      for (let i = w; i < picked.length; i += 3) {
        const buf = await getBuf(`https://api.openverse.org/v1/images/${picked[i].id}/thumb/`)
        if (buf) { fs.writeFileSync(path.join(dir, `${i + 1}.jpg`), buf); n++ }
      }
    }),
  )
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(picked, null, 2))
  console.log('DONE', key, `${n}/${picked.length}`)
}
console.log('finished')
