var z=Object.defineProperty,Z=Object.defineProperties;var M=Object.getOwnPropertyDescriptors;var T=Object.getOwnPropertySymbols;var j=Object.prototype.hasOwnProperty,H=Object.prototype.propertyIsEnumerable;var L=(a,e,t)=>e in a?z(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t,N=(a,e)=>{for(var t in e||={})j.call(e,t)&&L(a,t,e[t]);if(T)for(var t of T(e))H.call(e,t)&&L(a,t,e[t]);return a},U=(a,e)=>Z(a,M(e)),c=(a,e)=>z(a,"name",{value:e,configurable:!0});var C=(a,e,t)=>{if(!e.has(a))throw TypeError("Cannot "+t)};var A=(a,e,t)=>(C(a,e,"read from private field"),t?t.call(a):e.get(a)),D=(a,e,t)=>{if(e.has(a))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(a):e.set(a,t)},I=(a,e,t,s)=>(C(a,e,"write to private field"),s?s.call(a,t):e.set(a,t),t);var E=(a,e,t)=>(C(a,e,"access private method"),t);var p=(a,e,t)=>new Promise((s,n)=>{var r=l=>{try{i(t.next(l))}catch(d){n(d)}},o=l=>{try{i(t.throw(l))}catch(d){n(d)}},i=l=>l.done?s(l.value):Promise.resolve(l.value).then(r,o);i((t=t.apply(a,e)).next())});function Y(a){if(a.length%4!==0)throw new Error("Unable to parse base64 string (invalid length).");let e=a.indexOf("=");if(e!==-1&&e<a.length-2)throw new Error("Unable to parse base64 string (octets).");let t=a.endsWith("==")?2:a.endsWith("=")?1:0,s=a.length,n=new Uint8Array(3*(s/4)),r;for(let o=0,i=0;o<s;o+=4,i+=3)r=P(a.charCodeAt(o))<<18|P(a.charCodeAt(o+1))<<12|P(a.charCodeAt(o+2))<<6|P(a.charCodeAt(o+3)),n[i]=r>>16,n[i+1]=r>>8&255,n[i+2]=r&255;return n.subarray(0,n.length-t)}c(Y,"base64ToBytes");var y=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","_","-"],V=(()=>{let e=new Uint8Array(256);for(let t=0;t<256;++t)e[t]=255;return y.forEach((t,s)=>{e[t.charCodeAt(0)]=s}),e["=".charCodeAt(0)]=0,e})();function P(a){if(a>=V.length)throw new Error("Unable to parse base64 string (code beyond length).");let e=V[a];if(e===255)throw new Error("Unable to parse base64 string (invalid code).");return e}c(P,"getBase64Code");function J(a){let e="",t,s=a.length;for(t=2;t<s;t+=3)e+=y[a[t-2]>>2],e+=y[(a[t-2]&3)<<4|a[t-1]>>4],e+=y[(a[t-1]&15)<<2|a[t]>>6],e+=y[a[t]&63];return t===s+1&&(e+=y[a[t-2]>>2],e+=y[(a[t-2]&3)<<4],e+="=="),t===s&&(e+=y[a[t-2]>>2],e+=y[(a[t-2]&3)<<4|a[t-1]>>4],e+=y[(a[t-1]&15)<<2],e+="="),e}c(J,"bytesToBase64");var $=c(a=>{let e=new TextEncoder;return window.crypto.subtle.importKey("raw",e.encode(a),"PBKDF2",!1,["deriveKey"])},"getPasswordKey"),G=c((a,e,t)=>window.crypto.subtle.deriveKey({name:"PBKDF2",salt:e,iterations:25e4,hash:"SHA-256"},a,{name:"AES-GCM",length:256},!1,t),"deriveKey");function O(a,e){return p(this,null,function*(){try{let t=window.crypto.getRandomValues(new Uint8Array(16)),s=window.crypto.getRandomValues(new Uint8Array(12)),n=yield $(e),r=yield G(n,t,["encrypt"]),o=yield window.crypto.subtle.encrypt({name:"AES-GCM",iv:s},r,new TextEncoder().encode(a)),i=new Uint8Array(o),l=new Uint8Array(t.byteLength+s.byteLength+i.byteLength);return l.set(t,0),l.set(s,t.byteLength),l.set(i,t.byteLength+s.byteLength),J(l)}catch(t){throw console.log(`Encryption Error - ${t}`),t}})}c(O,"encryptData");function q(a,e){return p(this,null,function*(){try{let t=Y(a),s=t.slice(0,16),n=t.slice(16,16+12),r=t.slice(16+12),o=yield $(e),i=yield G(o,s,["decrypt"]),l=yield window.crypto.subtle.decrypt({name:"AES-GCM",iv:n},i,r);return new TextDecoder().decode(l)}catch(t){throw console.log(`Decryption Error - ${t}`),t}})}c(q,"decryptData");var x,_,v,u=class{constructor(){D(this,x);D(this,v,c(()=>p(this,null,function*(){let e=E(this,x,_).call(this);return new Promise((t,s)=>{e.onsuccess=({target:n})=>{this.db=n.result,t(this)},e.onerror=n=>{s(n)}})}),"#initializeCatalog"));this.db=null}initialize(){return new Promise((e,t)=>{A(this,v).call(this).then(s=>{e(s)}).catch(s=>{console.log(s),t(s)})})}getAppKeyAsync(e,t){return p(this,null,function*(){let r=this.db.transaction(["IDBAKV"],"readonly").objectStore("IDBAKV").index("appkey"),o=`${e},${t}`,i=r.get(o);return new Promise((l,d)=>{i.onsuccess=({target:h})=>{let b=h.result;(b===null||typeof b=="undefined")&&(b={id:0,success:!1}),l(b)},i.onerror=h=>{d(h)}})})}setAppKeyAsync(e,t,s){return p(this,null,function*(){let r=this.db.transaction(["IDBAKV"],"readwrite").objectStore("IDBAKV"),o=r.index("appkey"),i=`${e},${t}`,l=o.get(i);return new Promise((d,h)=>{l.onsuccess=({target:b})=>{let m=b.result;m==null?m={app:e,key:t,appkey:`${e},${t}`,val:s}:m.val=s;let R=r.put(m);R.onerror=()=>{h({success:!1,error:R.error}),console.error("IDBCatalog.setAppKey (set) onerror"),console.error(l.error)},R.onsuccess=()=>{d({success:!0})}},l.onerror=()=>{h({success:!1,error:l.error}),console.error("IDBCatalog.setAppKey (get) onerror"),console.error(l.error)}})})}deleteAppKeyAsync(e){let n=this.db.transaction(["IDBAKV"],"readwrite").objectStore("IDBAKV").delete(e);return new Promise((r,o)=>{n.onsuccess=()=>{r({success:!0})},n.onerror=i=>{o({success:!1,error:i}),console.error("IDBCatalog.deleteAppKey raised onerror"),console.error(n.error)}})}getAppKeysAsync(e){return p(this,null,function*(){let n=this.db.transaction(["IDBAKV"],"readonly").objectStore("IDBAKV").index("app"),r=IDBKeyRange.only(e),o=n.openCursor(r),i=[];return new Promise((l,d)=>{o.onsuccess=()=>{let h=o.result;if(h){let b=h.value;i.push(b),h.continue()}else l(i)},o.onerror=h=>{d(h)}})})}getAllKeys(e){let n=this.db.transaction(["IDBAKV"],"readonly").objectStore("IDBAKV").openCursor(),r=[];n.onsuccess=((o,i)=>({target:l})=>{let d=l.result;if(d){let h=d.value;o.push(h),d.continue()}else typeof i=="function"?i(o):console.log(o)})(r,e),n.onerror=(o=>i=>{typeof o=="function"&&o(null)})(e)}};c(u,"IDBCatalog"),x=new WeakSet,_=c(function(){let e=indexedDB.open("IDBCatalog",1);return e.onupgradeneeded=({target:t})=>{let s=t.result;if(s.objectStoreNames.contains("IDBAKV")&&s.deleteObjectStore("IDBAKV"),!s.objectStoreNames.contains("IDBAKV")){let n=s.createObjectStore("IDBAKV",{keyPath:"id",autoIncrement:!0});n.createIndex("app","app",{unique:!1}),n.createIndex("key","key",{unique:!1}),n.createIndex("appkey","appkey",{unique:!0})}},e},"#openCatalog"),v=new WeakMap;var g=typeof window!="undefined"&&!!window.__loki_idb_debug;g&&console.log("DEBUG: Running indexeddb-adapter in DEBUG mode");var B,K,W,w=class{constructor(e){D(this,K);D(this,B,c(()=>{this.catalog&&this.catalog.db&&(this.catalog.db.close(),this.catalog.db=null)},"#closeDatabase"));this.loadDatabase=c((e,t)=>{if(g&&console.debug("loading database"),this.catalog===null||this.catalog.db===null){new u().initialize().then(s=>{this.catalog=s,this.loadDatabase(e,t)});return}this.catalog.getAppKeyAsync(this.app,e).then(s=>{let{success:n}=s;if(n===!1)t(null);else{let{val:r}=s;this.options.beforeReadFromIDB?this.options.beforeReadFromIDB(r).then(o=>{g&&console.debug(`DESERIALIZED STRING: ${o}`),t(o)}).catch(o=>{console.error(o),t(o)}):t(r)}}).catch(s=>{console.error(s),t(s)})},"loadDatabase");this.loadDatabaseAsync=c(e=>p(this,null,function*(){return g&&console.debug("loading database"),new Promise((t,s)=>{let n=c(()=>this.catalog.getAppKeyAsync(this.app,e).then(r=>{let{success:o}=r;if(o===!1)s(null);else{let{val:i}=r,l=i;this.options.beforeReadFromIDB?this.options.beforeReadFromIDB(l).then(d=>{g&&console.debug(`DESERIALIZED STRING: ${d}`),t(d)}).catch(d=>{s(d)}):t(l)}}),"doLoad");this.catalog===null||this.catalog.db===null?new u().initialize().then(r=>{this.catalog=r,n()}).catch(r=>{s(r)}):n()})}),"loadDatabaseAsync");this.saveDatabase=c((e,t,s)=>{g&&console.debug(`in saveDatabase(${e}, ${t}, ${s})`);let n=c(()=>{this.options.beforeWriteToIDB?this.options.beforeWriteToIDB(t).then(r=>{g&&console.debug(`SERIALIZED STRING: ${r}`),this.catalog.setAppKeyAsync(this.app,e,r).then(o=>{s(o)}).catch(o=>{s(o)})}).catch(r=>{s(r)}):(g&&console.debug(`SERIALIZED STRING: ${t}`),this.catalog.setAppKeyAsync(this.app,e,t).then(r=>{s(r)}).catch(r=>{s(r)}))},"doSave");this.catalog===null||this.catalog.db===null?new u().initialize().then(r=>{this.catalog=r,this.saveDatabaseAsync(e,t).then(()=>{s(void 0)}).catch(o=>{s(new Error("Error saving database: "+o))}).finally(()=>{this.options.closeAfterSave===!0&&A(this,B).call(this)})}).catch(r=>{s(new Error("Error saving database: "+r))}):n()},"saveDatabase");this.deleteDatabase=c((e,t)=>{if(this.catalog===null||this.catalog.db===null){new u().initialize().then(s=>{this.catalog=s,this.deleteDatabase(e,t)}).catch(s=>{t(new Error("Error deleting database: "+s))});return}this.catalog.getAppKeyAsync(this.app,e).then(s=>{let n=s.id;n!==0&&this.catalog.deleteAppKeyAsync(n).then(r=>{typeof t=="function"&&t(r)}).catch(r=>{typeof t=="function"&&t({success:!1,error:r})})}).catch(s=>{typeof t=="function"&&t({success:!1,error:s})})},"deleteDatabase");this.deleteDatabasePartitions=c(e=>{this.getDatabaseList(t=>{if(t instanceof Error)throw t;t.forEach(s=>{s.startsWith(e)&&this.deleteDatabase(s)})})},"deleteDatabasePartitions");this.getDatabaseList=c(e=>{if(this.catalog===null||this.catalog.db===null){new u().initialize().then(t=>{this.catalog=t,this.getDatabaseList(e)}).catch(t=>{e(new Error("Error getting database list: "+t))});return}this.catalog.getAppKeysAsync(this.app).then(t=>{let s=[];for(let n=0;n<t.length;n++)s.push(t[n].key);typeof e=="function"&&e(s)}).catch(t=>{e(t)})},"getDatabaseList");this.getDatabaseListAsync=c(()=>new Promise((e,t)=>{this.catalog===null||this.catalog.db===null?new u().initialize().then(s=>{this.catalog=s,this.catalog.getAppKeysAsync(this.app).then(n=>{let r=n.map(o=>o.key);e(r)}).catch(n=>{t(n)})}).catch(s=>{t(s)}):this.catalog.getAppKeysAsync(this.app).then(s=>{let n=s.map(r=>r.key);e(n)}).catch(s=>{t(s)})}),"getDatabaseListAsync");this.getCatalogSummary=c(e=>{if(this.catalog===null||this.catalog.db===null){new u().initialize().then(t=>{this.catalog=t,this.getCatalogSummary(e)}).catch(t=>{e(new Error("Error getting database list: "+t))});return}this.catalog.getAllKeys(t=>{let s=[],n,r,o,i,l;for(let d=0;d<t.length;d++)n=t[d],o=n.app||"",i=n.key||"",l=n.val||"",r=o.length*2+i.length*2+l.length+1,s.push({app:n.app,key:n.key,size:r});typeof e=="function"&&e(s)})},"getCatalogSummary");if(g&&console.log("Initialized crypted-indexeddb-adapter"),this.app="sylvie",this.options=e||{},typeof(e==null?void 0:e.appname)!="undefined"&&(this.app=e==null?void 0:e.appname),this.catalog=null,!E(this,K,W).call(this))throw new Error("IndexedDB does not seem to be supported for your environment")}saveDatabaseAsync(e,t){return p(this,null,function*(){return new Promise((s,n)=>{let r=c(()=>{this.options.beforeWriteToIDB?this.options.beforeWriteToIDB(t).then(o=>{g&&console.debug(`ENCRYPTED STRING: ${o}`),this.catalog.setAppKeyAsync(this.app,e,o).then(i=>{i.success===!0?s():n(i)}).catch(i=>{n(i)})}).catch(o=>{n(o)}):(g&&console.debug(`SERIALIZED STRING: ${t}`),this.catalog.setAppKeyAsync(this.app,e,t).then(o=>{o.success===!0?s():n(o)}).catch(o=>{n(o)}))},"doSave");this.catalog===null||this.catalog.db===null?new u().initialize().then(o=>{this.catalog=o,this.saveDatabaseAsync(e,t).then(s).catch(i=>{n(new Error("Error saving database: "+i))}).finally(()=>{this.options.closeAfterSave===!0&&A(this,B).call(this)})}).catch(o=>{n(o)}):r()})})}deleteDatabaseAsync(e){return p(this,null,function*(){return new Promise((t,s)=>{let n=c(()=>this.catalog.getAppKeyAsync(this.app,e).then(r=>{let o=r.id;o!==0&&this.catalog.deleteAppKeyAsync(o).then(i=>{i.success===!0?t():s(i)}).catch(i=>{s(i)})}).catch(r=>{s(r)}),"doDelete");this.catalog===null||this.catalog.db===null?new u().initialize().then(r=>{this.catalog=r,n()}).catch(r=>{s(r)}):n()})})}};c(w,"IndexedDBAdapter"),B=new WeakMap,K=new WeakSet,W=c(function(){return!!(typeof indexedDB!="undefined"&&indexedDB)},"#checkIDBAvailability");typeof window!="undefined"&&Object.assign(window,{IndexedDBAdapter:w});var F=typeof window!="undefined"&&!!window.__loki_idb_debug;F&&console.log("DEBUG: Running crypted-indexeddb-adapter in DEBUG mode");var f,S=class{constructor(e){D(this,f,void 0);this.loadDatabase=c((e,t)=>{this.idbAdapter.loadDatabase(e,t)},"loadDatabase");this.loadDatabaseAsync=c(e=>p(this,null,function*(){return this.idbAdapter.loadDatabaseAsync(e)}),"loadDatabaseAsync");this.saveDatabase=c((e,t,s)=>this.idbAdapter.saveDatabase(e,t,s),"saveDatabase");this.deleteDatabase=c((e,t)=>this.idbAdapter.deleteDatabase(e,t),"deleteDatabase");this.deleteDatabasePartitions=c(e=>{this.idbAdapter.deleteDatabasePartitions(e)},"deleteDatabasePartitions");this.getDatabaseList=c(e=>{this.idbAdapter.getDatabaseList(e)},"getDatabaseList");this.getDatabaseListAsync=c(()=>this.idbAdapter.getDatabaseListAsync(),"getDatabaseListAsync");if(F&&console.log("Initialized crypted-indexeddb-adapter"),this.app="sylvie",!window.crypto.subtle)throw alert("Required crypto lib is not available, are you using SSL?"),new Error("Required crypto lib is not available");typeof(e==null?void 0:e.appname)!="undefined"&&(this.app=e==null?void 0:e.appname),e.secret&&I(this,f,e.secret||"");let t=this;this.idbAdapter=new w(U(N({},e),{beforeReadFromIDB(s){return q(s,A(t,f))},beforeWriteToIDB(s){return O(s,A(t,f))}}))}usePassword(e){I(this,f,e)}saveDatabaseAsync(e,t){return p(this,null,function*(){return this.idbAdapter.saveDatabaseAsync(e,t)})}deleteDatabaseAsync(e){return p(this,null,function*(){return this.idbAdapter.deleteDatabaseAsync(e)})}changePassword(e,t){return p(this,null,function*(){return new Promise((s,n)=>{this.loadDatabase(e,r=>{let o=A(this,f);I(this,f,t),this.saveDatabase(e,r,i=>{i&&(I(this,f,o),i.success===!0?s():n(i)),s()})})})})}};c(S,"CryptedIndexedDBAdapter"),f=new WeakMap;typeof window!="undefined"&&Object.assign(window,{CryptedIndexedDBAdapter:S});export{S as CryptedIndexedDBAdapter};
//# sourceMappingURL=crypted-indexeddb-adapter.js.map
