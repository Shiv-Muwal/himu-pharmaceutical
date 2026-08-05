const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export function loadGoogleScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  const existing = document.querySelector('script[data-himu-google="1"]');
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google script failed")));
      if (window.google?.accounts?.oauth2) resolve();
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.himuGoogle = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Google Sign-In"));
    document.head.appendChild(script);
  });
}

export function requestGoogleAccessToken() {
  if (!GOOGLE_CLIENT_ID) {
    return Promise.reject(
      new Error("Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID."),
    );
  }

  return loadGoogleScript().then(
    () =>
      new Promise((resolve, reject) => {
        if (!window.google?.accounts?.oauth2) {
          reject(new Error("Google Sign-In is unavailable right now."));
          return;
        }
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          callback: (tokenResponse) => {
            if (tokenResponse.error) {
              reject(
                new Error(tokenResponse.error_description || "Google sign-in cancelled"),
              );
              return;
            }
            resolve(tokenResponse.access_token);
          },
          error_callback: (err) => {
            reject(new Error(err?.message || "Google sign-in was cancelled"));
          },
        });
        tokenClient.requestAccessToken({ prompt: "select_account" });
      }),
  );
}

export { GOOGLE_CLIENT_ID };
