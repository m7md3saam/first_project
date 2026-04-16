import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { SIZES, CATEGORIES } from '../data/initialProducts'

export default function ProductDetail() {
  const { id } = useParams()
  const { products, addToCart, orderSingleWhatsApp } = useStore()

  const product = products.find(p => p.id === id)
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="font-heading text-4xl font-700 text-kh-black mb-4">Product Not Found</h1>
        <Link to="/shop" className="btn-primary inline-block mt-2">Back to Shop</Link>
      </div>
    )
  }

  const isOnSale = product.originalPrice && product.originalPrice > product.price
  const discount = isOnSale ? Math.round((1 - product.price / product.originalPrice) * 100) : 0
  const catLabel = CATEGORIES.find(c => c.id === product.category)?.label || product.category

  function requireSize(fn) {
    if (!selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 2000)
      return
    }
    fn()
  }

  function handleAddToCart() {
    requireSize(() => {
      addToCart(product, selectedSize)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    })
  }

  function handleWhatsApp() {
    requireSize(() => orderSingleWhatsApp(product, selectedSize))
  }

  // Related products (same category, exclude current)
  const related = products.filter(p => p.category === product.category && p.id !== product.id && p.inStock).slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-kh-muted uppercase tracking-widest font-700 mb-8">
        <Link to="/" className="hover:text-kh-black transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-kh-black transition-colors">Shop</Link>
        <span>/</span>
        <Link to={`/shop?cat=${product.category}`} className="hover:text-kh-black transition-colors">{catLabel}</Link>
        <span>/</span>
        <span className="text-kh-black truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* ── IMAGE GALLERY ─────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="aspect-[4/5] bg-kh-gray overflow-hidden relative">
            {product.images?.[activeImg] ? (
              <img
                src={product.images[activeImg]}
                alt={`${product.name} — view ${activeImg + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-heading text-6xl text-gray-300 font-700">KH</span>
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-kh-black font-heading text-xl font-700 uppercase tracking-widest px-6 py-3">
                  Out of Stock
                </span>
              </div>
            )}
            {isOnSale && product.inStock && (
              <span className="absolute top-4 left-4 bg-kh-red text-white text-xs font-700 uppercase tracking-widest px-3 py-1.5">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-20 h-24 overflow-hidden border-2 transition-colors duration-150 ${
                    activeImg === i ? 'border-kh-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── PRODUCT INFO ──────────────────────────────────────── */}
        <div className="flex flex-col">
          {/* Category */}
          <Link
            to={`/shop?cat=${product.category}`}
            className="text-xs font-700 uppercase tracking-[0.25em] text-kh-muted hover:text-kh-black transition-colors mb-3"
          >
            {catLabel}
          </Link>

          {/* Name */}
          <h1 className="font-heading text-4xl lg:text-5xl font-700 uppercase text-kh-black leading-tight mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-heading text-3xl font-700 text-kh-black">
              {product.price.toLocaleString()} EGP
            </span>
            {isOnSale && (
              <span className="text-lg text-kh-muted line-through font-body">
                {product.originalPrice.toLocaleString()} EGP
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-kh-muted leading-relaxed font-body mb-8 border-t border-kh-border pt-6">
              {product.description}
            </p>
          )}

          {/* Size selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="label">Select Size</span>
              {selectedSize && (
                <span className="text-xs font-700 text-kh-black">Selected: {selectedSize}</span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map(size => {
                const avail = product.sizes?.[size]
                return (
                  <button
                    key={size}
                    disabled={!avail}
                    onClick={() => avail && setSelectedSize(size)}
                    className={`w-16 h-12 text-sm font-700 uppercase tracking-wide border-2 transition-all duration-150
                      ${selectedSize === size
                        ? 'bg-kh-black text-white border-kh-black'
                        : avail
                          ? 'bg-white text-kh-black border-kh-border hover:border-kh-black'
                          : 'bg-kh-gray text-gray-300 border-kh-border cursor-not-allowed line-through'
                      }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            {sizeError && (
              <p className="text-xs text-kh-red font-700 mt-2 animate-pulse">
                ⚠ Please select a size first
              </p>
            )}
          </div>

          {/* Actions */}
          {product.inStock ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 font-body font-700 text-sm uppercase tracking-widest transition-all duration-200 ${
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-kh-black text-white hover:bg-gray-800'
                }`}
              >
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWhatsApp}
                className="w-full py-4 bg-kh-wa text-white font-body font-700 text-sm uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order on WhatsApp
              </button>
            </div>
          ) : (
            <div className="py-4 text-center font-body font-700 text-sm uppercase tracking-widest bg-kh-gray text-kh-muted">
              Currently Out of Stock
            </div>
          )}

          {/* Meta */}
          <div className="mt-8 pt-6 border-t border-kh-border space-y-2">
            <p className="text-xs text-kh-muted font-body">
              <span className="font-700 text-kh-black uppercase tracking-wide">Category:</span> {catLabel}
            </p>
            <p className="text-xs text-kh-muted font-body">
              <span className="font-700 text-kh-black uppercase tracking-wide">Available Sizes:</span>{' '}
              {SIZES.filter(s => product.sizes?.[s]).join(' · ') || 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ──────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mt-20 pt-10 border-t border-kh-border">
          <h2 className="font-heading text-3xl font-700 uppercase text-kh-black mb-8">
            You May Also Like
          </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map(p => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Minimal related card (avoids circular import issues)
function RelatedCard({ product }) {
  const isOnSale = product.originalPrice && product.originalPrice > product.price
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="aspect-[3/4] bg-kh-gray overflow-hidden mb-3 relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-heading text-3xl text-gray-300 font-700">KH</span>
          </div>
        )}
        {isOnSale && (
          <span className="absolute top-2 left-2 bg-kh-red text-white text-[10px] font-700 uppercase px-2 py-1">
            Sale
          </span>
        )}
      </div>
      <h3 className="font-body font-600 text-sm text-kh-black leading-snug line-clamp-2 group-hover:underline">
        {product.name}
      </h3>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="font-heading text-lg font-700">{product.price.toLocaleString()} EGP</span>
        {isOnSale && (
          <span className="text-xs text-kh-muted line-through">{product.originalPrice.toLocaleString()} EGP</span>
        )}
      </div>
    </Link>
  )
}
