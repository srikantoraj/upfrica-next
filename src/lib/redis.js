// src/lib/redis.js
// Tiny Redis wrapper with Upstash REST (no @upstash/redis dependency) + in-memory fallback.

function createMemoryClient() {
  const store = new Map();
  return {
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async set(key, value) {
      store.set(key, String(value));
      return "OK";
    },
    async incrby(key, n = 1) {
      const next = Number(store.get(key) || 0) + Number(n || 0);
      store.set(key, String(next));
      return next;
    },
    async mget(...keys) {
      return keys.map((k) => (store.has(k) ? store.get(k) : null));
    },
  };
}

function createUpstashClient() {
  const base = String(process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/+$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || "";
  const headers = { Authorization: `Bearer ${token}` };

  const enc = (v) => encodeURIComponent(String(v));

  const safeFetch = async (url) => {
    try {
      const res = await fetch(url, { headers, cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      return json?.result;
    } catch {
      return null;
    }
  };

  return {
    async get(key) {
      return safeFetch(`${base}/get/${enc(key)}`);
    },
    async set(key, value) {
      // Upstash REST supports /set/<key>/<value>
      await safeFetch(`${base}/set/${enc(key)}/${enc(value)}`);
      return "OK";
    },
    async incrby(key, n = 1) {
      const out = await safeFetch(`${base}/incrby/${enc(key)}/${enc(n)}`);
      return Number(out || 0);
    },
    async mget(...keys) {
      if (!keys.length) return [];
      const out = await safeFetch(`${base}/mget/${keys.map(enc).join("/")}`);
      return Array.isArray(out) ? out : [];
    },
  };
}

let redis;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = createUpstashClient();
} else {
  redis = createMemoryClient();
}

export { redis };
export default redis;