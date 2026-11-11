// ทดสอบ: โหลดครั้งแรก → SW แคชเสร็จ → ปิดเน็ต → รีโหลดทุกหน้าต้องใช้ได้ และไม่มี request ออกนอกโดเมน
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')

const BASE = 'http://127.0.0.1:4173'
const routes = ['/', '/#/plan', '/#/day/2026-11-16', '/#/places', '/#/place/jade-dragon', '/#/food', '/#/budget', '/#/more']
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
const external = new Set()
page.on('request', (r) => { if (!r.url().startsWith(BASE)) external.add(r.url()) })

await page.goto(BASE)
await page.waitForFunction(() => navigator.serviceWorker?.controller || navigator.serviceWorker?.ready, null, { timeout: 15000 })
await page.waitForSelector('.badge.ok', { timeout: 30000 })
console.log('SW ready; offline badge shown')
await page.reload()
await page.waitForFunction(() => !!navigator.serviceWorker.controller)

await ctx.setOffline(true)
let failed = 0
for (const r of routes) {
  await page.goto(BASE + r)
  await page.reload()
  const ok = await page.waitForSelector('.content h2, .content section', { timeout: 8000 }).then(() => true).catch(() => false)
  const imgsBroken = await page.$$eval('img.img', (els) => els.filter((e) => e.complete && e.naturalWidth === 0).length)
  console.log(ok ? 'OK  ' : 'FAIL', r, 'broken imgs:', imgsBroken)
  if (!ok) failed++
}
console.log('external requests:', [...external])
await page.goto(BASE + '/#/places'); await page.screenshot({ path: process.argv[2] || '/tmp/places.png' })
await browser.close()
process.exit(failed || external.size ? 1 : 0)
