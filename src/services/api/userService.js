import users from "../mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userService = {
  async getAll() {
    await delay(300);
    return [...users];
  },

  async getById(id) {
    await delay(200);
    const user = users.find(u => u.Id === parseInt(id));
    if (!user) throw new Error("User not found");
    return { ...user };
  },

  async getBySellerId(sellerId) {
    await delay(200);
    const user = users.find(u => u.Id === parseInt(sellerId) && u.role === "seller");
    if (!user) throw new Error("Seller not found");
    return { ...user };
  },

  async create(userData) {
    await delay(300);
    const maxId = Math.max(...users.map(u => u.Id), 0);
    const newUser = {
      Id: maxId + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await delay(300);
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error("User not found");
    users[index] = { ...users[index], ...userData };
    return { ...users[index] };
  },

  async delete(id) {
    await delay(300);
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error("User not found");
    users.splice(index, 1);
    return { success: true };
  }
};

export default userService;