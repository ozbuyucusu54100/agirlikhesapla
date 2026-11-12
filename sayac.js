/* Sayaçlar: abacus.jasoncameron.dev (ücretsiz, hesap gerektirmez). Ulaşılamazsa sayfa normal çalışır, sayaç "–" kalır. */
(()=>{const B="https://abacus.jasoncameron.dev",NS="hayrat-agirlik-hesaplama",
 call=(op,k)=>fetch(B+"/"+op+"/"+NS+"/"+k).then(r=>r.ok?r.json():(r.status===404&&op==="get"?{value:0}:Promise.reject())).then(j=>typeof j.value==="number"?j.value:Promise.reject()),
 show=(k,v)=>{const e=document.getElementById("c-"+k);if(e)e.textContent=v.toLocaleString("tr-TR")};
 window.hahCount=k=>call("hit",k).then(v=>show(k,v)).catch(()=>{});
 let seen=false;try{seen=localStorage.getItem("hah_seen")==="1"}catch(e){}
 call(seen?"get":"hit","ziyaretci").then(v=>{if(!seen)try{localStorage.setItem("hah_seen","1")}catch(e){}show("ziyaretci",v)}).catch(()=>{});
 call("get","pdf").then(v=>show("pdf",v)).catch(()=>{});
})();
