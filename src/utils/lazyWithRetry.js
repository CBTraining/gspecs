/**
 * Helper to wrap dynamic React.lazy imports with retry logic.
 * If a new build was deployed and an old chunk is requested by an active user,
 * it forces a clean page reload to boot the latest version instead of crashing.
 */
export const lazyWithRetry = (componentImport) => {
  return () =>
    new Promise((resolve, reject) => {
      const key = `chunk_retry_${window.location.pathname}`;
      const hasRefreshed = sessionStorage.getItem(key);

      componentImport()
        .then((component) => {
          if (hasRefreshed) {
            sessionStorage.removeItem(key);
          }
          resolve(component);
        })
        .catch((error) => {
          if (!hasRefreshed) {
            sessionStorage.setItem(key, 'true');
            window.location.reload();
          } else {
            sessionStorage.removeItem(key);
            reject(error);
          }
        });
    });
};
