import reviews from "../mockData/reviews.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const reviewService = {
  async getAll() {
    await delay(300);
    return [...reviews];
  },

  async getById(id) {
    await delay(200);
    const review = reviews.find(r => r.Id === parseInt(id));
    if (!review) throw new Error("Review not found");
    return { ...review };
  },

  async getByProductId(productId) {
    await delay(300);
    return reviews.filter(r => r.productId === parseInt(productId) && r.status === "approved");
  },

  async getPending() {
    await delay(300);
    return reviews.filter(r => r.status === "pending");
  },

  async create(reviewData) {
    await delay(350);
    const maxId = Math.max(...reviews.map(r => r.Id), 0);
    const newReview = {
      Id: maxId + 1,
      ...reviewData,
      status: "pending",
      createdAt: new Date().toISOString(),
      approvedAt: null
    };
    reviews.push(newReview);
    return { ...newReview };
  },

  async approve(id) {
    await delay(300);
    const index = reviews.findIndex(r => r.Id === parseInt(id));
    if (index === -1) throw new Error("Review not found");
    reviews[index] = {
      ...reviews[index],
      status: "approved",
      approvedAt: new Date().toISOString()
    };
    return { ...reviews[index] };
  },

  async reject(id) {
    await delay(300);
    const index = reviews.findIndex(r => r.Id === parseInt(id));
    if (index === -1) throw new Error("Review not found");
    reviews[index] = { ...reviews[index], status: "rejected" };
    return { ...reviews[index] };
  },

  async delete(id) {
    await delay(300);
    const index = reviews.findIndex(r => r.Id === parseInt(id));
    if (index === -1) throw new Error("Review not found");
    reviews.splice(index, 1);
    return { success: true };
  }
};

export default reviewService;