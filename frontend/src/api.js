import { mockBackend } from './mockBackend';

// Pure static frontend API client that mimics axios interface
// Backed by localStorage and client-side financial calculations
const api = {
  get: (url, config) => mockBackend.get(url, config),
  post: (url, data, config) => mockBackend.post(url, data, config),
  put: (url, data, config) => mockBackend.put(url, data, config),
  delete: (url, config) => mockBackend.delete(url, config),
  defaults: {
    headers: {
      common: {
        'Content-Type': 'application/json'
      }
    }
  },
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  }
};

export default api;
