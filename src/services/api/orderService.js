import orders from "../mockData/orders.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const orderService = {
  async getAll() {
    await delay(350);
    return [...orders];
  },

  async getById(id) {
    await delay(200);
    const order = orders.find(o => o.Id === parseInt(id));
    if (!order) throw new Error("Order not found");
    return { ...order };
  },

  async getByCustomerId(customerId) {
    await delay(300);
    return orders.filter(o => o.customerId === parseInt(customerId));
  },

  async getBySellerId(sellerId) {
    await delay(300);
    return orders.filter(o => o.sellerId === parseInt(sellerId));
  },

  async create(orderData) {
    await delay(400);
    const maxId = Math.max(...orders.map(o => o.Id), 0);
    const newOrder = {
      Id: maxId + 1,
      ...orderData,
      status: "new",
      createdAt: new Date().toISOString(),
      shippedAt: null,
      completedAt: null
    };
    orders.push(newOrder);
    return { ...newOrder };
  },

  async update(id, orderData) {
    await delay(300);
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) throw new Error("Order not found");
    orders[index] = { ...orders[index], ...orderData };
    return { ...orders[index] };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) throw new Error("Order not found");
    
    const updateData = { status };
    if (status === "shipped" && !orders[index].shippedAt) {
      updateData.shippedAt = new Date().toISOString();
    }
    if (status === "completed" && !orders[index].completedAt) {
      updateData.completedAt = new Date().toISOString();
    }
    
    orders[index] = { ...orders[index], ...updateData };
    return { ...orders[index] };
  },

  async delete(id) {
    await delay(300);
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) throw new Error("Order not found");
    orders.splice(index, 1);
    return { success: true };
  }
};

export default orderService;