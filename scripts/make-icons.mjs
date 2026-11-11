import sharp from 'sharp'
import fs from 'node:fs'
const svg = fs.readFileSync('public/icons/icon.svg')
await sharp(svg).resize(192, 192).png().toFile('public/icons/icon-192.png')
await sharp(svg).resize(512, 512).png().toFile('public/icons/icon-512.png')
// maskable: เนื้อหาอยู่ในพื้นที่ปลอดภัย 80%
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#0f172a' } })
  .composite([{ input: await sharp(svg).resize(400, 400).png().toBuffer(), gravity: 'center' }])
  .png().toFile('public/icons/maskable-512.png')
