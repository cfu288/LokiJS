(function (g, f) {
  var hasExports = typeof exports === 'object';
  if (typeof define === "function" && define.amd) {
    define([], f);
  } else if (typeof module === "object" && module.exports) {
    module.exports = f();
  } else {
    var m = hasExports ? f() : f();
    var root = hasExports ? exports : g;
    for(var i in m) root[i] = m[i];
  }}(typeof self !== 'undefined' ? self : this, () => {
var exports = {};
var module = { exports };
var A=Object.defineProperty;var g=(h,t)=>A(h,"name",{value:t,configurable:!0});var u=class{constructor(t,o){if(this.app="loki",this.options=o||{},typeof t!="undefined"&&(this.app=t),this.catalog=null,!this.checkAvailability())throw new Error("indexedDB does not seem to be supported for your environment")}exportDatabase(t,o,a){throw new Error("Method not implemented.")}closeDatabase(){this.catalog&&this.catalog.db&&(this.catalog.db.close(),this.catalog.db=null)}checkAvailability(){return!!(typeof indexedDB!="undefined"&&indexedDB)}loadDatabase(t,o){let a=this.app,s=this;if(this.catalog===null||this.catalog.db===null){this.catalog=new f(n=>{s.catalog=n,s.loadDatabase(t,o)});return}this.catalog.getAppKey(a,t,({id:n,val:e})=>{if(typeof o=="function"){if(n===0){o(null);return}o(e)}else console.log(e)})}saveDatabase(t,o,a){let s=this.app,n=this;function e(r){r&&r.success===!0?a(null):a(new Error("Error saving database")),n.options.closeAfterSave&&n.closeDatabase()}if(g(e,"saveCallback"),this.catalog===null||this.catalog.db===null){this.catalog=new f(r=>{n.saveDatabase(t,o,e)});return}this.catalog.setAppKey(s,t,o,e)}deleteDatabase(t,o){let a=this.app,s=this;if(this.catalog===null||this.catalog.db===null){this.catalog=new f(n=>{s.catalog=n,s.deleteDatabase(t,o)});return}this.catalog.getAppKey(a,t,n=>{let e=n.id;e!==0?s.catalog.deleteAppKey(e,o):typeof o=="function"&&o({success:!0})})}deleteDatabasePartitions(t){let o=this;this.getDatabaseList(a=>{a.forEach(s=>{s.startsWith(t)&&o.deleteDatabase(s)})})}getDatabaseList(t){let o=this.app,a=this;if(this.catalog===null||this.catalog.db===null){this.catalog=new f(s=>{a.catalog=s,a.getDatabaseList(t)});return}this.catalog.getAppKeys(o,s=>{let n=[];for(let e=0;e<s.length;e++)n.push(s[e].key);typeof t=="function"?t(n):n.forEach(e=>{console.log(e)})})}getCatalogSummary(t){let o=this.app,a=this;if(this.catalog===null||this.catalog.db===null){this.catalog=new f(s=>{a.catalog=s,a.getCatalogSummary(t)});return}this.catalog.getAllKeys(s=>{let n=[],e,r,p,i,l;for(let c=0;c<s.length;c++)e=s[c],p=e.app||"",i=e.key||"",l=e.val||"",r=p.length*2+i.length*2+l.length+1,n.push({app:e.app,key:e.key,size:r});typeof t=="function"?t(n):n.forEach(c=>{console.log(c)})})}};g(u,"LokiIndexedAdapter");u.prototype.loadKey=u.prototype.loadDatabase;u.prototype.saveKey=u.prototype.saveDatabase;u.prototype.deleteKey=u.prototype.deleteDatabase;u.prototype.getKeyList=u.prototype.getDatabaseList;var f=class{constructor(t){this.db=null,this.initializeLokiCatalog(t)}initializeLokiCatalog(t){let o=indexedDB.open("LokiCatalog",1),a=this;o.onupgradeneeded=({target:s})=>{let n=s.result;if(n.objectStoreNames.contains("LokiAKV")&&n.deleteObjectStore("LokiAKV"),!n.objectStoreNames.contains("LokiAKV")){let e=n.createObjectStore("LokiAKV",{keyPath:"id",autoIncrement:!0});e.createIndex("app","app",{unique:!1}),e.createIndex("key","key",{unique:!1}),e.createIndex("appkey","appkey",{unique:!0})}},o.onsuccess=({target:s})=>{a.db=s.result,typeof t=="function"&&t(a)},o.onerror=s=>{throw s}}getAppKey(t,o,a){let e=this.db.transaction(["LokiAKV"],"readonly").objectStore("LokiAKV").index("appkey"),r=`${t},${o}`,p=e.get(r);p.onsuccess=(i=>({target:l})=>{let c=l.result;(c===null||typeof c=="undefined")&&(c={id:0,success:!1}),typeof i=="function"?i(c):console.log(c)})(a),p.onerror=(i=>l=>{if(typeof i=="function")i({id:0,success:!1});else throw l})(a)}getAppKeyById(t,o,a){let e=this.db.transaction(["LokiAKV"],"readonly").objectStore("LokiAKV").get(t);e.onsuccess=((r,p)=>({target:i})=>{typeof p=="function"?p(i.result,r):console.log(i.result)})(a,o)}setAppKey(t,o,a,s){let e=this.db.transaction(["LokiAKV"],"readwrite").objectStore("LokiAKV"),r=e.index("appkey"),p=`${t},${o}`,i=r.get(p);i.onsuccess=({target:l})=>{let c=l.result;c==null?c={app:t,key:o,appkey:`${t},${o}`,val:a}:c.val=a;let y=e.put(c);y.onerror=(d=>K=>{typeof d=="function"?d({success:!1}):(console.error("LokiCatalog.setAppKey (set) onerror"),console.error(i.error))})(s),y.onsuccess=(d=>K=>{typeof d=="function"&&d({success:!0})})(s)},i.onerror=(l=>c=>{typeof l=="function"?l({success:!1}):(console.error("LokiCatalog.setAppKey (get) onerror"),console.error(i.error))})(s)}deleteAppKey(t,o){let n=this.db.transaction(["LokiAKV"],"readwrite").objectStore("LokiAKV").delete(t);n.onsuccess=(e=>r=>{typeof e=="function"&&e({success:!0})})(o),n.onerror=(e=>r=>{typeof e=="function"?e({success:!1}):(console.error("LokiCatalog.deleteAppKey raised onerror"),console.error(n.error))})(o)}getAppKeys(t,o){let n=this.db.transaction(["LokiAKV"],"readonly").objectStore("LokiAKV").index("app"),e=IDBKeyRange.only(t),r=n.openCursor(e),p=[];r.onsuccess=((i,l)=>({target:c})=>{let y=c.result;if(y){let d=y.value;i.push(d),y.continue()}else typeof l=="function"?l(i):console.log(i)})(p,o),r.onerror=(i=>l=>{typeof i=="function"?i(null):(console.error("LokiCatalog.getAppKeys raised onerror"),console.error(l))})(o)}getAllKeys(t){let s=this.db.transaction(["LokiAKV"],"readonly").objectStore("LokiAKV").openCursor(),n=[];s.onsuccess=((e,r)=>({target:p})=>{let i=p.result;if(i){let l=i.value;e.push(l),i.continue()}else typeof r=="function"?r(e):console.log(e)})(n,t),s.onerror=(e=>r=>{typeof e=="function"&&e(null)})(t)}};g(f,"LokiCatalog");typeof window!="undefined"&&Object.assign(window,{LokiIndexedAdapter:u});
if (typeof module.exports == "object" && typeof exports == "object") {
  var __cp = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of Object.getOwnPropertyNames(from)) {
        if (!Object.prototype.hasOwnProperty.call(to, key) && key !== except)
        Object.defineProperty(to, key, {
          get: () => from[key],
          enumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable,
        });
      }
    }
    return to;
  };
  module.exports = __cp(module.exports, exports);
}
return module.exports;
}))
//# sourceMappingURL=loki-indexed-adapter.js.map
