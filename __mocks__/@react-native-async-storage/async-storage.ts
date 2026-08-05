const store: { [key: string]: string } = {};

const mockAsyncStorage = {
  getItem: async (key: string) => store[key] || null,
  setItem: async (key: string, value: string) => {
    store[key] = value;
    return null;
  },
  removeItem: async (key: string) => {
    delete store[key];
    return null;
  },
  clear: async () => {
    for (const key in store) delete store[key];
    return null;
  },
};

export default mockAsyncStorage;
