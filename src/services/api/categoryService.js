import categories from "../mockData/categories.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const categoryService = {
  async getAll() {
    await delay(250);
    return [...categories];
  },

  async getById(id) {
    await delay(200);
    const category = categories.find(c => c.Id === parseInt(id));
    if (!category) throw new Error("Category not found");
    return { ...category };
  },

  async getBySlug(slug) {
    await delay(200);
    const category = categories.find(c => c.slug === slug);
    if (!category) throw new Error("Category not found");
    return { ...category };
  }
};

export default categoryService;