var $=Object.defineProperty;var c=(i,n)=>$(i,"name",{value:n,configurable:!0});var g=typeof window!="undefined"&&!!window.__loki_incremental_idb_debug,E=class{constructor(n){if(this.mode="incremental",this.options=n||{},this.chunkSize=100,this.megachunkCount=this.options.megachunkCount||24,this.lazyCollections=this.options.lazyCollections||[],this.idb=null,this._prevLokiVersionId=null,this._prevCollectionVersionIds={},!(this.megachunkCount>=4&&this.megachunkCount%2===0))throw new Error("megachunkCount must be >=4 and divisible by 2")}_getChunk(n,t){let o=t*this.chunkSize,r=o+this.chunkSize-1;n.ensureId();let e=n.idIndex,s=null,l=e.length-1,a=0,m;for(;e[a]<e[l];)m=a+l>>1,e[m]<o?a=m+1:l=m;if(l===a&&e[a]>=o&&e[a]<=r&&(s=a),s===null)return[];let d=null;for(let f=s+this.chunkSize-1;f>=s;f--)if(e[f]<=r){d=f;break}let k=n.data[s];if(!(k&&k.$loki>=o&&k.$loki<=r))throw new Error("broken invariant firstelement");let h=n.data[d];if(!(h&&h.$loki>=o&&h.$loki<=r))throw new Error("broken invariant lastElement");let u=n.data.slice(s,d+1);if(u.length>this.chunkSize)throw new Error("broken invariant - chunk size");return u}saveDatabase(n,t,o){let r=this;if(!this.idb){this._initializeIDB(n,o,()=>{r.saveDatabase(n,t,o)});return}if(this.operationInProgress)throw new Error("Error while saving to database - another operation is already in progress. Please use throttledSaves=true option on Loki object");this.operationInProgress=!0,g&&console.log("saveDatabase - begin"),g&&console.time("saveDatabase");function e(s){g&&s&&console.error(s),g&&console.timeEnd("saveDatabase"),r.operationInProgress=!1,o(s)}c(e,"finish");try{let s=c(()=>{console.error("Unexpected successful tx - cannot update previous version ids")},"updatePrevVersionIds"),l=!1,a=this.idb.transaction(["LokiIncrementalData"],"readwrite");a.oncomplete=()=>{s(),e(),l&&r.options.onDidOverwrite&&r.options.onDidOverwrite()},a.onerror=u=>{e(u)},a.onabort=u=>{e(u)};let m=a.objectStore("LokiIncrementalData"),d=c(u=>{try{let f=!u,p=r._putInChunks(m,t(),f,u);s=c(()=>{r._prevLokiVersionId=p.lokiVersionId,p.collectionVersionIds.forEach(({name:I,versionId:b})=>{r._prevCollectionVersionIds[I]=b})},"updatePrevVersionIds"),a.commit&&a.commit()}catch(f){console.error("idb performSave failed: ",f),a.abort()}},"performSave"),k=c(()=>{w(m.getAllKeys(),({target:u})=>{let f=B(u.result);d(f)},u=>{console.error("Getting all keys failed: ",u),a.abort()})},"getAllKeysThenSave");c(()=>{w(m.get("loki"),({target:u})=>{M(u.result)===r._prevLokiVersionId?d():(g&&console.warn("Another writer changed Loki IDB, using slow path..."),l=!0,k())},u=>{console.error("Getting loki chunk failed: ",u),a.abort()})},"getLokiThenSave")()}catch(s){e(s)}}_putInChunks(n,t,o,r){let e=this,s=[],l=0,a=c((d,k)=>{let h=new Set;o&&d.dirtyIds.forEach(f=>{let p=f/e.chunkSize|0;h.add(p)}),d.dirtyIds=[];let u=c(f=>{let p=e._getChunk(d,f);e.options.serializeChunk&&(p=e.options.serializeChunk(d.name,p)),p=JSON.stringify(p),l+=p.length,g&&o&&console.log(`Saving: ${d.name}.chunk.${f}`),n.put({key:`${d.name}.chunk.${f}`,value:p})},"prepareChunk");if(o)h.forEach(u);else{let f=d.maxId/e.chunkSize|0;for(let I=0;I<=f;I+=1)u(I);let p=r[d.name]||0;for(let I=f+1;I<=p;I+=1){let b=`${d.name}.chunk.${I}`;n.delete(b),g&&console.warn(`Deleted chunk: ${b}`)}}if(d.dirty||h.size||!o){d.idIndex=[],d.data=[],d.idbVersionId=V(),s.push({name:d.name,versionId:d.idbVersionId});let f=JSON.stringify(d);l+=f.length,g&&o&&console.log(`Saving: ${d.name}.metadata`),n.put({key:`${d.name}.metadata`,value:f})}t.collections[k]={name:d.name}},"prepareCollection");t.collections.forEach(a),t.idbVersionId=V();let m=JSON.stringify(t);return l+=m.length,g&&o&&console.log("Saving: loki"),n.put({key:"loki",value:m}),g&&console.log(`saved size: ${l}`),{lokiVersionId:t.idbVersionId,collectionVersionIds:s}}loadDatabase(n,t){let o=this;if(this.operationInProgress)throw new Error("Error while loading database - another operation is already in progress. Please use throttledSaves=true option on Loki object");this.operationInProgress=!0,g&&console.log("loadDatabase - begin"),g&&console.time("loadDatabase");let r=c(e=>{g&&console.timeEnd("loadDatabase"),o.operationInProgress=!1,t(e)},"finish");this._getAllChunks(n,e=>{try{if(!Array.isArray(e))throw e;if(!e.length)return r(null);g&&console.log("Found chunks:",e.length),e=A(e);let s=e.loki;return e.loki=null,N(s,e.chunkMap,o.options.deserializeChunk,o.lazyCollections),e=null,o._prevLokiVersionId=s.idbVersionId||null,o._prevCollectionVersionIds={},s.collections.forEach(({name:l,idbVersionId:a})=>{o._prevCollectionVersionIds[l]=a||null}),r(s)}catch(s){return o._prevLokiVersionId=null,o._prevCollectionVersionIds={},r(s)}})}_initializeIDB(n,t,o){let r=this;if(g&&console.log("initializing idb"),this.idbInitInProgress)throw new Error("Cannot open IndexedDB because open is already in progress");this.idbInitInProgress=!0;let e=indexedDB.open(n,1);e.onupgradeneeded=({target:s,oldVersion:l})=>{let a=s.result;if(g&&console.log(`onupgradeneeded, old version: ${l}`),l<1)a.createObjectStore("LokiIncrementalData",{keyPath:"key"});else throw new Error(`Invalid old version ${l} for IndexedDB upgrade`)},e.onsuccess=({target:s})=>{r.idbInitInProgress=!1;let l=s.result;if(r.idb=l,!l.objectStoreNames.contains("LokiIncrementalData")){t(new Error("Missing LokiIncrementalData")),r.deleteDatabase(n);return}g&&console.log("init success"),l.onversionchange=a=>{r.idb===l&&(g&&console.log("IDB version change",a),r.idb.close(),r.idb=null,r.options.onversionchange&&r.options.onversionchange(a))},o()},e.onblocked=s=>{console.error("IndexedDB open is blocked",s),t(new Error("IndexedDB open is blocked by open connection"))},e.onerror=s=>{r.idbInitInProgress=!1,console.error("IndexedDB open error",s),t(s)}}_getAllChunks(n,t){let o=this;if(!this.idb){this._initializeIDB(n,t,()=>{o._getAllChunks(n,t)});return}let e=this.idb.transaction(["LokiIncrementalData"],"readonly").objectStore("LokiIncrementalData"),s=this.options.deserializeChunk,l=this.lazyCollections;function a(k){let h=o.megachunkCount,u=R(k,h),f=[],p=0;function I({target:v},D,C){let y="processing chunk "+D+" ("+C.lower+" -- "+C.upper+")";g&&console.time(y);let _=v.result;_.forEach((P,L)=>{x(P,s,l),f.push(P),_[L]=null}),g&&console.timeEnd(y),p+=1,p===h&&t(f)}c(I,"processMegachunk");let b=2,S=h/b;function z(v,D){let C=u[v];w(e.getAll(C),y=>{D<b&&z(v+S,D+1),I(y,v,C)},y=>{t(y)})}c(z,"requestMegachunk");for(let v=0;v<S;v+=1)z(v,1)}c(a,"getMegachunks");function m(){w(e.getAll(),({target:k})=>{let h=k.result;h.forEach(u=>{x(u,s,l)}),t(h)},k=>{t(k)})}c(m,"getAllChunks");function d(){function k(h){h.sort(),h.length>100?a(h):m()}c(k,"onDidGetKeys"),w(e.getAllKeys(),({target:h})=>{k(h.result)},h=>{t(h)}),o.options.onFetchStart&&o.options.onFetchStart()}c(d,"getAllKeys"),d()}deleteDatabase(n,t){if(this.operationInProgress)throw new Error("Error while deleting database - another operation is already in progress. Please use throttledSaves=true option on Loki object");this.operationInProgress=!0;let o=this;g&&console.log("deleteDatabase - begin"),g&&console.time("deleteDatabase"),this._prevLokiVersionId=null,this._prevCollectionVersionIds={},this.idb&&(this.idb.close(),this.idb=null);let r=indexedDB.deleteDatabase(n);r.onsuccess=()=>{o.operationInProgress=!1,g&&console.timeEnd("deleteDatabase"),t({success:!0})},r.onerror=e=>{o.operationInProgress=!1,console.error("Error while deleting database",e),t({success:!1})},r.onblocked=e=>{console.error("Deleting database failed because it's blocked by another connection",e)}}};c(E,"IncrementalIndexedDBAdapter");function B(i){let n={};return i.forEach(t=>{let o=t.split(".");if(o.length===3&&o[1]==="chunk"){let r=o[0],e=parseInt(o[2])||0,s=n[r];(!s||e>s)&&(n[r]=e)}}),n}c(B,"getMaxChunkIds");function M(i){try{return i&&JSON.parse(i.value).idbVersionId||null}catch(n){return console.error("Error while parsing loki chunk",n),null}}c(M,"lokiChunkVersionId");function A(i){let n,t={};if(O(i),i.forEach(o=>{let r=o.type,e=o.value,s=o.collectionName;if(r==="loki")n=e;else if(r==="data")t[s]?t[s].dataChunks.push(e):t[s]={metadata:null,dataChunks:[e]};else if(r==="metadata")t[s]?t[s].metadata=e:t[s]={metadata:e,dataChunks:[]};else throw new Error("unreachable")}),!n)throw new Error("Corrupted database - missing database metadata");return{loki:n,chunkMap:t}}c(A,"chunksToMap");function N({collections:i},n,t,o){i.forEach(c(function(e,s){let l=e.name,a=n[l];if(a){if(!a.metadata)throw new Error(`Corrupted database - missing metadata chunk for ${l}`);let m=a.metadata;a.metadata=null,i[s]=m;let d=o.includes(l),k=c(()=>{g&&d&&console.log(`lazy loading ${l}`);let h=[],u=a.dataChunks;return u.forEach(c(function(p,I){d&&(p=JSON.parse(p),t&&(p=t(l,p))),p.forEach(b=>{h.push(b)}),u[I]=null},"populateChunk")),h},"lokiDeserializeCollectionChunks");m.getData=k}},"populateCollection"))}c(N,"populateLoki");function K(i){let n=i.key;if(n==="loki"){i.type="loki";return}else if(n.includes(".")){let t=n.split(".");if(t.length===3&&t[1]==="chunk"){i.type="data",i.collectionName=t[0],i.index=parseInt(t[2],10);return}else if(t.length===2&&t[1]==="metadata"){i.type="metadata",i.collectionName=t[0];return}}throw console.error(`Unknown chunk ${n}`),new Error("Corrupted database - unknown chunk found")}c(K,"classifyChunk");function x(i,n,t){K(i);let o=i.type==="data",r=t.includes(i.collectionName);o&&r||(i.value=JSON.parse(i.value)),n&&o&&!r&&(i.value=n(i.collectionName,i.value))}c(x,"parseChunk");function V(){return Math.random().toString(36).substring(2)}c(V,"randomVersionId");function O(i){i.sort(function(n,t){return(n.index||0)-(t.index||0)})}c(O,"sortChunksInPlace");function R(i,n){let t=Math.floor(i.length/n),o=[],r,e;for(let s=0;s<n;s+=1)r=i[t*s],e=i[t*(s+1)],s===0?o.push(IDBKeyRange.upperBound(e,!0)):s===n-1?o.push(IDBKeyRange.lowerBound(r)):o.push(IDBKeyRange.bound(r,e,!1,!0));return o}c(R,"createKeyRanges");function w(i,n,t){return i.onsuccess=o=>{try{return n(o)}catch(r){t(r)}},i.onerror=t,i}c(w,"idbReq");window!==void 0&&Object.assign(window,{IncrementalIndexedDBAdapter:E});export{E as IncrementalIndexedDBAdapter};
//# sourceMappingURL=incremental-indexeddb-adapter.js.map
