import products from "../mockData/products.json";
import shops from "../mockData/shops.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const productService = {
  async getAll() {
    await delay(350);
    return [...products];
  },

async getById(id) {
    await delay(200);
    const product = products.find(p => p.Id === parseInt(id));
    if (!product) throw new Error("Product not found");
    
    // Enrich sellers with shop data
    const enrichedProduct = { ...product };
    if (product.sellers && product.sellers.length > 0) {
      enrichedProduct.sellers = product.sellers.map(seller => {
        const shop = shops.find(s => s.Id === seller.shopId);
        return {
          ...seller,
          shopName: shop?.name || "Unknown Shop",
          shopSlug: shop?.slug || ""
        };
      });
    }
    
    return enrichedProduct;
  },

async getByShopId(shopId) {
    await delay(300);
    return products.filter(p => p.shopId === parseInt(shopId));
  },

  async getSellersByProductId(productId) {
    await delay(200);
    const product = products.find(p => p.Id === parseInt(productId));
    if (!product || !product.sellers) return [];
    
    return product.sellers.map(seller => {
      const shop = shops.find(s => s.Id === seller.shopId);
      return {
        ...seller,
        shopName: shop?.name || "Unknown Shop",
        shopSlug: shop?.slug || ""
      };
    });
  },

  async getByCategory(category) {
    await delay(300);
    return products.filter(p => p.category === category);
  },

  async search(query) {
    await delay(400);
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  },

async create(productData) {
    await delay(400);
    const maxId = Math.max(...products.map(p => p.Id), 0);
    const newProduct = {
      Id: maxId + 1,
      ...productData,
      sellers: productData.sellers || [],
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    return { ...newProduct };
  },

async update(id, productData) {
    await delay(350);
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Product not found");
    products[index] = { 
      ...products[index], 
      ...productData,
      sellers: productData.sellers !== undefined ? productData.sellers : products[index].sellers
    };
    return { ...products[index] };
  },

  async delete(id) {
    await delay(300);
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Product not found");
    products.splice(index, 1);
    return { success: true };
  }
};

export default productService;