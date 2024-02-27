export const api = {
  get: async <T = any>(path: string) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com${path}`);
    return res.json() as Promise<T>;
  },
};
