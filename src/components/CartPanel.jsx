import { useStore } from '../context/StoreContext'

export default function CartPanel() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal, sendCartToWhatsApp, clearCart } = useStore()

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Panel */}
      <div className={`cart-panel fixed right-0 top-0 h-full z-50 bg-white w-full max-w-sm shadow-2xl flex flex-col
        ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-kh-border">
          <h2 className="font-heading text-2xl font-700 uppercase tracking-wide">Cart ({cart.length})</h2>
          <button onClick={() => setCartOpen(false)} className="text-kh-muted hover:text-kh-black transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-kh-muted">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p className="font-body text-sm">Your cart is empty</p>
            </div>
          ) : (
            <ul className="px-4 space-y-4">
              {cart.map(item => (
                <li key={item.id} className="flex gap-4 py-3 border-b border-kh-border">
                  {/* Image */}
                  <div className="w-20 h-24 bg-kh-gray flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-kh-muted text-xs">No img</div>
                    )}
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-600 text-sm text-kh-black leading-tight mb-1 truncate">{item.name}</p>
                    <p className="text-xs text-kh-muted mb-2">Size: {item.size}</p>
                    <p className="text-sm font-700 text-kh-black">{(item.price * item.qty).toLocaleString()} EGP</p>
                    {/* Qty control */}
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 border border-kh-border hover:border-kh-black flex items-center justify-center text-sm transition-colors">−</button>
                      <span className="text-sm font-600 w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 border border-kh-border hover:border-kh-black flex items-center justify-center text-sm transition-colors">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-auto text-kh-muted hover:text-kh-red transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-kh-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body font-600 text-sm uppercase tracking-widest text-kh-muted">Total</span>
              <span className="font-heading text-2xl font-700">{cartTotal.toLocaleString()} EGP</span>
            </div>
            <button
              onClick={sendCartToWhatsApp}
              className="w-full bg-kh-wa text-white py-3.5 font-body font-700 text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order on WhatsApp
            </button>
            <button onClick={clearCart} className="w-full text-xs text-kh-muted hover:text-kh-red text-center transition-colors uppercase tracking-widest">
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
