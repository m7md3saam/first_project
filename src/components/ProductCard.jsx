import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { SIZES } from '../data/initialProducts'

export default function ProductCard({ product }) {
  const { addToCart, orderSingleWhatsApp } = useStore()
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)

  const isOnSale = product.originalPrice && product.originalPrice > product.price
  const discount  = isOnSale ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  // Prevent the parent <Link> from navigating when clicking interactive elements inside
  function stopNav(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleSizeClick(e, size) {
    stopNav(e)
    setSelectedSize(prev => prev === size ? null : size) // toggle
  }

  function handleAdd(e) {
    stopNav(e)
    if (!selectedSize) return
    addToCart(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleWhatsApp(e) {
    stopNav(e)
    if (!selectedSize) return
    orderSingleWhatsApp(product, selectedSize)
  }

  return (
    <article className="group flex flex-col bg-white">
      {/* ── IMAGE ──────────────────────────────────────────────── */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4] bg-kh-gray product-img-wrap">

        {/* Images — using explicit CSS classes (img-primary / img-secondary) for hover swap.
            This avoids the :last-child bug caused by badge divs coming after images in the DOM. */}
        {product.images?.[0] ? (
          <>
            <img
              src={product.images[0]}
              alt={product.name}
              className="img-primary w-full h-full object-cover"
              loading="lazy"
            />
            {product.images?.[1] && (
              <img
                src={product.images[1]}
                alt={product.name}
                className="img-secondary w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-heading text-4xl text-gray-300 font-700">KH</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {!product.inStock && (
            <span className="bg-kh-muted text-white text-[10px] font-700 uppercase tracking-widest px-2 py-1">
              Sold Out
            </span>
          )}
          {isOnSale && product.inStock && (
            <span className="bg-kh-red text-white text-[10px] font-700 uppercase tracking-widest px-2 py-1">
              -{discount}%
            </span>
          )}
          {product.featured && product.inStock && (
            <span className="bg-kh-black text-white text-[10px] font-700 uppercase tracking-widest px-2 py-1">
              Featured
            </span>
          )}
        </div>

        {/* Desktop hover overlay — quick size selector.
            stopPropagation on each button prevents Link navigation. */}
        {product.inStock && (
          <div
            className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm py-3 px-3 z-10
              transform translate-y-full group-hover:translate-y-0 transition-transform duration-250"
          >
            <p className="text-[11px] font-700 uppercase tracking-widest text-center text-kh-muted mb-2">
              Quick Select Size
            </p>
            <div className="flex gap-1.5 justify-center flex-wrap">
              {SIZES.map(size => {
                const avail = product.sizes?.[size]
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!avail}
                    onClick={e => avail ? handleSizeClick(e, size) : stopNav(e)}
                    className={`size-btn text-[11px] ${
                      selectedSize === size
                        ? 'size-btn-active'
                        : avail
                          ? 'size-btn-inactive'
                          : 'size-btn-unavailable'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </Link>

      {/* ── INFO ───────────────────────────────────────────────── */}
      <div className="pt-3 pb-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-body font-600 text-sm text-kh-black leading-snug hover:underline line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-heading text-xl font-700 text-kh-black">
            {product.price.toLocaleString()} EGP
          </span>
          {isOnSale && (
            <span className="text-sm text-kh-muted line-through">
              {product.originalPrice.toLocaleString()} EGP
            </span>
          )}
        </div>

        {/* Size selector — always visible below info */}
        {product.inStock && (
          <div className="flex gap-1.5 mt-2.5 flex-wrap">
            {SIZES.map(size => {
              const avail = product.sizes?.[size]
              return (
                <button
                  key={size}
                  type="button"
                  disabled={!avail}
                  onClick={() => avail && setSelectedSize(prev => prev === size ? null : size)}
                  className={`size-btn text-[11px] ${
                    selectedSize === size
                      ? 'size-btn-active'
                      : avail
                        ? 'size-btn-inactive'
                        : 'size-btn-unavailable'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        )}

        {/* Status hint */}
        <p className="text-[11px] text-kh-muted mt-1.5 font-body min-h-[16px]">
          {product.inStock
            ? selectedSize
              ? <>Size: <strong className="text-kh-black">{selectedSize}</strong> — ready to order</>
              : 'Select a size to order'
            : null
          }
        </p>

        {/* Action buttons */}
        {product.inStock ? (
          <div className="flex gap-2 mt-2.5">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedSize}
              className={`flex-1 py-2.5 text-xs font-700 uppercase tracking-widest transition-all duration-150
                ${added
                  ? 'bg-green-600 text-white'
                  : selectedSize
                    ? 'bg-kh-black text-white hover:bg-gray-800'
                    : 'bg-kh-gray text-kh-muted cursor-not-allowed'
                }`}
            >
              {added ? '✓ Added' : 'Add to Cart'}
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              disabled={!selectedSize}
              title="Order via WhatsApp"
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center transition-all duration-150
                ${selectedSize
                  ? 'bg-kh-wa text-white hover:opacity-90'
                  : 'bg-kh-gray text-kh-muted cursor-not-allowed'
                }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
          </div>
        ) : (
          <div className="mt-3 py-2.5 text-center text-xs font-700 uppercase tracking-widest bg-kh-gray text-kh-muted">
            Out of Stock
          </div>
        )}
      </div>
    </article>
  )
}
