import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, SIZES } from '../data/initialProducts'

export default function Shop() {
  const { products } = useStore()
  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || 'all')
  const [sortBy, setSortBy] = useState('newest')

  // Sync category from URL
  useEffect(() => {
    const cat = searchParams.get('cat') || 'all'
    setSelectedCat(cat)
  }, [searchParams])

  function toggleSize(size) {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  function setCategory(cat) {
    setSelectedCat(cat)
    if (cat === 'all') {
      searchParams.delete('cat')
    } else {
      searchParams.set('cat', cat)
    }
    setSearchParams(searchParams)
  }

  const filtered = useMemo(() => {
    let result = products

    // Category filter
    if (selectedCat !== 'all') {
      result = result.filter(p => p.category === selectedCat)
    }

    // Size filter — show products that have ALL selected sizes available
    if (selectedSizes.length > 0) {
      result = result.filter(p =>
        selectedSizes.every(s => p.sizes?.[s] === true)
      )
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price)
      case 'featured':
        return [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      default: // newest
        return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }, [products, selectedCat, selectedSizes, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-5xl font-800 uppercase text-kh-black">Shop</h1>
        <p className="text-sm text-kh-muted mt-1 font-body">{filtered.length} products</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── FILTERS SIDEBAR ──────────────────────────────────── */}
        <aside className="lg:w-56 flex-shrink-0">
          {/* Category */}
          <div className="mb-8">
            <h3 className="label mb-3">Category</h3>
            <ul className="space-y-1">
              {[{ id: 'all', label: 'All Products' }, ...CATEGORIES].map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => setCategory(cat.id)}
                    className={`w-full text-left text-sm py-2 px-3 transition-all duration-150 font-body
                      ${selectedCat === cat.id
                        ? 'bg-kh-black text-white font-600'
                        : 'text-kh-muted hover:text-kh-black hover:bg-kh-gray'
                      }`}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Size filter */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="label">Filter by Size</h3>
              {selectedSizes.length > 0 && (
                <button
                  onClick={() => setSelectedSizes([])}
                  className="text-[10px] text-kh-muted hover:text-kh-black uppercase tracking-widest font-700 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`size-btn font-body ${
                    selectedSizes.includes(size) ? 'size-btn-active' : 'size-btn-inactive'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSizes.length > 0 && (
              <p className="text-[11px] text-kh-muted mt-2 font-body">
                Showing products with: {selectedSizes.join(', ')}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-kh-border"/>
        </aside>

        {/* ── PRODUCTS GRID ────────────────────────────────────── */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-kh-border">
            <div className="flex flex-wrap gap-2">
              {selectedSizes.map(s => (
                <span key={s} className="inline-flex items-center gap-1.5 text-xs font-700 bg-kh-black text-white px-3 py-1.5">
                  Size: {s}
                  <button onClick={() => toggleSize(s)} className="hover:opacity-70">×</button>
                </span>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs font-body font-600 uppercase tracking-widest border border-kh-border px-3 py-2 bg-white focus:outline-none focus:border-kh-black transition-colors"
            >
              <option value="newest">Newest</option>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-kh-muted">
              <p className="font-body text-lg">No products found.</p>
              {selectedSizes.length > 0 && (
                <button
                  onClick={() => setSelectedSizes([])}
                  className="mt-4 text-xs font-700 uppercase tracking-widest text-kh-black hover:underline"
                >
                  Clear size filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
