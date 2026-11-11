// สร้าง contact sheet ของรูปตัวเลือก: node scripts/cand-sheet.mjs <candsDir> <out.png> <key> [key...]
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
const [dir, out, ...keys] = process.argv.slice(2)
const W = 200, H = 150, cols = 7
const items = []
for (const k of keys) {
  const d = path.join(dir, k)
  if (!fs.existsSync(d)) continue
  for (const f of fs.readdirSync(d).filter((f) => f.endsWith('.jpg')).sort((a, b) => parseInt(a) - parseInt(b))) items.push({ k, f })
}
const rows = Math.ceil(items.length / cols)
const comps = []
for (let i = 0; i < items.length; i++) {
  const x = (i % cols) * W, y = Math.floor(i / cols) * (H + 16)
  try {
    comps.push({ input: await sharp(path.join(dir, items[i].k, items[i].f)).resize(W - 4, H, { fit: 'cover' }).png().toBuffer(), left: x, top: y + 16 })
  } catch {}
  comps.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="16"><text x="2" y="12" font-size="11" font-family="sans-serif">${items[i].k}/${items[i].f.replace('.jpg', '')}</text></svg>`), left: x, top: y })
}
await sharp({ create: { width: W * cols, height: Math.max(rows, 1) * (H + 16), channels: 3, background: '#fff' } }).composite(comps).png().toFile(out)
console.log(items.length)
