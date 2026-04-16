import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import CartPanel from './CartPanel'

const NAV_LINKS = [
  { to: '/',            label: 'Home'    },
  { to: '/shop',        label: 'Shop'    },
  { to: '/shop?cat=tshirt', label: "T-Shirts" },
  { to: '/shop?cat=shirt',  label: 'Shirts'   },
]

export default function Navbar() {
  const { cartCount, cartOpen, setCartOpen } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-kh-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-kh-black text-white font-heading font-800 text-2xl w-10 h-10 flex items-center justify-center tracking-tighter group-hover:bg-gray-800 transition-colors">
              KH
            </div>
            <span className="hidden sm:block font-heading text-xl font-700 tracking-wide uppercase text-kh-black">
              Factory
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={label}>
                <Link
                  to={to}
                  className={`text-sm font-semibold uppercase tracking-widest transition-colors duration-150 ${
                    location.pathname === to.split('?')[0] && to !== '/shop'
                      ? 'text-kh-black border-b-2 border-kh-black pb-0.5'
                      : 'text-kh-muted hover:text-kh-black'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 text-kh-black hover:opacity-70 transition-opacity"
              aria-label="Open cart"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-kh-black text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1 ml-1"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-kh-black transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}/>
              <span className={`block w-6 h-0.5 bg-kh-black transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}/>
              <span className={`block w-6 h-0.5 bg-kh-black transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-kh-border bg-white">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-sm font-semibold uppercase tracking-widest text-kh-muted hover:text-kh-black hover:bg-kh-gray transition-colors border-b border-kh-border"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <CartPanel />
    </>
  )
}
