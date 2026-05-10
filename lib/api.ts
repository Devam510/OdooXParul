import { useAuthStore } from "@/store/authStore";

interface FetchOptions extends RequestInit {
  data?: any;
}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { data, headers: customHeaders, ...rest } = options;
  const store = useAuthStore.getState();

  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (store.accessToken) {
    headers = { ...headers, Authorization: `Bearer ${store.accessToken}` };
  }

  const config: RequestInit = {
    ...rest,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  let response = await fetch(endpoint, config);

  if (response.status === 401 && store.accessToken) {
    try {
      const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
      const refreshData = await refreshRes.json();
      
      if (refreshRes.ok && refreshData.data?.accessToken) {
        store.setAuth(refreshData.data.user, refreshData.data.accessToken);
        
        headers = { ...headers, Authorization: `Bearer ${refreshData.data.accessToken}` };
        config.headers = headers;
        response = await fetch(endpoint, config);
      } else {
        store.logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } catch (err) {
      store.logout();
    }
  }

  return response;
}
