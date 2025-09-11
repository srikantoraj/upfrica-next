// src/lib/sourcing/api.js
import axios from "@/lib/axiosInstance";

const BASE = "/api/sourcing";

export async function createRequest(payload) {
  const { data } = await axios.post(`${BASE}/requests/`, payload);
  return data;
}

// Return full DRF payload (count, next, results...)
export async function myRequests(params = {}) {
  const { page = 1, pageSize = 50, ordering = "-created_at", ...rest } = params;
  const { data } = await axios.get(`${BASE}/requests/`, {
    params: { page, page_size: pageSize, ordering, ...rest },
  });
  return data;
}

export async function listOffers(params = {}) {
  const { page = 1, pageSize = 50, ordering = "-created_at", ...rest } = params;
  const { data } = await axios.get(`${BASE}/offers/`, {
    params: { page, page_size: pageSize, ordering, ...rest },
  });
  return data; // {count,next,previous,results:[...]}
}

export async function acceptOffer(offerId) {
  try {
    const { data } = await axios.post(`${BASE}/offers/${offerId}/accept/`);
    return data;
  } catch (err) {
    if (err?.response?.status === 404 || err?.response?.status === 405) {
      const { data } = await axios.post(`${BASE}/orders/`, { offer: offerId });
      return data;
    }
    throw err;
  }
}

export async function getConfig() {
  try {
    const { data } = await axios.get(`${BASE}/config/`);
    return data;
  } catch {
    return null;
  }
}