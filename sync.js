/**
 * Cloud Sync — يزامن localStorage مع Cloudflare KV
 * يعمل تلقائياً: عند تحميل الصفحة يجلب البيانات، وعند كل حفظ يرفع التغيير
 */
window.App = window.App || {};

(function (App) {
  // Public frontend code must never embed a reusable cloud write credential.
  const getSyncToken = () => String(window.IRAQ_CUSTOM_SYNC_TOKEN || "").trim();

  App.sync = {
    _ready: null,

    _headers() {
      const headers = { "Content-Type": "application/json" };
      const token = getSyncToken();
      if (token) headers["X-Sync-Token"] = token;
      return headers;
    },

    /** هل API السحابة متاحة؟ */
    async ready() {
      if (!getSyncToken()) return false;
      if (this._ready !== null) return this._ready;
      try {
        const r = await fetch("/api/ping", { cache: "no-store" });
        this._ready = r.ok;
      } catch (_) {
        this._ready = false;
      }
      return this._ready;
    },

    /** رفع مفتاح واحد إلى السحابة (fire-and-forget) */
    push(key, data) {
      this.ready().then((available) => {
        if (!available) return;
        return fetch("/api/data/" + encodeURIComponent(key), {
          method: "PUT",
          headers: this._headers(),
          body: JSON.stringify(data),
          cache: "no-store",
        });
      }).catch((error) => console.warn("Cloud sync failed", error));
    },

    /** جلب مفتاح واحد من السحابة */
    async pull(key) {
      try {
        const r = await fetch("/api/data/" + encodeURIComponent(key), {
          headers: this._headers(),
          cache: "no-store",
        });
        if (!r.ok) return null;
        const text = await r.text();
        return text === "null" || text === "" ? null : JSON.parse(text);
      } catch (_) {
        return null;
      }
    },

    /** جلب جميع البيانات المهمة من السحابة وكتابتها في localStorage */
    async pullAll() {
      if (!await this.ready()) return;
      const C = App.constants;
      if (!C) return;

      const keys = [
        C.STORAGE_KEY,
        C.DRIVER_STORAGE_KEY,
        C.TRADERS_STORAGE_KEY,
        C.TRADER_LEDGER_KEY,
        C.TRADER_PAYMENT_KEY,
      ].filter(Boolean);

      await Promise.all(keys.map(async (key) => {
        const cloudData = await this.pull(key);
        if (cloudData !== null) {
          try {
            localStorage.setItem(key, JSON.stringify(cloudData));
          } catch (_) {}
        }
      }));
    },
  };
})(window.App);
