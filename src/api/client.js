const BASE = 'https://latestbackend-1-3n01.onrender.com'||'http://localhost:8080';

async function request(path, options = {}) {
  try {
    const token = localStorage.getItem("token");

    const isJsonBody = options.body && typeof options.body === "object";

    const res = await fetch(`${BASE}${path}`, {
      ...options,

      credentials: "include",

      headers: {
        ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },

      body: isJsonBody ? JSON.stringify(options.body) : options.body
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || data.message || `Error ${res.status}`);
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Network error");
  }
}

export const api = {
  auth: {
    // ✅ FIXED: no manual stringify
    register: (body) =>
      request('/api/auth/register', {
        method: 'POST',
        body: body,   // <-- IMPORTANT CHANGE
      }),

    login: async (body) => {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: body,   // <-- IMPORTANT CHANGE
      });

      // ✅ Save token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
    },
  },

  chat: {
    sendMessage: (body) =>
      request('/api/chat', {
        method: 'POST',
        body: body,   // <-- no stringify
      }),

    getHistory: () =>
      request('/api/chat/history', {
        method: 'GET',
      }),

    getConversations: () =>
      request('/api/chat/conversations', {
        method: 'GET',
      }),

    getMessages: async () => {
      return [];
    },

    createConversation: async () => {
      return null;
    },

    deleteConversation: async () => {
      return null;
    }
  },
};