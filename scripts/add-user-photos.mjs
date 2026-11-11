// แปลงรูปที่ผู้ใช้ให้มาเป็น webp ใส่ public/images/places/<id>.webp
// ใช้: node scripts/add-user-photos.mjs <id>=<path> ...
import sharp from 'sharp'
for (const arg of process.argv.slice(2)) {
  const [id, src] = arg.split('=')
  await sharp(src).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 74 }).toFile(`public/images/places/${id}.webp`)
  console.log('OK', id)
}
