/**
 * Google Visualization API (GViz) JSONP data fetcher.
 * Fetches Google Sheet tables directly in client-side browsers without CORS restrictions.
 */

export const fetchGvizData = (spreadsheetId, gid = null) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return reject(new Error('GViz JSONP requires browser environment'));
    }

    const callbackName = `gviz_cb_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const script = document.createElement('script');
    let url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=responseHandler:${callbackName}&_t=${Date.now()}`;
    if (gid) {
      url += `&gid=${gid}`;
    }

    let isDone = false;
    const cleanup = () => {
      if (isDone) return;
      isDone = true;
      try {
        delete window[callbackName];
      } catch {}
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('GViz fetch timed out'));
    }, 6000);

    window[callbackName] = (response) => {
      clearTimeout(timer);
      cleanup();

      if (!response || !response.table || !Array.isArray(response.table.cols)) {
        reject(new Error('Invalid GViz response format'));
        return;
      }

      const cols = response.table.cols.map(c => c ? (c.label || '').trim() : '');
      const rows = (response.table.rows || []).map(r => {
        const rowObj = {};
        if (r && Array.isArray(r.c)) {
          r.c.forEach((cell, idx) => {
            const colName = cols[idx];
            if (colName) {
              const val = cell ? (cell.f !== undefined && cell.f !== null ? cell.f : (cell.v !== undefined && cell.v !== null ? cell.v : '')) : '';
              rowObj[colName] = String(val).trim();
            }
          });
        }
        return rowObj;
      });

      resolve(rows);
    };

    script.src = url;
    script.onerror = () => {
      clearTimeout(timer);
      cleanup();
      reject(new Error('GViz script load error'));
    };

    document.head.appendChild(script);
  });
};
