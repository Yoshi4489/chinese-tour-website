// ดึงรูปอาหารฟรีจาก Wikimedia Commons ไม่เกิน 5 รูปต่อเมนู + เขียนเครดิตลง src/data/food-credits.json
// ใช้: NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node scripts/fetch-food-images.mjs
// กรองด้วย `must` (ต้องมีคำที่เกี่ยวข้องในชื่อไฟล์/คำอธิบาย) กันรูปไม่ตรงเมนู ถ้าหาไม่ครบจะได้น้อยกว่า 5 รูป
import fs from 'node:fs'
import sharp from 'sharp'

const UA = 'YunnanTripOfflineGuide/1.0 (personal trip planner; offline PWA build script)'
const OUT = 'public/images/food'
const CREDITS = 'src/data/food-credits.json'
const MAX = 5
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const strip = (s = '') => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

const FOODS = {
  'km-guoqiao': { q: ['Crossing the bridge noodles', 'Guoqiao mixian', 'Over-the-bridge noodles'], must: /bridge|guoqiao|mixian|米线/i },
  'km-xiaoguo': { q: ['Yunnan rice noodles', 'Kunming rice noodles', 'Mixian Yunnan'], must: /noodle|mixian|米线/i },
  'km-qiguo': { q: ['Qiguoji', 'Yunnan steam pot chicken', 'Steam pot chicken Kunming'], must: /steam|qiguo|汽锅/i },
  'km-xianhuabing': { q: ['Flower cake Yunnan', 'Xianhua bing', 'Rose flower cake Kunming'], must: /flower cake|xianhua|rose|鲜花饼/i },
  'km-yejun': { q: ['Yunnan wild mushroom hot pot', 'Yunnan mushrooms', 'Matsutake Yunnan market', 'Kunming mushroom market'], must: /mushroom|菌|hot ?pot/i },
  'dl-xizhou': { q: ['Xizhou baba', 'Xizhou pastry Dali', 'Baba Dali bread'], must: /baba|xizhou|粑/i },
  'dl-shaguoyu': { q: ['Dali casserole fish', 'Erhai fish dish', 'Dali fish casserole'], must: /fish|鱼/i },
  'dl-rushan': { q: ['Rushan cheese Dali', 'Rushan Bai cheese', 'Dali milk fan cheese'], must: /rushan|cheese|乳扇/i },
  'dl-erkuai': { q: ['Erkuai rice cake Yunnan', 'Erkuai', 'Yunnan rice cake'], must: /erkuai|rice cake|饵/i },
  'lj-laipai': { q: ['Lijiang smoked ribs hot pot', 'Lijiang ribs', 'Naxi cuisine ribs'], must: /rib|naxi|hot ?pot/i },
  'lj-jidou': { q: ['Jidou liangfen', 'Lijiang chickpea jelly', 'Liangfen'], must: /liangfen|jelly|凉粉/i },
  'lj-kaoyu': { q: ['Naxi grilled fish', 'Lijiang grilled fish', 'Grilled fish Lijiang'], must: /fish|鱼/i },
  'lj-baba': { q: ['Lijiang baba', 'Lijiang baba pastry', 'Naxi baba'], must: /baba|粑/i },
  'sg-yak': { q: ['Yak hot pot Shangri-La', 'Yak meat Tibetan food', 'Yak meat Shangri-La'], must: /yak/i },
  'sg-tea': { q: ['Butter tea', 'Yak butter tea Tibetan', 'Tibetan butter tea'], must: /butter tea|po cha|suyou/i },
  'sg-qingke': { q: ['Tsampa', 'Qingke bread', 'Highland barley bread Tibet'], must: /tsampa|barley|qingke/i },
  'sg-yogurt': { q: ['Yak yogurt', 'Yak milk Shangri-La', 'Tibetan yoghurt'], must: /yogh?urt|yak milk|yak/i },
}

const credits = fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, 'utf8')) : {}
const usedTitles = new Set(Object.values(credits).flat().map((c) => c.title))
fs.mkdirSync(OUT, { recursive: true })

async function api(q) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=50' +
    `&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=640&format=json`
  for (let i = 0; i < 6; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } })
      if (r.ok) return r.json()
    } catch {}
    await sleep(Math.min(8000 * (i + 1), 30000))
  }
  return null
}

async function download(urls) {
  for (const u of urls.filter(Boolean)) {
    for (let i = 0; i < 3; i++) {
      try {
        const res = await fetch(u, { headers: { 'User-Agent': UA } })
        if (res.ok) return Buffer.from(await res.arrayBuffer())
        if (res.status === 429) await sleep(8000 * (i + 1))
        else break
      } catch { break }
    }
    await sleep(1500)
  }
  return null
}

for (const [id, { q, must }] of Object.entries(FOODS)) {
  const have = credits[id] ?? []
  credits[id] = have
  for (const query of q) {
    if (have.length >= MAX) break
    const data = await api(query)
    await sleep(4000)
    const pages = Object.values(data?.query?.pages ?? {}).sort((a, b) => a.index - b.index)
    for (const p of pages) {
      if (have.length >= MAX) break
      const ii = p.imageinfo?.[0]
      const meta = ii?.extmetadata ?? {}
      const lic = meta.LicenseShortName?.value ?? ''
      const title = p.title.replace(/^File:/, '')
      if (!ii || !/jpe?g|png/.test(ii.mime) || ii.width < 500 || usedTitles.has(title)) continue
      if (!/^(CC|Public domain|PD)/i.test(lic)) continue
      if (!must.test(title + ' ' + strip(meta.ImageDescription?.value))) continue
      const buf = await download([ii.thumburl?.replace('//thumb.wikimedia.org/', '//upload.wikimedia.org/'), ii.url])
      if (!buf) continue
      const n = have.length + 1
      const file = `${id}-${n}.webp`
      await sharp(buf).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 70 }).toFile(`${OUT}/${file}`)
      have.push({ file, title, author: strip(meta.Artist?.value) || 'Unknown', license: lic, source: ii.descriptionurl })
      usedTitles.add(title)
      fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 2))
      console.log('OK  ', id, n, '<-', title, `(${lic})`)
      await sleep(1500)
    }
  }
  if (have.length === 0) console.log('MISS', id)
  else if (have.length < MAX) console.log('FEW ', id, have.length)
}
console.log('finished')
