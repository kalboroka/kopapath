const BaseURL = ""; // proxy base URL
// const BaseURL = "http://localhost:3000";
let Refreshed = false;  // Track if refresh has occurred

export async function apiFetch(url, options = {}) {
  try {
    const res = await window.fetch(BaseURL + url, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        "Content-Type": "application/json",
        ...(options.bearer ? { Authorization: `Bearer ${options.bearer}` } : {}),
        credentials: 'include'
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {})
    });
    
    if ((res.status === 401 || res.status === 403) && !Refreshed) {
      Refreshed = true;

      try {
        const _res = await window.fetch('/api/v1/auth/refresh', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            credentials: 'include'
          }
        });

        if (!_res.ok) {
          return { ok: false, redirect: '/auth/login', error: 'Session expired, please login again.' };
        }
        const { accessToken } = await _res.json();
        window.sessionStorage.setItem('AccessToken', accessToken);

        return apiFetch(url, { ...options, bearer: accessToken });
      } catch (_err) {
        return { ok: false, error: _err.message };
      }
    }

    const data = await res.json();
    return { ok: res.ok, data };

  } catch (err) {
    const data = { error: err.message };
    return { ok: false, data };
  } finally {
    Refreshed = false;
  }
}