// Simple wrapper for fetch API

/**
 * POST request helper
 * @param {string} url - API endpoint (relative)
 * @param {object} data - Request body
 * @param {string} token - Optional auth token
 */
export async function apiPost(url, data = {}, token) {
  try {
    const res = await window.fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    return { ok: res.ok, ...json };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * GET request helper
 * @param {string} url - API endpoint (relative)
 * @param {string} token - Optional auth token
 */
export async function apiGet(url, token) {
  try {
    const res = await window.fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const json = await res.json();
    return { ok: res.ok, ...json };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}