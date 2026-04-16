import { useStore } from '../context/StoreContext'

export default function AnnouncementBar() {
  const { settings } = useStore()
  const text = settings.announcementText || 'KH Factory — Premium Quality'
  // Duplicate text to create seamless loop
  const items = Array(8).fill(text)

  return (
    <div className="bg-kh-black text-white py-2.5 overflow-hidden select-none">
      <div className="marquee-track">
        {items.map((t, i) => (
          <span key={i} className="text-xs font-body font-medium tracking-widest uppercase whitespace-nowrap px-10">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
