import { useParams } from 'react-router-dom'
import { dayByDate } from '../data/trip'
import DayView from '../components/DayView'

export default function DayPage() {
  const { date } = useParams()
  const day = date ? dayByDate(date) : undefined
  return day ? <DayView day={day} /> : <p>ไม่พบวันนี้</p>
}
