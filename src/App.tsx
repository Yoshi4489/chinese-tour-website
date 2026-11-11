import { NavLink, Route, Routes } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import Home from './pages/Home'
import Plan from './pages/Plan'
import DayPage from './pages/DayPage'
import Places from './pages/Places'
import PlaceDetail from './pages/PlaceDetail'
import FoodPage from './pages/FoodPage'
import Budget from './pages/Budget'
import More from './pages/More'

const tabs = [
  { to: '/', label: 'วันนี้', icon: '📍' },
  { to: '/plan', label: 'แผน', icon: '🗓️' },
  { to: '/places', label: 'ที่เที่ยว', icon: '🏔️' },
  { to: '/food', label: 'อาหาร', icon: '🍜' },
  { to: '/budget', label: 'งบ', icon: '💴' },
  { to: '/more', label: 'อื่น ๆ', icon: '⋯' },
]

export default function App() {
  const {
    offlineReady: [offlineReady],
  } = useRegisterSW()
  // รีโหลดหลังติดตั้งแล้ว SW คุมหน้าอยู่ = พร้อมออฟไลน์แล้ว
  const ready = offlineReady || (typeof navigator !== 'undefined' && !!navigator.serviceWorker?.controller)
  return (
    <div className="app">
      <header className="topbar">
        <strong>ยูนนาน 12–24 พ.ย.</strong>
        <span className={ready ? 'badge ok' : 'badge'}>{ready ? 'พร้อมออฟไลน์ ✓' : 'กำลังเตรียมออฟไลน์…'}</span>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/day/:date" element={<DayPage />} />
          <Route path="/places" element={<Places />} />
          <Route path="/place/:id" element={<PlaceDetail />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/more" element={<More />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <nav className="tabbar">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
            <span className="ti">{t.icon}</span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
