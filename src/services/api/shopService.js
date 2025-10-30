import shops from "../mockData/shops.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const shopService = {
  async getAll() {
    await delay(300);
    return [...shops];
  },

  async getById(id) {
    await delay(200);
    const shop = shops.find(s => s.Id === parseInt(id));
    if (!shop) throw new Error("Shop not found");
    return { ...shop };
  },

  async getBySlug(slug) {
    await delay(250);
    const shop = shops.find(s => s.slug === slug);
    if (!shop) throw new Error("Shop not found");
    return { ...shop };
  },

  async getBySellerId(sellerId) {
    await delay(200);
    const shop = shops.find(s => s.sellerId === parseInt(sellerId));
    if (!shop) throw new Error("Shop not found");
    return { ...shop };
  },

  async create(shopData) {
    await delay(350);
    const maxId = Math.max(...shops.map(s => s.Id), 0);
    const newShop = {
      Id: maxId + 1,
      ...shopData,
      createdAt: new Date().toISOString()
    };
    shops.push(newShop);
    return { ...newShop };
  },

  async update(id, shopData) {
    await delay(300);
    const index = shops.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Shop not found");
    shops[index] = { ...shops[index], ...shopData };
    return { ...shops[index] };
  },

  async delete(id) {
    await delay(300);
    const index = shops.findIndex(s => s.Id === parseInt(id));
    if (index === -1) throw new Error("Shop not found");
    shops.splice(index, 1);
    return { success: true };
  }
};

export default shopService;