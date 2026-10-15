/**
 * Cloud Sync — يزامن localStorage مع Cloudflare KV
 * يعمل تلقائياً: عند تحميل الصفحة يجلب البيانات، وعند كل حفظ يرفع التغيير
 */
window.App = window.App || {};

(function (App) {
  const SYNC_TOKEN = "70525cc3f68b080d085da561681b7029b91a390fa677493e";

  App.sync = {
    _ready: null,

    _headers() {
      return {
        "Content-Type": "application/json",
        "X-Sync-Token": SYNC_TOKEN,
      };
    },

    /** هل API السحابة متاحة؟ */
    async ready() {
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
      fetch("/api/data/" + encodeURIComponent(key), {
        method: "PUT",
        headers: this._headers(),
        body: JSON.stringify(data),
        cache: "no-store",
      }).catch(function () {});
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
