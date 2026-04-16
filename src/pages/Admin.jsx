import { useState, useRef } from 'react'
import { useStore } from '../context/StoreContext'
import { CATEGORIES, SIZES } from '../data/initialProducts'

// ─── ADMIN LOGIN ───────────────────────────────────────────────────────────
function AdminLogin() {
  const { adminLogin } = useStore()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const ok = adminLogin(password)
      if (!ok) {
        setError('Incorrect password. Try again.')
        setPassword('')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div className="min-h-screen bg-kh-gray flex items-center justify-center px-4">
      <div className="bg-white border border-kh-border p-10 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-kh-black text-white font-heading font-800 text-2xl w-10 h-10 flex items-center justify-center">
            KH
          </div>
          <div>
            <h1 className="font-heading text-2xl font-700 uppercase">Admin Panel</h1>
            <p className="text-xs text-kh-muted font-body">KH Factory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter admin password"
              autoFocus
              required
            />
            {error && <p className="text-xs text-kh-red mt-2 font-700">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-kh-black text-white py-3 font-body font-700 text-sm uppercase tracking-widest
                       hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Login'}
          </button>
        </form>

        <p className="text-[11px] text-kh-muted text-center mt-6 font-body">
          Default password: <code className="font-mono bg-kh-gray px-1 py-0.5">kh2024admin</code><br/>
          Change it from Settings after login.
        </p>
      </div>
    </div>
  )
}

// ─── PRODUCT FORM ───────────────────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel }) {
  const fileRef = useRef(null)
  const [form, setForm] = useState(initial || {
    name: '',
    category: 'tshirt',
    price: '',
    originalPrice: '',
    description: '',
    images: [],
    sizes: { M: true, L: true, XL: true, '2XL': true },
    featured: false,
    inStock: true,
  })
  const [imageInput, setImageInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function toggleSize(size) {
    setForm(f => ({ ...f, sizes: { ...f.sizes, [size]: !f.sizes[size] } }))
  }

  function addImageUrl() {
    const url = imageInput.trim()
    if (!url) return
    set('images', [...(form.images || []), url])
    setImageInput('')
  }

  function uploadImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB for local storage. Use a URL instead for larger images.')
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = ev => {
      set('images', [...(form.images || []), ev.target.result])
      setUploading(false)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function removeImage(idx) {
    set('images', form.images.filter((_, i) => i !== idx))
  }

  function moveImage(idx, dir) {
    const imgs = [...form.images]
    const to = idx + dir
    if (to < 0 || to >= imgs.length) return
    ;[imgs[idx], imgs[to]] = [imgs[to], imgs[idx]]
    set('images', imgs)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required'
    if (form.originalPrice && (isNaN(form.originalPrice) || Number(form.originalPrice) <= 0)) e.originalPrice = 'Must be a positive number'
    if (!SIZES.some(s => form.sizes[s])) e.sizes = 'At least one size must be available'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="label">Product Name *</label>
        <input
          value={form.name}
          onChange={e => set('name', e.target.value)}
          className="input-field"
          placeholder="e.g. Classic Black Oversized T-Shirt"
        />
        {errors.name && <p className="text-xs text-kh-red mt-1">{errors.name}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="label">Category *</label>
        <select value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Price (EGP) *</label>
          <input
            type="number"
            value={form.price}
            onChange={e => set('price', e.target.value)}
            className="input-field"
            placeholder="299"
            min="0"
          />
          {errors.price && <p className="text-xs text-kh-red mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="label">Original Price (EGP)</label>
          <input
            type="number"
            value={form.originalPrice || ''}
            onChange={e => set('originalPrice', e.target.value)}
            className="input-field"
            placeholder="450 (for Sale badge)"
            min="0"
          />
          {errors.originalPrice && <p className="text-xs text-kh-red mt-1">{errors.originalPrice}</p>}
          <p className="text-[11px] text-kh-muted mt-1">Leave blank if not on sale</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          className="input-field min-h-[80px] resize-y"
          placeholder="Product details, material, fit..."
        />
      </div>

      {/* Sizes */}
      <div>
        <label className="label">Available Sizes *</label>
        <div className="flex gap-3 flex-wrap">
          {SIZES.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`size-btn ${form.sizes[size] ? 'size-btn-active' : 'size-btn-inactive'}`}
            >
              {size}
            </button>
          ))}
        </div>
        {errors.sizes && <p className="text-xs text-kh-red mt-1">{errors.sizes}</p>}
        <p className="text-[11px] text-kh-muted mt-2">Click to toggle size availability</p>
      </div>

      {/* Images */}
      <div>
        <label className="label">Product Images</label>

        {/* URL input */}
        <div className="flex gap-2 mb-3">
          <input
            value={imageInput}
            onChange={e => setImageInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl() } }}
            className="input-field flex-1"
            placeholder="Paste image URL (https://...)"
          />
          <button
            type="button"
            onClick={addImageUrl}
            disabled={!imageInput.trim()}
            className="px-4 py-2 bg-kh-black text-white text-xs font-700 uppercase tracking-widest
                       hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            Add
          </button>
        </div>

        {/* File upload */}
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} className="hidden"/>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-kh-border hover:border-kh-black transition-colors
                       py-4 text-sm font-body font-600 text-kh-muted hover:text-kh-black flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            {uploading ? 'Uploading...' : 'Upload Image (max 2MB)'}
          </button>
          <p className="text-[11px] text-kh-muted mt-1.5">
            💡 For best results, use an image hosting service (Cloudinary, ImgBB) and paste the URL above.
          </p>
        </div>

        {/* Preview grid */}
        {form.images?.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative group aspect-square bg-kh-gray overflow-hidden">
                <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover"/>
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-kh-black text-white text-[9px] font-700 px-1.5 py-0.5 uppercase">
                    Main
                  </span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      className="w-6 h-6 bg-white text-kh-black text-xs flex items-center justify-center hover:bg-gray-100"
                      title="Move left"
                    >←</button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="w-6 h-6 bg-kh-red text-white text-xs flex items-center justify-center hover:opacity-80"
                    title="Remove"
                  >×</button>
                  {i < form.images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      className="w-6 h-6 bg-white text-kh-black text-xs flex items-center justify-center hover:bg-gray-100"
                      title="Move right"
                    >→</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flags */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={e => set('featured', e.target.checked)}
            className="w-4 h-4 accent-kh-black"
          />
          <span className="text-sm font-body font-600">Featured / Best Seller</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={e => set('inStock', e.target.checked)}
            className="w-4 h-4 accent-kh-black"
          />
          <span className="text-sm font-body font-600">In Stock</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-kh-black text-white py-3 font-body font-700 text-sm uppercase tracking-widest
                     hover:bg-gray-800 transition-colors"
        >
          {initial ? 'Save Changes' : 'Add Product'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-kh-border text-kh-muted text-sm font-700 uppercase tracking-widest
                       hover:border-kh-black hover:text-kh-black transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

// ─── SETTINGS TAB ──────────────────────────────────────────────────────────
function SettingsTab() {
  const { settings, updateSettings } = useStore()
  const [form, setForm] = useState({ ...settings })
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-6">
      <div>
        <label className="label">WhatsApp Number</label>
        <input
          value={form.whatsappNumber}
          onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))}
          className="input-field"
          placeholder="201036689366"
        />
        <p className="text-[11px] text-kh-muted mt-1">Include country code, no + or spaces. e.g. 201036689366</p>
      </div>
      <div>
        <label className="label">Announcement Bar Text</label>
        <input
          value={form.announcementText}
          onChange={e => setForm(f => ({ ...f, announcementText: e.target.value }))}
          className="input-field"
        />
      </div>
      <div>
        <label className="label">Admin Password</label>
        <input
          type="text"
          value={form.adminPassword}
          onChange={e => setForm(f => ({ ...f, adminPassword: e.target.value }))}
          className="input-field font-mono"
        />
        <p className="text-[11px] text-kh-muted mt-1">⚠ Write it down before changing!</p>
      </div>
      <button
        type="submit"
        className={`px-8 py-3 font-body font-700 text-sm uppercase tracking-widest transition-all ${
          saved ? 'bg-green-600 text-white' : 'bg-kh-black text-white hover:bg-gray-800'
        }`}
      >
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </form>
  )
}

// ─── MAIN ADMIN DASHBOARD ──────────────────────────────────────────────────
function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct, adminLogout } = useStore()
  const [tab, setTab] = useState('products')   // 'products' | 'add' | 'settings'
  const [editing, setEditing] = useState(null) // product being edited
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  function handleAdd(data) {
    addProduct(data)
    setTab('products')
  }

  function handleUpdate(data) {
    updateProduct(editing.id, data)
    setEditing(null)
    setTab('products')
  }

  function handleDelete(id) {
    deleteProduct(id)
    setConfirmDelete(null)
  }

  // Stats
  const totalProducts = products.length
  const inStockCount = products.filter(p => p.inStock).length
  const featuredCount = products.filter(p => p.featured).length
  const catCounts = CATEGORIES.reduce((acc, c) => {
    acc[c.id] = products.filter(p => p.category === c.id).length
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-kh-gray">
      {/* Admin nav */}
      <header className="bg-kh-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-kh-black font-heading font-800 text-lg w-8 h-8 flex items-center justify-center">
              KH
            </div>
            <span className="font-heading text-lg font-700 uppercase tracking-wide">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-white transition-colors font-body uppercase tracking-widest">
              View Site ↗
            </a>
            <button
              onClick={adminLogout}
              className="text-xs text-gray-400 hover:text-white transition-colors font-body uppercase tracking-widest"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: totalProducts },
            { label: 'In Stock', value: inStockCount },
            { label: 'Featured', value: featuredCount },
            ...CATEGORIES.map(c => ({ label: c.label, value: catCounts[c.id] || 0 })),
          ].slice(0, 4).map(({ label, value }) => (
            <div key={label} className="bg-white border border-kh-border p-4">
              <p className="text-[11px] font-700 uppercase tracking-widest text-kh-muted">{label}</p>
              <p className="font-heading text-3xl font-700 text-kh-black mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-kh-border">
          {[
            { id: 'products', label: 'Products' },
            { id: 'add',      label: '+ Add Product' },
            { id: 'settings', label: 'Settings' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setEditing(null) }}
              className={`px-6 py-3 text-sm font-body font-700 uppercase tracking-widest border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-kh-black text-kh-black'
                  : 'border-transparent text-kh-muted hover:text-kh-black'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS LIST ── */}
        {tab === 'products' && !editing && (
          <div className="bg-white border border-kh-border">
            {/* Search */}
            <div className="p-4 border-b border-kh-border">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field max-w-xs"
                placeholder="Search products..."
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Sizes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-kh-muted font-body">
                        {search ? 'No products match your search.' : 'No products yet. Click "+ Add Product" to get started.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map(product => (
                      <tr key={product.id} className="hover:bg-kh-gray/50 transition-colors">
                        {/* Image */}
                        <td>
                          <div className="w-12 h-14 bg-kh-gray flex-shrink-0 overflow-hidden">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover"/>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-kh-muted">No img</div>
                            )}
                          </div>
                        </td>
                        {/* Name */}
                        <td>
                          <p className="font-600 text-kh-black max-w-[200px] line-clamp-2">{product.name}</p>
                          {product.featured && (
                            <span className="text-[10px] font-700 bg-kh-black text-white px-1.5 py-0.5 uppercase">Featured</span>
                          )}
                        </td>
                        {/* Category */}
                        <td>
                          <span className="text-xs text-kh-muted uppercase font-700 tracking-wide">
                            {CATEGORIES.find(c => c.id === product.category)?.label || product.category}
                          </span>
                        </td>
                        {/* Price */}
                        <td>
                          <p className="font-700 text-kh-black">{product.price.toLocaleString()} EGP</p>
                          {product.originalPrice && (
                            <p className="text-xs text-kh-muted line-through">{product.originalPrice.toLocaleString()}</p>
                          )}
                        </td>
                        {/* Sizes */}
                        <td>
                          <div className="flex gap-1 flex-wrap">
                            {SIZES.map(s => (
                              <span
                                key={s}
                                className={`text-[10px] font-700 px-1.5 py-0.5 uppercase ${
                                  product.sizes?.[s] ? 'bg-kh-black text-white' : 'bg-kh-gray text-kh-muted line-through'
                                }`}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        {/* Status */}
                        <td>
                          <span className={`text-[10px] font-700 uppercase px-2 py-1 ${
                            product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-kh-red'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        {/* Actions */}
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditing(product); setTab('products') }}
                              className="text-xs font-700 uppercase tracking-wide text-kh-black hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setConfirmDelete(product.id)}
                              className="text-xs font-700 uppercase tracking-wide text-kh-red hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── EDIT PRODUCT ── */}
        {tab === 'products' && editing && (
          <div className="bg-white border border-kh-border p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-700 uppercase">Edit Product</h2>
              <button onClick={() => setEditing(null)} className="text-kh-muted hover:text-kh-black text-sm font-700 uppercase tracking-wide">
                ← Back to List
              </button>
            </div>
            <ProductForm
              initial={editing}
              onSave={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          </div>
        )}

        {/* ── ADD PRODUCT ── */}
        {tab === 'add' && (
          <div className="bg-white border border-kh-border p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-700 uppercase mb-6">Add New Product</h2>
            <ProductForm onSave={handleAdd} onCancel={() => setTab('products')} />
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <div className="bg-white border border-kh-border p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-700 uppercase mb-6">Settings</h2>
            <SettingsTab />
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white border border-kh-border p-8 max-w-sm w-full text-center">
            <h3 className="font-heading text-2xl font-700 uppercase mb-3">Delete Product?</h3>
            <p className="text-sm text-kh-muted font-body mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 bg-kh-red text-white py-3 font-body font-700 text-sm uppercase tracking-widest hover:opacity-90"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-kh-border py-3 font-body font-700 text-sm uppercase tracking-widest hover:border-kh-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ADMIN PAGE ROUTER ─────────────────────────────────────────────────────
export default function Admin() {
  const { isAdmin } = useStore()
  return isAdmin ? <AdminDashboard /> : <AdminLogin />
}
