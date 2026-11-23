/* Rep Ledger offline cache. The page loads fresh when online and from the saved copy when not; icons and fonts come from the saved copy. */
const CACHE="rep-ledger-v1";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  const sameOrigin=u.origin===self.location.origin,font=/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!sameOrigin&&!font)return;
  /* The app page: latest version when the connection answers within 2.5 s, saved copy otherwise */
  if(sameOrigin&&(r.mode==="navigate"||/\/(index\.html)?$/.test(u.pathname))){
    e.respondWith((async()=>{
      const c=await caches.open(CACHE);
      const net=fetch(u.origin+u.pathname,{cache:"no-cache"}).then(res=>{if(res&&res.ok)c.put("index.html",res.clone());return res});
      try{return await Promise.race([net,new Promise((_,rej)=>setTimeout(()=>rej(new Error("slow")),2500))])}
      catch(err){net.catch(()=>{});const hit=await c.match("index.html");return hit||net}
    })());
    return;
  }
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:sameOrigin});
    const fresh=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(fresh);return hit}
    return (await fresh)||(sameOrigin?c.match("index.html"):Response.error());
  }));
});
