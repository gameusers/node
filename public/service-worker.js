// --------------------------------------------------
//   Event: push
// --------------------------------------------------

self.addEventListener("push", function (eventObj) {
  // --------------------------------------------------
  //   Payload
  // --------------------------------------------------

  // console.log('eventObj', eventObj);
  // alert(eventObj);

  if (eventObj.data) {
    // --------------------------------------------------
    //   Payload Object
    // --------------------------------------------------

    let payloadObj = {};

    try {
      payloadObj = eventObj.data.json();
    } catch (errorObj) {
      payloadObj = {
        body: eventObj.data.text(),
      };
    }

    // --------------------------------------------------
    //   Title
    // --------------------------------------------------

    const title = payloadObj.title || "Game Users";

    // --------------------------------------------------
    //   Options
    // --------------------------------------------------

    const optionsObj = {
      body: payloadObj.body,
      icon: payloadObj.icon,
      tag: payloadObj.tag,
      data: {
        url: payloadObj.url,
      },
    };

    // console.log('title', title);
    // console.log('optionsObj', optionsObj);

    // --------------------------------------------------
    //   Notification
    // --------------------------------------------------

    eventObj.waitUntil(self.registration.showNotification(title, optionsObj));
  }
});

// --------------------------------------------------
//   Event: notificationclick
// --------------------------------------------------

self.addEventListener("notificationclick", (eventObj) => {
  // --------------------------------------------------
  //   表示された通知を明示的に閉じる
  // --------------------------------------------------

  eventObj.notification.close();

  // console.log('eventObj.notification.data.url', eventObj.notification.data.url);

  // --------------------------------------------------
  //   URL に遷移する
  // --------------------------------------------------

  if (eventObj.notification.data.url) {
    eventObj.waitUntil(self.clients.openWindow(eventObj.notification.data.url));
  }
});

try {
  self["workbox:core:5.1.4"] && _();
} catch (e) {}
const e = (e, ...t) => {
  let s = e;
  return t.length > 0 && (s += " :: " + JSON.stringify(t)), s;
};
class t extends Error {
  constructor(t, s) {
    super(e(t, s)), (this.name = t), (this.details = s);
  }
}
try {
  self["workbox:routing:5.1.4"] && _();
} catch (e) {}
const s = (e) => (e && "object" == typeof e ? e : { handle: e });
class c {
  constructor(e, t, c = "GET") {
    (this.handler = s(t)), (this.match = e), (this.method = c);
  }
}
class a extends c {
  constructor(e, t, s) {
    super(
      ({ url: t }) => {
        const s = e.exec(t.href);
        if (s && (t.origin === location.origin || 0 === s.index))
          return s.slice(1);
      },
      t,
      s
    );
  }
}
const n = (e) =>
  new URL(String(e), location.href).href.replace(
    new RegExp("^" + location.origin),
    ""
  );
class i {
  constructor() {
    this.t = new Map();
  }
  get routes() {
    return this.t;
  }
  addFetchListener() {
    self.addEventListener("fetch", (e) => {
      const { request: t } = e,
        s = this.handleRequest({ request: t, event: e });
      s && e.respondWith(s);
    });
  }
  addCacheListener() {
    self.addEventListener("message", (e) => {
      if (e.data && "CACHE_URLS" === e.data.type) {
        const { payload: t } = e.data,
          s = Promise.all(
            t.urlsToCache.map((e) => {
              "string" == typeof e && (e = [e]);
              const t = new Request(...e);
              return this.handleRequest({ request: t });
            })
          );
        e.waitUntil(s),
          e.ports && e.ports[0] && s.then(() => e.ports[0].postMessage(!0));
      }
    });
  }
  handleRequest({ request: e, event: t }) {
    const s = new URL(e.url, location.href);
    if (!s.protocol.startsWith("http")) return;
    const { params: c, route: a } = this.findMatchingRoute({
      url: s,
      request: e,
      event: t,
    });
    let n,
      i = a && a.handler;
    if ((!i && this.s && (i = this.s), i)) {
      try {
        n = i.handle({ url: s, request: e, event: t, params: c });
      } catch (e) {
        n = Promise.reject(e);
      }
      return (
        n instanceof Promise &&
          this.i &&
          (n = n.catch((c) => this.i.handle({ url: s, request: e, event: t }))),
        n
      );
    }
  }
  findMatchingRoute({ url: e, request: t, event: s }) {
    const c = this.t.get(t.method) || [];
    for (const a of c) {
      let c;
      const n = a.match({ url: e, request: t, event: s });
      if (n)
        return (
          (c = n),
          ((Array.isArray(n) && 0 === n.length) ||
            (n.constructor === Object && 0 === Object.keys(n).length) ||
            "boolean" == typeof n) &&
            (c = void 0),
          { route: a, params: c }
        );
    }
    return {};
  }
  setDefaultHandler(e) {
    this.s = s(e);
  }
  setCatchHandler(e) {
    this.i = s(e);
  }
  registerRoute(e) {
    this.t.has(e.method) || this.t.set(e.method, []),
      this.t.get(e.method).push(e);
  }
  unregisterRoute(e) {
    if (!this.t.has(e.method))
      throw new t("unregister-route-but-not-found-with-method", {
        method: e.method,
      });
    const s = this.t.get(e.method).indexOf(e);
    if (!(s > -1)) throw new t("unregister-route-route-not-registered");
    this.t.get(e.method).splice(s, 1);
  }
}
let r;
const o = () => (
  r || ((r = new i()), r.addFetchListener(), r.addCacheListener()), r
);
const f = {
    googleAnalytics: "googleAnalytics",
    precache: "precache-v2",
    prefix: "workbox",
    runtime: "runtime",
    suffix: "undefined" != typeof registration ? registration.scope : "",
  },
  u = (e) => [f.prefix, e, f.suffix].filter((e) => e && e.length > 0).join("-"),
  d = (e) => e || u(f.precache),
  h = (e) => e || u(f.runtime);
function l(e) {
  e.then(() => {});
}
const b = new Set();
class p {
  constructor(e, t, { onupgradeneeded: s, onversionchange: c } = {}) {
    (this.o = null),
      (this.u = e),
      (this.h = t),
      (this.l = s),
      (this.p = c || (() => this.close()));
  }
  get db() {
    return this.o;
  }
  async open() {
    if (!this.o)
      return (
        (this.o = await new Promise((e, t) => {
          let s = !1;
          setTimeout(() => {
            (s = !0),
              t(new Error("The open request was blocked and timed out"));
          }, this.OPEN_TIMEOUT);
          const c = indexedDB.open(this.u, this.h);
          (c.onerror = () => t(c.error)),
            (c.onupgradeneeded = (e) => {
              s
                ? (c.transaction.abort(), c.result.close())
                : "function" == typeof this.l && this.l(e);
            }),
            (c.onsuccess = () => {
              const t = c.result;
              s ? t.close() : ((t.onversionchange = this.p.bind(this)), e(t));
            });
        })),
        this
      );
  }
  async getKey(e, t) {
    return (await this.getAllKeys(e, t, 1))[0];
  }
  async getAll(e, t, s) {
    return await this.getAllMatching(e, { query: t, count: s });
  }
  async getAllKeys(e, t, s) {
    return (
      await this.getAllMatching(e, { query: t, count: s, includeKeys: !0 })
    ).map((e) => e.key);
  }
  async getAllMatching(
    e,
    {
      index: t,
      query: s = null,
      direction: c = "next",
      count: a,
      includeKeys: n = !1,
    } = {}
  ) {
    return await this.transaction([e], "readonly", (i, r) => {
      const o = i.objectStore(e),
        f = t ? o.index(t) : o,
        u = [],
        d = f.openCursor(s, c);
      d.onsuccess = () => {
        const e = d.result;
        e
          ? (u.push(n ? e : e.value), a && u.length >= a ? r(u) : e.continue())
          : r(u);
      };
    });
  }
  async transaction(e, t, s) {
    return (
      await this.open(),
      await new Promise((c, a) => {
        const n = this.o.transaction(e, t);
        (n.onabort = () => a(n.error)),
          (n.oncomplete = () => c()),
          s(n, (e) => c(e));
      })
    );
  }
  async g(e, t, s, ...c) {
    return await this.transaction([t], s, (s, a) => {
      const n = s.objectStore(t),
        i = n[e].apply(n, c);
      i.onsuccess = () => a(i.result);
    });
  }
  close() {
    this.o && (this.o.close(), (this.o = null));
  }
}
p.prototype.OPEN_TIMEOUT = 2e3;
const w = {
  readonly: ["get", "count", "getKey", "getAll", "getAllKeys"],
  readwrite: ["add", "put", "clear", "delete"],
};
for (const [e, t] of Object.entries(w))
  for (const s of t)
    s in IDBObjectStore.prototype &&
      (p.prototype[s] = async function (t, ...c) {
        return await this.g(s, t, e, ...c);
      });
try {
  self["workbox:expiration:5.1.4"] && _();
} catch (e) {}
const g = (e) => {
  const t = new URL(e, location.href);
  return (t.hash = ""), t.href;
};
class v {
  constructor(e) {
    (this.v = e),
      (this.o = new p("workbox-expiration", 1, {
        onupgradeneeded: (e) => this._(e),
      }));
  }
  _(e) {
    const t = e.target.result.createObjectStore("cache-entries", {
      keyPath: "id",
    });
    t.createIndex("cacheName", "cacheName", { unique: !1 }),
      t.createIndex("timestamp", "timestamp", { unique: !1 }),
      (async (e) => {
        await new Promise((t, s) => {
          const c = indexedDB.deleteDatabase(e);
          (c.onerror = () => {
            s(c.error);
          }),
            (c.onblocked = () => {
              s(new Error("Delete blocked"));
            }),
            (c.onsuccess = () => {
              t();
            });
        });
      })(this.v);
  }
  async setTimestamp(e, t) {
    const s = {
      url: (e = g(e)),
      timestamp: t,
      cacheName: this.v,
      id: this.m(e),
    };
    await this.o.put("cache-entries", s);
  }
  async getTimestamp(e) {
    return (await this.o.get("cache-entries", this.m(e))).timestamp;
  }
  async expireEntries(e, t) {
    const s = await this.o.transaction("cache-entries", "readwrite", (s, c) => {
        const a = s
            .objectStore("cache-entries")
            .index("timestamp")
            .openCursor(null, "prev"),
          n = [];
        let i = 0;
        a.onsuccess = () => {
          const s = a.result;
          if (s) {
            const c = s.value;
            c.cacheName === this.v &&
              ((e && c.timestamp < e) || (t && i >= t) ? n.push(s.value) : i++),
              s.continue();
          } else c(n);
        };
      }),
      c = [];
    for (const e of s)
      await this.o.delete("cache-entries", e.id), c.push(e.url);
    return c;
  }
  m(e) {
    return this.v + "|" + g(e);
  }
}
class x {
  constructor(e, t = {}) {
    (this.k = !1),
      (this.j = !1),
      (this.q = t.maxEntries),
      (this.R = t.maxAgeSeconds),
      (this.v = e),
      (this.U = new v(e));
  }
  async expireEntries() {
    if (this.k) return void (this.j = !0);
    this.k = !0;
    const e = this.R ? Date.now() - 1e3 * this.R : 0,
      t = await this.U.expireEntries(e, this.q),
      s = await self.caches.open(this.v);
    for (const e of t) await s.delete(e);
    (this.k = !1), this.j && ((this.j = !1), l(this.expireEntries()));
  }
  async updateTimestamp(e) {
    await this.U.setTimestamp(e, Date.now());
  }
  async isURLExpired(e) {
    if (this.R) {
      return (await this.U.getTimestamp(e)) < Date.now() - 1e3 * this.R;
    }
    return !1;
  }
  async delete() {
    (this.j = !1), await this.U.expireEntries(1 / 0);
  }
}
try {
  self["workbox:cacheable-response:5.1.4"] && _();
} catch (e) {}
class y {
  constructor(e = {}) {
    (this.L = e.statuses), (this.D = e.headers);
  }
  isResponseCacheable(e) {
    let t = !0;
    return (
      this.L && (t = this.L.includes(e.status)),
      this.D &&
        t &&
        (t = Object.keys(this.D).some((t) => e.headers.get(t) === this.D[t])),
      t
    );
  }
}
const m = (e, t) => e.filter((e) => t in e),
  k = async ({ request: e, mode: t, plugins: s = [] }) => {
    const c = m(s, "cacheKeyWillBeUsed");
    let a = e;
    for (const e of c)
      (a = await e.cacheKeyWillBeUsed.call(e, { mode: t, request: a })),
        "string" == typeof a && (a = new Request(a));
    return a;
  },
  j = async ({
    cacheName: e,
    request: t,
    event: s,
    matchOptions: c,
    plugins: a = [],
  }) => {
    const n = await self.caches.open(e),
      i = await k({ plugins: a, request: t, mode: "read" });
    let r = await n.match(i, c);
    for (const t of a)
      if ("cachedResponseWillBeUsed" in t) {
        const a = t.cachedResponseWillBeUsed;
        r = await a.call(t, {
          cacheName: e,
          event: s,
          matchOptions: c,
          cachedResponse: r,
          request: i,
        });
      }
    return r;
  },
  q = async ({
    cacheName: e,
    request: s,
    response: c,
    event: a,
    plugins: i = [],
    matchOptions: r,
  }) => {
    const o = await k({ plugins: i, request: s, mode: "write" });
    if (!c) throw new t("cache-put-with-no-response", { url: n(o.url) });
    const f = await (async ({
      request: e,
      response: t,
      event: s,
      plugins: c = [],
    }) => {
      let a = t,
        n = !1;
      for (const t of c)
        if ("cacheWillUpdate" in t) {
          n = !0;
          const c = t.cacheWillUpdate;
          if (
            ((a = await c.call(t, { request: e, response: a, event: s })), !a)
          )
            break;
        }
      return n || (a = a && 200 === a.status ? a : void 0), a || null;
    })({ event: a, plugins: i, response: c, request: o });
    if (!f) return;
    const u = await self.caches.open(e),
      d = m(i, "cacheDidUpdate"),
      h =
        d.length > 0
          ? await j({ cacheName: e, matchOptions: r, request: o })
          : null;
    try {
      await u.put(o, f);
    } catch (e) {
      throw (
        ("QuotaExceededError" === e.name &&
          (await (async function () {
            for (const e of b) await e();
          })()),
        e)
      );
    }
    for (const t of d)
      await t.cacheDidUpdate.call(t, {
        cacheName: e,
        event: a,
        oldResponse: h,
        newResponse: f,
        request: o,
      });
  },
  R = j,
  U = async ({ request: e, fetchOptions: s, event: c, plugins: a = [] }) => {
    if (
      ("string" == typeof e && (e = new Request(e)),
      c instanceof FetchEvent && c.preloadResponse)
    ) {
      const e = await c.preloadResponse;
      if (e) return e;
    }
    const n = m(a, "fetchDidFail"),
      i = n.length > 0 ? e.clone() : null;
    try {
      for (const t of a)
        if ("requestWillFetch" in t) {
          const s = t.requestWillFetch,
            a = e.clone();
          e = await s.call(t, { request: a, event: c });
        }
    } catch (e) {
      throw new t("plugin-error-request-will-fetch", { thrownError: e });
    }
    const r = e.clone();
    try {
      let t;
      t = "navigate" === e.mode ? await fetch(e) : await fetch(e, s);
      for (const e of a)
        "fetchDidSucceed" in e &&
          (t = await e.fetchDidSucceed.call(e, {
            event: c,
            request: r,
            response: t,
          }));
      return t;
    } catch (e) {
      for (const t of n)
        await t.fetchDidFail.call(t, {
          error: e,
          event: c,
          originalRequest: i.clone(),
          request: r.clone(),
        });
      throw e;
    }
  };
try {
  self["workbox:strategies:5.1.4"] && _();
} catch (e) {}
const L = {
  cacheWillUpdate: async ({ response: e }) =>
    200 === e.status || 0 === e.status ? e : null,
};
let D;
async function I(e, t) {
  const s = e.clone(),
    c = {
      headers: new Headers(s.headers),
      status: s.status,
      statusText: s.statusText,
    },
    a = t ? t(c) : c,
    n = (function () {
      if (void 0 === D) {
        const e = new Response("");
        if ("body" in e)
          try {
            new Response(e.body), (D = !0);
          } catch (e) {
            D = !1;
          }
        D = !1;
      }
      return D;
    })()
      ? s.body
      : await s.blob();
  return new Response(n, a);
}
try {
  self["workbox:precaching:5.1.4"] && _();
} catch (e) {}
function N(e) {
  if (!e) throw new t("add-to-cache-list-unexpected-type", { entry: e });
  if ("string" == typeof e) {
    const t = new URL(e, location.href);
    return { cacheKey: t.href, url: t.href };
  }
  const { revision: s, url: c } = e;
  if (!c) throw new t("add-to-cache-list-unexpected-type", { entry: e });
  if (!s) {
    const e = new URL(c, location.href);
    return { cacheKey: e.href, url: e.href };
  }
  const a = new URL(c, location.href),
    n = new URL(c, location.href);
  return (
    a.searchParams.set("__WB_REVISION__", s), { cacheKey: a.href, url: n.href }
  );
}
class E {
  constructor(e) {
    (this.v = d(e)),
      (this.I = new Map()),
      (this.N = new Map()),
      (this.K = new Map());
  }
  addToCacheList(e) {
    const s = [];
    for (const c of e) {
      "string" == typeof c
        ? s.push(c)
        : c && void 0 === c.revision && s.push(c.url);
      const { cacheKey: e, url: a } = N(c),
        n = "string" != typeof c && c.revision ? "reload" : "default";
      if (this.I.has(a) && this.I.get(a) !== e)
        throw new t("add-to-cache-list-conflicting-entries", {
          firstEntry: this.I.get(a),
          secondEntry: e,
        });
      if ("string" != typeof c && c.integrity) {
        if (this.K.has(e) && this.K.get(e) !== c.integrity)
          throw new t("add-to-cache-list-conflicting-integrities", { url: a });
        this.K.set(e, c.integrity);
      }
      if ((this.I.set(a, e), this.N.set(a, n), s.length > 0)) {
        const e = `Workbox is precaching URLs without revision info: ${s.join(
          ", "
        )}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        console.warn(e);
      }
    }
  }
  async install({ event: e, plugins: t } = {}) {
    const s = [],
      c = [],
      a = await self.caches.open(this.v),
      n = await a.keys(),
      i = new Set(n.map((e) => e.url));
    for (const [e, t] of this.I)
      i.has(t) ? c.push(e) : s.push({ cacheKey: t, url: e });
    const r = s.map(({ cacheKey: s, url: c }) => {
      const a = this.K.get(s),
        n = this.N.get(c);
      return this.T({
        cacheKey: s,
        cacheMode: n,
        event: e,
        integrity: a,
        plugins: t,
        url: c,
      });
    });
    await Promise.all(r);
    return { updatedURLs: s.map((e) => e.url), notUpdatedURLs: c };
  }
  async activate() {
    const e = await self.caches.open(this.v),
      t = await e.keys(),
      s = new Set(this.I.values()),
      c = [];
    for (const a of t) s.has(a.url) || (await e.delete(a), c.push(a.url));
    return { deletedURLs: c };
  }
  async T({
    cacheKey: e,
    url: s,
    cacheMode: c,
    event: a,
    plugins: n,
    integrity: i,
  }) {
    const r = new Request(s, {
      integrity: i,
      cache: c,
      credentials: "same-origin",
    });
    let o,
      f = await U({ event: a, plugins: n, request: r });
    for (const e of n || []) "cacheWillUpdate" in e && (o = e);
    if (
      !(o
        ? await o.cacheWillUpdate({ event: a, request: r, response: f })
        : f.status < 400)
    )
      throw new t("bad-precaching-response", { url: s, status: f.status });
    f.redirected && (f = await I(f)),
      await q({
        event: a,
        plugins: n,
        response: f,
        request: e === s ? r : new Request(e),
        cacheName: this.v,
        matchOptions: { ignoreSearch: !0 },
      });
  }
  getURLsToCacheKeys() {
    return this.I;
  }
  getCachedURLs() {
    return [...this.I.keys()];
  }
  getCacheKeyForURL(e) {
    const t = new URL(e, location.href);
    return this.I.get(t.href);
  }
  async matchPrecache(e) {
    const t = e instanceof Request ? e.url : e,
      s = this.getCacheKeyForURL(t);
    if (s) {
      return (await self.caches.open(this.v)).match(s);
    }
  }
  createHandler(e = !0) {
    return async ({ request: s }) => {
      try {
        const e = await this.matchPrecache(s);
        if (e) return e;
        throw new t("missing-precache-entry", {
          cacheName: this.v,
          url: s instanceof Request ? s.url : s,
        });
      } catch (t) {
        if (e) return fetch(s);
        throw t;
      }
    };
  }
  createHandlerBoundToURL(e, s = !0) {
    if (!this.getCacheKeyForURL(e))
      throw new t("non-precached-url", { url: e });
    const c = this.createHandler(s),
      a = new Request(e);
    return () => c({ request: a });
  }
}
let K;
const T = () => (K || (K = new E()), K);
const C = (e, t) => {
  const s = T().getURLsToCacheKeys();
  for (const c of (function* (
    e,
    {
      ignoreURLParametersMatching: t,
      directoryIndex: s,
      cleanURLs: c,
      urlManipulation: a,
    } = {}
  ) {
    const n = new URL(e, location.href);
    (n.hash = ""), yield n.href;
    const i = (function (e, t = []) {
      for (const s of [...e.searchParams.keys()])
        t.some((e) => e.test(s)) && e.searchParams.delete(s);
      return e;
    })(n, t);
    if ((yield i.href, s && i.pathname.endsWith("/"))) {
      const e = new URL(i.href);
      (e.pathname += s), yield e.href;
    }
    if (c) {
      const e = new URL(i.href);
      (e.pathname += ".html"), yield e.href;
    }
    if (a) {
      const e = a({ url: n });
      for (const t of e) yield t.href;
    }
  })(e, t)) {
    const e = s.get(c);
    if (e) return e;
  }
};
let M = !1;
function O(e) {
  M ||
    ((({
      ignoreURLParametersMatching: e = [/^utm_/],
      directoryIndex: t = "index.html",
      cleanURLs: s = !0,
      urlManipulation: c,
    } = {}) => {
      const a = d();
      self.addEventListener("fetch", (n) => {
        const i = C(n.request.url, {
          cleanURLs: s,
          directoryIndex: t,
          ignoreURLParametersMatching: e,
          urlManipulation: c,
        });
        if (!i) return;
        let r = self.caches
          .open(a)
          .then((e) => e.match(i))
          .then((e) => e || fetch(i));
        n.respondWith(r);
      });
    })(e),
    (M = !0));
}
const P = [],
  A = {
    get: () => P,
    add(e) {
      P.push(...e);
    },
  },
  S = (e) => {
    const t = T(),
      s = A.get();
    e.waitUntil(
      t.install({ event: e, plugins: s }).catch((e) => {
        throw e;
      })
    );
  },
  W = (e) => {
    const t = T();
    e.waitUntil(t.activate());
  };
var F;
self.addEventListener("message", (e) => {
  e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
}),
  (F = {}),
  (function (e) {
    T().addToCacheList(e),
      e.length > 0 &&
        (self.addEventListener("install", S),
        self.addEventListener("activate", W));
  })([
    {
      url: "_next/static/FchArKmYauWcsqqA5020H/_buildManifest.js",
      revision: "3fc025d3915ab7a48c9818c13783f6fd",
    },
    {
      url: "_next/static/FchArKmYauWcsqqA5020H/_ssgManifest.js",
      revision: "abee47769bf307639ace4945f9cfd4ff",
    },
    {
      url: "_next/static/chunks/05a8a07a.09d17f87860f88ac8aa7.js",
      revision: "9a86291b50f3485485ec5b4ee6645f78",
    },
    {
      url: "_next/static/chunks/078caff6.534b8e33c63aee289165.js",
      revision: "66f3cabf7151c23426dd2a6cd75af1e2",
    },
    {
      url: "_next/static/chunks/0d995344.1cdd46b5cdb05c1d7e51.js",
      revision: "75672bb5c26091460040893c60993e89",
    },
    {
      url: "_next/static/chunks/103625a4.8e430bbdad46494480c6.js",
      revision: "83e8b2a52a0b474cfff008946042eac1",
    },
    {
      url:
        "_next/static/chunks/12e6ce7450408cce86c234d55f2d312eca3558d9.bac338b941118a09b0bd.js",
      revision: "c1a3068dab6c5aba4e443cf7aecbe141",
    },
    {
      url: "_next/static/chunks/15904f65.8868ed421c14e545e13b.js",
      revision: "a42cfbd976b1098f218f646271e34d60",
    },
    {
      url: "_next/static/chunks/16d3806a.22ee82e3d2fe93606d38.js",
      revision: "420ad49aee4c86f33e8af54072e9097e",
    },
    {
      url: "_next/static/chunks/17ff1321.b7217dfb40003aa186a0.js",
      revision: "5e1f960cf6ff14178e1ab6b1f17a879d",
    },
    {
      url:
        "_next/static/chunks/1a74b6133c924d19080f80e9fe375d11f0e123cc.bbc7ada0f0d0d3ce9eda.js",
      revision: "fd65564d4d4dc45755172e433e08c52c",
    },
    {
      url: "_next/static/chunks/1c515439.0a4014643a8072efa833.js",
      revision: "a8ff0f267161a3024ca79c674bb5cdd6",
    },
    {
      url: "_next/static/chunks/226e4aa3.69888c588198d7eb1eed.js",
      revision: "48f7fd7d90d0cf67efae0cce9b8f3520",
    },
    {
      url: "_next/static/chunks/2eb3f4d5.ad47ce11332d35b43596.js",
      revision: "2a5d8aae10b9b16a30c6bc096fdc524a",
    },
    {
      url: "_next/static/chunks/2eda9ae2.c6b53df79107ff3bd279.js",
      revision: "31a113f90c26c719e40ed37174f9bb97",
    },
    {
      url:
        "_next/static/chunks/30976b691325dc8469cdbd87981c6e4b9068810a.41e37381ad6e1044acc8.js",
      revision: "b5fca8d8bef216520f1d3279428a6672",
    },
    {
      url: "_next/static/chunks/30e5e4c1.2666eea90f47efd7c9e6.js",
      revision: "a0bb43de268c4791200ee461ad8752c8",
    },
    {
      url: "_next/static/chunks/31a1284e.8bb216f465cf51e038cc.js",
      revision: "e5ac10d478c656039673acd9a5aa50c7",
    },
    {
      url: "_next/static/chunks/326d0be2.76fb058229b77b4afe28.js",
      revision: "77a823ff6944675262c441a04235b62d",
    },
    {
      url: "_next/static/chunks/3286eea3.74c64d04ea4401f52c39.js",
      revision: "2c38820065e1a998eed23716984fad97",
    },
    {
      url: "_next/static/chunks/3c02d7e3.71690a53479cd9c37d8d.js",
      revision: "f2f0982f1d2245543157d8dfa010366f",
    },
    {
      url: "_next/static/chunks/410e023b.8e5c0a43de45434fde49.js",
      revision: "53fb0d600cdcadac3e8f2f1e06ebc928",
    },
    {
      url: "_next/static/chunks/448c7197.953d7edfe646558e2982.js",
      revision: "d034009c6ea1dee4f1a07a47eb64938f",
    },
    {
      url: "_next/static/chunks/4afafdf3.d1ae133df346f7657556.js",
      revision: "e7618f0e5e5e4ff16ce9fac6a80f8b88",
    },
    {
      url: "_next/static/chunks/4e44ae7e.e73bcbdb08c55763bb01.js",
      revision: "3e67bcfbd867fe92c7ad6df129bee5b3",
    },
    {
      url: "_next/static/chunks/50d0a6f2.7348c74df12f808b5f9d.js",
      revision: "854ec89dddf6a509d20041997fbbaf18",
    },
    {
      url: "_next/static/chunks/50fce71c.1b1ea8d788e0e5dc35c7.js",
      revision: "a944147fe890e713085a1fae3401ed93",
    },
    {
      url: "_next/static/chunks/56c34644.e9b020ef03a8fde86c38.js",
      revision: "d7fb70d12b67857836fb48e9fa0b7205",
    },
    {
      url: "_next/static/chunks/62c84ca4.66d2f52ac59facf37bcf.js",
      revision: "c061b092339fe6ed03010e28a848d27e",
    },
    {
      url: "_next/static/chunks/688d1d5c.5c7c78690c9f18756e2a.js",
      revision: "984464a78f710250c053f0b336b0c45b",
    },
    {
      url: "_next/static/chunks/70f8a1cd.4e4c0bf63945a0602508.js",
      revision: "de68362bc10b72705dab6242fccee37e",
    },
    {
      url: "_next/static/chunks/75fc9c18.8a37b124ba4d3b98c450.js",
      revision: "2e08847e898559d8cdfd08c96d272e18",
    },
    {
      url: "_next/static/chunks/83d87ebd.7d6ef26d5de2a4894fdb.js",
      revision: "de1e60ff6d351bcc23d24e46fe7feb2b",
    },
    {
      url: "_next/static/chunks/8f33e28d.9a2425c3c7b9f8dc8e0c.js",
      revision: "6c24948c858d06ab32cecdb88549db3d",
    },
    {
      url: "_next/static/chunks/9088cf63.9ce0f6d2cf08f22ee82f.js",
      revision: "59c30ff109495df4e60bbab76553d292",
    },
    {
      url: "_next/static/chunks/9325f796.76449d3d547c69f8889d.js",
      revision: "40697fcfa32b9d61dade37a057a33588",
    },
    {
      url: "_next/static/chunks/94a577ce.73508815f7b8ef1c81e1.js",
      revision: "d2c94a1315eeec3e36062d3b27c07b1c",
    },
    {
      url:
        "_next/static/chunks/96bac9ce74edac453d1c121c06ff64724e971126.ec2e73e246b677802af5.js",
      revision: "80641ca31971e42ecbfeb25b22f81e5c",
    },
    {
      url:
        "_next/static/chunks/97297e88fa88407bbadf2bbcc46a3d9e8161b881.c2b23ed1212459379985.js",
      revision: "b052e8a79f30e60b6803b98181191924",
    },
    {
      url: "_next/static/chunks/9a70185d.a78eaaead5cb2cf94745.js",
      revision: "c29b4eecdfda0f0caaaf65b426ddd524",
    },
    {
      url: "_next/static/chunks/a5aba46b.77fea089d12bda295574.js",
      revision: "fa02517b7c03e06db574e5ea6b80ec09",
    },
    {
      url: "_next/static/chunks/a7a98ab4.8d8a6d7cf8421e8d43ba.js",
      revision: "b337e4819f556740748489cdec9128af",
    },
    {
      url: "_next/static/chunks/aa6690ee.bdec130d481468a6c73e.js",
      revision: "6534f603c63e05e4dec8a743ec513340",
    },
    {
      url: "_next/static/chunks/ac7f2c99.a504fc84a4e39d909bc1.js",
      revision: "8dd006d8a1b510c20883cae1a8f4807a",
    },
    {
      url: "_next/static/chunks/aee06684.eccf89b5994bdca6a407.js",
      revision: "448199c1f62e8c135b8ed21c829b43b3",
    },
    {
      url: "_next/static/chunks/b1d40145.19cd887e28de2e9561cf.js",
      revision: "86488163b1366dd2a91d7590cd8f3163",
    },
    {
      url:
        "_next/static/chunks/b4887bc376f545a616cdf18384918e4b6a6c51fa.b0aa48a441293576a5ca.js",
      revision: "23f59fb9ac0e5a38d39fa2fe3751319f",
    },
    {
      url: "_next/static/chunks/bd234a14.361f6d630d4f013f0c50.js",
      revision: "51984fc9f45fa2a841e0789e217e92cf",
    },
    {
      url: "_next/static/chunks/d5b1e177.ff97f2436f2712476a7f.js",
      revision: "1dde5cf941d1369473eb89024182cf1d",
    },
    {
      url: "_next/static/chunks/d727c6bc.b9b706e18f67ef616818.js",
      revision: "6eaf1a6659bc08db14568ff4a45ff45c",
    },
    {
      url: "_next/static/chunks/dbf3ce33.634e3560857028bd63a0.js",
      revision: "0a235d3d5041747dcd03a3f917d867b3",
    },
    {
      url: "_next/static/chunks/e07f14f0.001d09317b1e4de2e423.js",
      revision: "3e3de8b2f09233c75c7cb68013b1427a",
    },
    {
      url: "_next/static/chunks/e2c50acc.7ef26542dab1e928e5d1.js",
      revision: "64be5f0f9fddca08a4e37eaba20a8b47",
    },
    {
      url:
        "_next/static/chunks/e302f0e4b78025431af8d8813c94ba7715a43018.e5408c58fc8c4aa4a398.js",
      revision: "b73d6c1749b6afa1cba32045aa760121",
    },
    {
      url: "_next/static/chunks/e357a77c.404fac21af37dafe228f.js",
      revision: "aeee8a519c13c4787d9d9c6a2076ca53",
    },
    {
      url: "_next/static/chunks/e7183e10.9b8b0148727647d13a5b.js",
      revision: "5cc32238317d062d9fafa0daa131cf34",
    },
    {
      url: "_next/static/chunks/f846e7b0.1918b8ab7a6847b5aacb.js",
      revision: "5f49a46f52476ea7a9ef25e2d1eb6a22",
    },
    {
      url: "_next/static/chunks/ff72b4a9.7a5ff77ff45423c7db8e.js",
      revision: "1ac0e6a3e7000aa91436a821052aec19",
    },
    {
      url: "_next/static/chunks/framework.3519294afa6a9ab53973.js",
      revision: "4ad7e442639e5e7ada9f7c5a21c78946",
    },
    {
      url: "_next/static/chunks/main-c7e0eb9be7543ac28f59.js",
      revision: "42ef881e551947569530a1dc38eb0e40",
    },
    {
      url: "_next/static/chunks/pages/_app-c1d6c94da138faa4f08a.js",
      revision: "9fea8bdc1bfb8e9811060128e9927031",
    },
    {
      url: "_next/static/chunks/pages/_error-6e974de026ce89f91554.js",
      revision: "48b4b531ee91f0270f53d57699dd16e3",
    },
    {
      url: "_next/static/chunks/pages/administration-060367cd74f9cd20c2b7.js",
      revision: "5c0c1e13dffc7657032216de57d65126",
    },
    {
      url:
        "_next/static/chunks/pages/confirm/email/[emailConfirmationID]-e49f602bf7264f84d642.js",
      revision: "eed0502f3c91caa5f942e4840888bfbf",
    },
    {
      url:
        "_next/static/chunks/pages/confirm/reset-password/[emailConfirmationID]-e35a3387a037d34fafbe.js",
      revision: "dcbc726f3b0d285454a21813b4e698d3",
    },
    {
      url: "_next/static/chunks/pages/gc/[urlID]-46abccccabe35b37e78c.js",
      revision: "fdabf86703a6f86c5b7161cb10e34826",
    },
    {
      url:
        "_next/static/chunks/pages/gc/[urlID]/follower-c322bcab5afa6a7c2748.js",
      revision: "80772fec68bca12a2bbd7cc9b25f2263",
    },
    {
      url:
        "_next/static/chunks/pages/gc/[urlID]/forum/[[...slug]]-8c26ee052179aa2ef1d2.js",
      revision: "82bd622962d4dfcdba2c19980938577b",
    },
    {
      url:
        "_next/static/chunks/pages/gc/[urlID]/rec/[[...slug]]-1ad2239b736009c7aee3.js",
      revision: "055edff7bfa440f847d05801218b47da",
    },
    {
      url:
        "_next/static/chunks/pages/gc/list/[[...slug]]-bc3244ac5a1c4ec49267.js",
      revision: "e0c46fe7f4006d9bf19327f7d270908d",
    },
    {
      url:
        "_next/static/chunks/pages/gc/register/[[...slug]]-01254d68bb1d64969565.js",
      revision: "af5e7d27ffbe7359a532534f4e892015",
    },
    {
      url: "_next/static/chunks/pages/index-01ade5422c551b693c1d.js",
      revision: "a655163705feb16cbf6eababc6538a94",
    },
    {
      url: "_next/static/chunks/pages/initialize-52ce38a3e9db028247d9.js",
      revision: "ca097788793a2c0a2588e7d5a9f57e4e",
    },
    {
      url: "_next/static/chunks/pages/inquiry/account-43ca938e131b7e5f8fe0.js",
      revision: "83cdb07ec6cf69a27e74360a6601ae78",
    },
    {
      url: "_next/static/chunks/pages/inquiry/form-47da932215702620f043.js",
      revision: "37b9d1626360261aa0c95099c57d786d",
    },
    {
      url: "_next/static/chunks/pages/login-b79c82cc3eb27856fe17.js",
      revision: "dafe2447255614511581ec65e901d0c1",
    },
    {
      url: "_next/static/chunks/pages/login/account-36b52f67b9d988c60f71.js",
      revision: "1efa3e9364709fc0e259cb08edfa0c81",
    },
    {
      url:
        "_next/static/chunks/pages/login/reset-password-ff05724f2194f82c2d16.js",
      revision: "4a78266ad57698f9ccb7761007863413",
    },
    {
      url: "_next/static/chunks/pages/logout-928995e483145f750e03.js",
      revision: "ca8f9ba47429d130a3b7aa6dc98f42e2",
    },
    {
      url:
        "_next/static/chunks/pages/uc/[userCommunityID]-df5c94db34c86d678dd5.js",
      revision: "7fc15fac423c3cb5c1e5fb420cc46460",
    },
    {
      url:
        "_next/static/chunks/pages/uc/[userCommunityID]/forum/[[...slug]]-b5d0aa35082db363ac39.js",
      revision: "d1e40b94074e510952bc3a1f258b264d",
    },
    {
      url:
        "_next/static/chunks/pages/uc/[userCommunityID]/member-794bcb8d8625a1478ff4.js",
      revision: "e85e384ae751568461abdaa29f1601dd",
    },
    {
      url:
        "_next/static/chunks/pages/uc/[userCommunityID]/setting-21f499b1603247607267.js",
      revision: "8d7789ec6aec692c4c7fc61c1357328e",
    },
    {
      url:
        "_next/static/chunks/pages/uc/list/[[...slug]]-a539c88e176857c479d1.js",
      revision: "a05c7a28a59a2b9e7660b87236035c51",
    },
    {
      url:
        "_next/static/chunks/pages/uc/register/[[...slug]]-e039d042a927ea240bd8.js",
      revision: "b859ce96a88da1bbc804409dc780cac6",
    },
    {
      url: "_next/static/chunks/pages/ur/[userID]-0043243ebdc6b578cae0.js",
      revision: "a2886003bcd4713d4747edd2ecd68567",
    },
    {
      url:
        "_next/static/chunks/pages/ur/[userID]/follow/[[...slug]]-ccb01c1f5dba5089a80d.js",
      revision: "11c370b3e2e4ec7273ce29428a367153",
    },
    {
      url:
        "_next/static/chunks/pages/ur/[userID]/follow/list/[[...slug]]-9cf3800bc1783a5f7505.js",
      revision: "8296a10ed8dee85a2e5acc1080370d2b",
    },
    {
      url:
        "_next/static/chunks/pages/ur/[userID]/setting-07ed2d9f1dc4d1f66fe4.js",
      revision: "1a8e503bb32e4b13fd57d2e445c08185",
    },
    {
      url: "_next/static/chunks/polyfills-3f65554db8cc10ae8457.js",
      revision: "3a257c7b120ba7e3f8daf48f43cf6099",
    },
    {
      url: "_next/static/chunks/webpack-50bee04d1dc61f8adf5b.js",
      revision: "8c19f623e8389f11131a054a7e17ff95",
    },
    {
      url: "_next/static/css/fb22c836a40e4c9d60c1.css",
      revision: "62ca56f8865a28a2c5b0067857dc3d04",
    },
  ]),
  O(F),
  (function (e, s, n) {
    let i;
    if ("string" == typeof e) {
      const t = new URL(e, location.href);
      i = new c(({ url: e }) => e.href === t.href, s, n);
    } else if (e instanceof RegExp) i = new a(e, s, n);
    else if ("function" == typeof e) i = new c(e, s, n);
    else {
      if (!(e instanceof c))
        throw new t("unsupported-route-type", {
          moduleName: "workbox-routing",
          funcName: "registerRoute",
          paramName: "capture",
        });
      i = e;
    }
    o().registerRoute(i);
  })(
    /^https?.*/,
    new (class {
      constructor(e = {}) {
        if (((this.v = h(e.cacheName)), e.plugins)) {
          const t = e.plugins.some((e) => !!e.cacheWillUpdate);
          this.C = t ? e.plugins : [L, ...e.plugins];
        } else this.C = [L];
        (this.M = e.networkTimeoutSeconds || 0),
          (this.O = e.fetchOptions),
          (this.P = e.matchOptions);
      }
      async handle({ event: e, request: s }) {
        const c = [];
        "string" == typeof s && (s = new Request(s));
        const a = [];
        let n;
        if (this.M) {
          const { id: t, promise: i } = this.A({
            request: s,
            event: e,
            logs: c,
          });
          (n = t), a.push(i);
        }
        const i = this.S({ timeoutId: n, request: s, event: e, logs: c });
        a.push(i);
        let r = await Promise.race(a);
        if ((r || (r = await i), !r))
          throw new t("no-response", { url: s.url });
        return r;
      }
      A({ request: e, logs: t, event: s }) {
        let c;
        return {
          promise: new Promise((t) => {
            c = setTimeout(async () => {
              t(await this.W({ request: e, event: s }));
            }, 1e3 * this.M);
          }),
          id: c,
        };
      }
      async S({ timeoutId: e, request: t, logs: s, event: c }) {
        let a, n;
        try {
          n = await U({
            request: t,
            event: c,
            fetchOptions: this.O,
            plugins: this.C,
          });
        } catch (e) {
          a = e;
        }
        if ((e && clearTimeout(e), a || !n))
          n = await this.W({ request: t, event: c });
        else {
          const e = n.clone(),
            s = q({
              cacheName: this.v,
              request: t,
              response: e,
              event: c,
              plugins: this.C,
            });
          if (c)
            try {
              c.waitUntil(s);
            } catch (e) {}
        }
        return n;
      }
      W({ event: e, request: t }) {
        return R({
          cacheName: this.v,
          request: t,
          event: e,
          matchOptions: this.P,
          plugins: this.C,
        });
      }
    })({
      cacheName: "https-calls",
      networkTimeoutSeconds: 15,
      plugins: [
        new (class {
          constructor(e = {}) {
            var t;
            (this.cachedResponseWillBeUsed = async ({
              event: e,
              request: t,
              cacheName: s,
              cachedResponse: c,
            }) => {
              if (!c) return null;
              const a = this.F(c),
                n = this.H(s);
              l(n.expireEntries());
              const i = n.updateTimestamp(t.url);
              if (e)
                try {
                  e.waitUntil(i);
                } catch (e) {}
              return a ? c : null;
            }),
              (this.cacheDidUpdate = async ({ cacheName: e, request: t }) => {
                const s = this.H(e);
                await s.updateTimestamp(t.url), await s.expireEntries();
              }),
              (this.B = e),
              (this.R = e.maxAgeSeconds),
              (this.G = new Map()),
              e.purgeOnQuotaError &&
                ((t = () => this.deleteCacheAndMetadata()), b.add(t));
          }
          H(e) {
            if (e === h()) throw new t("expire-custom-caches-only");
            let s = this.G.get(e);
            return s || ((s = new x(e, this.B)), this.G.set(e, s)), s;
          }
          F(e) {
            if (!this.R) return !0;
            const t = this.Y(e);
            if (null === t) return !0;
            return t >= Date.now() - 1e3 * this.R;
          }
          Y(e) {
            if (!e.headers.has("date")) return null;
            const t = e.headers.get("date"),
              s = new Date(t).getTime();
            return isNaN(s) ? null : s;
          }
          async deleteCacheAndMetadata() {
            for (const [e, t] of this.G)
              await self.caches.delete(e), await t.delete();
            this.G = new Map();
          }
        })({ maxEntries: 150, maxAgeSeconds: 2592e3, purgeOnQuotaError: !0 }),
        new (class {
          constructor(e) {
            (this.cacheWillUpdate = async ({ response: e }) =>
              this.J.isResponseCacheable(e) ? e : null),
              (this.J = new y(e));
          }
        })({ statuses: [0, 200] }),
      ],
    }),
    "GET"
  );
