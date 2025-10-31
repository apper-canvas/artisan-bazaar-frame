// Seller-specific service for managing seller shops and products
const SELLER_STORAGE_KEY = 'artisan-seller-data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize seller data structure in localStorage
const initializeSellerData = () => {
  const existing = localStorage.getItem(SELLER_STORAGE_KEY);
  if (!existing) {
    const initialData = {
      shops: [],
      products: []
    };
    localStorage.setItem(SELLER_STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(existing);
};

// Get all seller data
const getSellerData = () => {
  const data = localStorage.getItem(SELLER_STORAGE_KEY);
  return data ? JSON.parse(data) : initializeSellerData();
};

// Save seller data
const saveSellerData = (data) => {
  localStorage.setItem(SELLER_STORAGE_KEY, JSON.stringify(data));
};

const sellerService = {
  // Shop operations
  async getShop(sellerId) {
    await delay(300);
    const data = getSellerData();
    const shop = data.shops.find(s => s.sellerId === sellerId);
    if (!shop) throw new Error("Shop not found");
    return { ...shop };
  },

  async createShop(shopData) {
    await delay(400);
    const data = getSellerData();
    const maxId = data.shops.length > 0 ? Math.max(...data.shops.map(s => s.Id)) : 0;
    const newShop = {
      Id: maxId + 1,
      ...shopData,
      createdAt: new Date().toISOString()
    };
    data.shops.push(newShop);
    saveSellerData(data);
    return { ...newShop };
  },

  async updateShop(shopId, shopData) {
    await delay(350);
    const data = getSellerData();
    const index = data.shops.findIndex(s => s.Id === parseInt(shopId));
    if (index === -1) throw new Error("Shop not found");
    data.shops[index] = { 
      ...data.shops[index], 
      ...shopData 
    };
    saveSellerData(data);
    return { ...data.shops[index] };
  },

  // Product operations
  async getSellerProducts(sellerId) {
    await delay(300);
    const data = getSellerData();
    const products = data.products.filter(p => p.sellerId === sellerId);
    return products.map(p => ({ ...p }));
  },

  async getSellerProduct(productId) {
    await delay(250);
    const data = getSellerData();
    const product = data.products.find(p => p.Id === parseInt(productId));
    if (!product) throw new Error("Product not found");
    return { ...product };
  },

  async createProduct(productData) {
    await delay(400);
    const data = getSellerData();
    const maxId = data.products.length > 0 ? Math.max(...data.products.map(p => p.Id)) : 1000;
    const newProduct = {
      Id: maxId + 1,
      ...productData,
      createdAt: new Date().toISOString()
    };
    data.products.push(newProduct);
    saveSellerData(data);
    return { ...newProduct };
  },

  async updateProduct(productId, productData) {
    await delay(350);
    const data = getSellerData();
    const index = data.products.findIndex(p => p.Id === parseInt(productId));
    if (index === -1) throw new Error("Product not found");
    data.products[index] = { 
      ...data.products[index], 
      ...productData,
      updatedAt: new Date().toISOString()
    };
    saveSellerData(data);
    return { ...data.products[index] };
  },

  async deleteProduct(productId) {
    await delay(300);
    const data = getSellerData();
    const index = data.products.findIndex(p => p.Id === parseInt(productId));
    if (index === -1) throw new Error("Product not found");
    data.products.splice(index, 1);
    saveSellerData(data);
    return { success: true };
  },

  // Check if user is seller
  async isSeller(userId) {
    await delay(200);
    const data = getSellerData();
    return data.shops.some(s => s.sellerId === userId);
  },

  // Get shop by seller ID
  async getShopBySellerId(sellerId) {
    await delay(250);
    const data = getSellerData();
    const shop = data.shops.find(s => s.sellerId === sellerId);
    return shop ? { ...shop } : null;
  },

  // Dashboard stats
  async getDashboardStats(sellerId) {
    await delay(300);
    const data = getSellerData();
    const products = data.products.filter(p => p.sellerId === sellerId);
    
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.inventory > 0).length;
    const totalInventory = products.reduce((sum, p) => sum + (p.inventory || 0), 0);
    const lowStockProducts = products.filter(p => p.inventory > 0 && p.inventory < 5).length;

    return {
      totalProducts,
      activeProducts,
      totalInventory,
      lowStockProducts
    };
  }
};

export default sellerService;