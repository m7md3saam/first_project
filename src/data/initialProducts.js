export const CATEGORIES = [
  { id: 'tshirt', label: 'T-Shirts', labelAr: 'تيشرتات' },
  { id: 'shirt',  label: 'Shirts',   labelAr: 'قمصان'   },
]

export const SIZES = ['M', 'L', 'XL', '2XL']

export const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'Classic Black Oversized T-Shirt',
    category: 'tshirt',
    price: 299,
    originalPrice: 450,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&q=80',
    ],
    sizes: { M: true, L: true, XL: true, '2XL': true },
    description: 'Premium heavyweight cotton oversized t-shirt. 100% combed cotton. Relaxed fit for maximum comfort.',
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'White Linen Casual Shirt',
    category: 'shirt',
    price: 549,
    originalPrice: 750,
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80',
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80',
    ],
    sizes: { M: true, L: true, XL: true, '2XL': false },
    description: 'Light breathable linen shirt, perfect for summer. Slim fit with chest pocket.',
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Navy Blue Stripe Shirt',
    category: 'shirt',
    price: 479,
    originalPrice: 650,
    images: [
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b5601?w=600&q=80',
    ],
    sizes: { M: false, L: true, XL: true, '2XL': true },
    description: 'Classic navy stripe cotton shirt. Regular fit, ideal for casual and smart-casual looks.',
    featured: false,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Grey Essential T-Shirt',
    category: 'tshirt',
    price: 249,
    originalPrice: 350,
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    ],
    sizes: { M: true, L: true, XL: false, '2XL': false },
    description: 'Soft jersey cotton essential tee. Crew neck, standard fit.',
    featured: true,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
]
