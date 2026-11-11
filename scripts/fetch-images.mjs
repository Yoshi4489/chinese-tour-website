// Downloads free-licensed photos from Wikimedia Commons for each place.
// Usage: node scripts/fetch-images.mjs   (needs network access to commons/upload.wikimedia.org)
import fs from 'node:fs'
import sharp from 'sharp'

const UA = 'YunnanTripOfflineGuide/1.0 (personal trip planner; offline PWA build script)'
const OUT = 'public/images/places'
const CREDITS = 'src/data/credits.json'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const QUERIES = {
  'kunming-old-street': ['Jinma Biji Fang Kunming', 'Kunming old street'],
  'kunming-night-market': ['Kunming night market'],
  xishan: ['Dragon Gate Xishan Kunming', 'Western Hills Kunming'],
  haigeng: ['Haigeng Dam Kunming gulls', 'Dianchi lake Kunming'],
  'dali-old-town': ['Dali Old Town south gate', 'Dali ancient city'],
  'three-pagodas': ['Three Pagodas Dali Chongsheng Temple'],
  xizhou: ['Xizhou Dali Bai village'],
  zhoucheng: ['Zhoucheng Dali Bai tie-dye'],
  erhai: ['Erhai Lake Dali', 'Erhai Lake cycling'],
  shuanglang: ['Shuanglang Erhai'],
  'little-putuo': ['Xiaoputuo Erhai Lake island temple', 'Little Putuo Erhai'],
  cangshan: ['Cangshan mountain Dali'],
  'lijiang-old-town': ['Lijiang Old Town'],
  'jade-dragon': ['Jade Dragon Snow Mountain Lijiang'],
  'blue-moon': ['Blue Moon Valley Lijiang'],
  'black-dragon-pool': ['Black Dragon Pool Lijiang'],
  'jade-water-village': ['Yushuizhai Lijiang', 'Yu Shui Zhai Lijiang'],
  shuhe: ['Shuhe Old Town Lijiang'],
  baisha: ['Baisha Old Town Lijiang'],
  'tiger-leaping': ['Tiger Leaping Gorge'],
  lashihai: ['Lashihai Lijiang'],
  'lion-hill': ['Wangu Tower Lijiang Lion Hill', 'Lijiang old town from Lion Hill'],
  dukezong: ['Dukezong Old Town Shangri-La'],
  guishan: ['Guishan Park prayer wheel Shangri-La', 'Tortoise Hill Shangri-La'],
  songzanlin: ['Ganden Sumtseling Monastery'],
  shika: ['Shika Snow Mountain Shangri-La', 'Haba snow mountain Shangri-La'],
  pudacuo: ['Pudacuo National Park Shudu Lake', 'Potatso National Park'],
  napahai: ['Napahai Shangri-La'],
  baishuitai: ['Baishuitai Shangri-La'],
}

const credits = fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, 'utf8')) : {}
fs.mkdirSync(OUT, { recursive: true })
const strip = (s = '') => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

async function api(q) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=8' +
    `&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=800&format=json`
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } })
      if (r.ok) return r.json()
    } catch {}
    await sleep(8000 * (i + 1))
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

for (const [id, qs] of Object.entries(QUERIES)) {
  const dest = `${OUT}/${id}.webp`
  if (fs.existsSync(dest) && credits[id]) continue
  let done = false
  for (const q of qs) {
    const data = await api(q)
    await sleep(1500)
    const pages = Object.values(data?.query?.pages ?? {}).sort((a, b) => a.index - b.index)
    for (const p of pages) {
      const ii = p.imageinfo?.[0]
      const meta = ii?.extmetadata ?? {}
      const lic = meta.LicenseShortName?.value ?? ''
      if (!ii || !/jpe?g/.test(ii.mime) || ii.width < 800 || ii.width < ii.height * 1.1) continue
      if (!/^(CC|Public domain|PD)/i.test(lic)) continue
      const buf = await download([ii.thumburl?.replace('//thumb.wikimedia.org/', '//upload.wikimedia.org/'), ii.url])
      if (!buf) continue
      await sharp(buf).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 72 }).toFile(dest)
      credits[id] = {
        title: p.title.replace(/^File:/, ''),
        author: strip(meta.Artist?.value) || 'Unknown',
        license: lic,
        source: ii.descriptionurl,
      }
      fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 2))
      console.log('OK  ', id, '<-', p.title, `(${lic})`)
      done = true
      await sleep(1500)
      break
    }
    if (done) break
  }
  if (!done) console.log('MISS', id)
}
console.log('finished')
