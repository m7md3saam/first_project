import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { INITIAL_PRODUCTS } from '../data/initialProducts'

const StoreContext = createContext(null)

const STORAGE_KEYS = {
  PRODUCTS: 'kh_products',
  CART: 'kh_cart',
  ADMIN: 'kh_admin_session',
  SETTINGS: 'kh_settings',
}

const DEFAULT_SETTINGS = {
  announcementText: 'Free Shipping on Orders Over 2000 EGP  •  Premium Quality Factory Prices  •  مصنع KH للملابس الرجالية',
  whatsappNumber: '201036689366',
  adminPassword: 'kh2024admin',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('localStorage error:', e)
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => load(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS))
  const [cart, setCart]         = useState(() => load(STORAGE_KEYS.CART, []))
  const [settings, setSettings] = useState(() => load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS))
  const [isAdmin, setIsAdmin]   = useState(() => sessionStorage.getItem(STORAGE_KEYS.ADMIN) === 'true')
  const [cartOpen, setCartOpen] = useState(false)

  // Persist whenever these change
  useEffect(() => save(STORAGE_KEYS.PRODUCTS, products), [products])
  useEffect(() => save(STORAGE_KEYS.CART, cart), [cart])
  useEffect(() => save(STORAGE_KEYS.SETTINGS, settings), [settings])

  // ── CART ─────────────────────────────────────────────────────────
  const addToCart = useCallback((product, size) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id && i.size === size)
      if (existing) {
        return prev.map(i =>
          i.productId === product.id && i.size === size
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      }
      return [
        ...prev,
        {
          id: `${product.id}-${size}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          size,
          qty: 1,
        },
      ]
    })
    setCartOpen(true)
  }, [])

  const removeFromCart = useCallback(id => {
    setCart(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  // ── WHATSAPP ORDER ────────────────────────────────────────────────
  const sendCartToWhatsApp = useCallback(() => {
    if (cart.length === 0) return
    const lines = cart.map(
      i => `• ${i.name} — مقاس ${i.size} × ${i.qty} — ${(i.price * i.qty).toLocaleString()} EGP`
    )
    const total = `\n💰 الإجمالي: ${cartTotal.toLocaleString()} EGP`
    const msg = `مرحباً 👋\n\nأريد أن أطلب:\n${lines.join('\n')}${total}\n\nمن فضلك تأكيد الطلب 🙏`
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank')
  }, [cart, cartTotal, settings.whatsappNumber])

  const orderSingleWhatsApp = useCallback((product, size) => {
    const msg = `مرحباً 👋\n\nأريد أن أطلب:\n• ${product.name} — مقاس ${size} — ${product.price.toLocaleString()} EGP\n\nمن فضلك تأكيد الطلب 🙏`
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank')
  }, [settings.whatsappNumber])

  // ── PRODUCTS ──────────────────────────────────────────────────────
  const addProduct = useCallback(product => {
    const newProduct = { ...product, id: String(Date.now()), createdAt: new Date().toISOString() }
    setProducts(prev => [newProduct, ...prev])
    return newProduct
  }, [])

  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])

  const deleteProduct = useCallback(id => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  // ── ADMIN AUTH ────────────────────────────────────────────────────
  const adminLogin = useCallback(password => {
    if (password === settings.adminPassword) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN, 'true')
      setIsAdmin(true)
      return true
    }
    return false
  }, [settings.adminPassword])

  const adminLogout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN)
    setIsAdmin(false)
  }, [])

  const updateSettings = useCallback(updates => {
    setSettings(prev => ({ ...prev, ...updates }))
  }, [])

  return (
    <StoreContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartCount, cartTotal, cartOpen, setCartOpen,
      sendCartToWhatsApp, orderSingleWhatsApp,
      isAdmin, adminLogin, adminLogout,
      settings, updateSettings,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
