import products from "../mockData/products.json";

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
    return { ...product };
  },

  async getByShopId(shopId) {
    await delay(300);
    return products.filter(p => p.shopId === parseInt(shopId));
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
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    return { ...newProduct };
  },

  async update(id, productData) {
    await delay(350);
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Product not found");
    products[index] = { ...products[index], ...productData };
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