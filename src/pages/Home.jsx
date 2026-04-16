import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import { CATEGORIES } from '../data/initialProducts'

const CATEGORY_ICONS = {
  tshirt: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
    </svg>
  ),
  shirt: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
      <path d="M12 2v8"/>
    </svg>
  ),
}

export default function Home() {
  const { products } = useStore()
  const featured = products.filter(p => p.featured && p.inStock).slice(0, 8)

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-kh-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36 flex flex-col items-start gap-6">
          {/* Label */}
          <span className="text-xs font-700 uppercase tracking-[0.3em] text-gray-400 border border-gray-700 px-3 py-1">
            New Collection — 2025
          </span>
          {/* Headline */}
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-800 uppercase leading-none tracking-tight">
            KH<br/>
            <span className="text-gray-500">Factory</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md leading-relaxed font-body">
            Premium men's t-shirts &amp; shirts. Factory-direct prices with uncompromising quality.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link to="/shop" className="bg-white text-kh-black px-8 py-3.5 font-body font-700 text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors">
              Shop Now
            </Link>
            <Link to="/shop?cat=shirt" className="border border-gray-600 text-white px-8 py-3.5 font-body font-700 text-sm uppercase tracking-widest hover:border-white transition-colors">
              View Shirts
            </Link>
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-gray-900 to-transparent hidden lg:block pointer-events-none"/>
        <div className="absolute bottom-6 right-8 font-heading text-[120px] font-900 text-gray-900 leading-none select-none hidden lg:block">
          2025
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-heading text-4xl font-700 uppercase tracking-tight mb-8 text-kh-black">
          Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?cat=${cat.id}`}
              className="group relative bg-kh-gray overflow-hidden flex items-end p-8 min-h-[220px] hover:bg-kh-black transition-colors duration-300"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-5 transition-opacity">
                <span className="font-heading font-900 text-[180px] text-kh-black group-hover:text-white leading-none">
                  {cat.label.charAt(0)}
                </span>
              </div>
              <div className="relative z-10">
                <div className="text-kh-black group-hover:text-white transition-colors mb-3">
                  {CATEGORY_ICONS[cat.id]}
                </div>
                <h3 className="font-heading text-3xl font-700 uppercase text-kh-black group-hover:text-white transition-colors">
                  {cat.label}
                </h3>
                <p className="text-sm text-kh-muted group-hover:text-gray-300 transition-colors mt-1 font-body">
                  {cat.labelAr}
                </p>
              </div>
              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <span className="text-white font-body font-700 text-sm uppercase tracking-widest flex items-center gap-2">
                  Shop →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-kh-black">
            Best Sellers
          </h2>
          <Link to="/shop" className="text-xs font-700 uppercase tracking-widest text-kh-muted hover:text-kh-black transition-colors">
            View All →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-kh-muted">
            <p className="font-body">No products yet. Add products from the admin panel.</p>
            <Link to="/admin" className="text-xs font-700 uppercase tracking-widest mt-4 inline-block hover:text-kh-black transition-colors">
              Go to Admin →
            </Link>
          </div>
        )}
      </section>

      {/* ── BANNER STRIP ─────────────────────────────────────────── */}
      <section className="bg-kh-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { icon: '🏭', title: 'Factory Direct', desc: 'No middlemen. Direct from our production lines.' },
            { icon: '📏', title: '4 Core Sizes', desc: 'M · L · XL · 2XL — always available.' },
            { icon: '📲', title: 'Order on WhatsApp', desc: 'Simple, instant ordering via WhatsApp.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <span className="text-4xl">{icon}</span>
              <h3 className="font-heading text-xl font-700 uppercase tracking-wide">{title}</h3>
              <p className="text-sm text-gray-400 font-body leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
