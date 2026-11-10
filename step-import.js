/* STEP (.step/.stp) dosyasından profil, boy ve açı okuyup kesim listesini otomatik oluşturur. */
(()=>{
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],
 cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],nl=a=>Math.hypot(a[0],a[1],a[2]),
 near=(a,v)=>a.reduce((p,x)=>Math.abs(x-v)<Math.abs(p-v)?x:p),
 SZ=ty=>Array.isArray(T[ty].s)?T[ty].s:Object.keys(T[ty].s),
 TH=(ty,sz)=>{const o=T[ty].t?T[ty].t.filter(t=>tOk(ty,sz,t)):[];return o.length?o:(T[ty].t?[T[ty].t[0]]:[])};
let rows=[];

function parse(txt){
 const E=new Map(),re=/#(\d+)\s*=\s*([A-Z0-9_]+)\s*\(([\s\S]*?)\)\s*;/g;let m;
 while((m=re.exec(txt)))E.set(+m[1],{n:m[2],a:m[3]});
 const sc=/SI_UNIT\(\s*\.MILLI\.\s*,\s*\.METRE\.\s*\)/.test(txt)?1:/SI_UNIT\(\s*\$\s*,\s*\.METRE\.\s*\)/.test(txt)?1000:/INCH/.test(txt)?25.4:1;
 const R=s=>[...s.matchAll(/#(\d+)/g)].map(x=>+x[1]);
 const nums=id=>E.get(id).a.match(/\(([^()]*)\)\s*$/)[1].split(",").map(Number);
 const vp=v=>nums(R(E.get(v).a)[0]).map(x=>x*sc);
 const sets=[],solids=[...E.values()].filter(e=>e.n==="MANIFOLD_SOLID_BREP");
 if(solids.length)solids.forEach(e=>{const s=new Set(),sh=E.get(R(e.a)[0]);if(!sh)return;
  R(sh.a).forEach(f=>{const F=E.get(f);if(!F)return;R(F.a).forEach(b=>{const B=E.get(b);if(!B||!/^FACE/.test(B.n))return;
   const lp=E.get(R(B.a)[0]);if(lp)R(lp.a).forEach(o=>{const O=E.get(o);if(O)s.add(R(O.a)[0])})})});sets.push(s)});
 else sets.push(new Set([...E].filter(([,e])=>e.n==="EDGE_CURVE").map(([i])=>i)));

 const an=s=>{
  const ed=[];s.forEach(i=>{try{const a=E.get(i),r=R(a.a);let c=E.get(r[2]);
   while(c&&(c.n==="SURFACE_CURVE"||c.n==="SEAM_CURVE"))c=E.get(R(c.a)[0]);
   ed.push({v1:r[0],v2:r[1],p1:vp(r[0]),p2:vp(r[1]),c})}catch(x){}});
  const G=new Map();
  ed.forEach(e=>{if(!e.c||e.c.n!=="LINE")return;const v=sub(e.p2,e.p1),l=nl(v);if(l<1e-6)return;let u=v.map(x=>x/l);
   const z=x=>Math.abs(x)<=1e-3;if(u[0]<-1e-3||(z(u[0])&&(u[1]<-1e-3||(z(u[1])&&u[2]<0))))u=u.map(x=>-x);
   const k=u.map(x=>Math.round(x*1e3)/1e3||0).join(),g=G.get(k)||{u,l:0};g.l+=l;G.set(k,g)});
  const best=[...G.values()].sort((a,b)=>b.l-a.l)[0];if(!best)return null;
  const d=best.u,a0=Math.abs(d[0])<.9?[1,0,0]:[0,1,0];let e1=cr(d,a0);const n1=nl(e1);e1=e1.map(x=>x/n1);const e2=cr(d,e1);
  const V=new Map();ed.forEach(e=>{V.set(e.v1,e.p1);V.set(e.v2,e.p2)});
  const P=[...V.values()].map(p=>[dot(p,e1),dot(p,e2),dot(p,d)]);if(P.length<3)return null;
  const ext=a=>{const c=Math.cos(a),s2=Math.sin(a);let u0=1e18,u1=-1e18,v0=1e18,v1=-1e18;
   P.forEach(p=>{const u=p[0]*c+p[1]*s2,v=-p[0]*s2+p[1]*c;u0=Math.min(u0,u);u1=Math.max(u1,u);v0=Math.min(v0,v);v1=Math.max(v1,v)});
   return{a,u0,u1,v0,v1,A:(u1-u0)*(v1-v0)}};
  let B=null;for(let k=0;k<180;k++){const r=ext(k*Math.PI/360);if(!B||r.A<B.A-1e-9)B=r}
  const ar=B.a;for(let k=-25;k<=25;k++){const r=ext(ar+k*Math.PI/18000);if(r.A<B.A-1e-9)B=r}
  const c=Math.cos(B.a),s2=Math.sin(B.a),bu=B.u1-B.u0,bv=B.v1-B.v0,sw=bu>bv;
  const q=P.map(p=>{const u=p[0]*c+p[1]*s2-B.u0,v=-p[0]*s2+p[1]*c-B.v0;return{x:sw?v:u,y:sw?u:v,t:p[2]}});
  const bs=Math.min(bu,bv),bl=Math.max(bu,bv),tn=Math.min(...q.map(p=>p.t)),tx=Math.max(...q.map(p=>p.t)),mid=(tn+tx)/2;
  const sl=g=>{const n=g.length;if(n<3)return[0,0];const mx=g.reduce((a,p)=>a+p.x,0)/n,my=g.reduce((a,p)=>a+p.y,0)/n,mt=g.reduce((a,p)=>a+p.t,0)/n;
   let Sxx=0,Syy=0,Sxy=0,Stx=0,Sty=0;g.forEach(p=>{const x=p.x-mx,y=p.y-my,t=p.t-mt;Sxx+=x*x;Syy+=y*y;Sxy+=x*y;Stx+=t*x;Sty+=t*y});
   const D=Sxx*Syy-Sxy*Sxy;if(D<1e-9*(Sxx+Syy)*(Sxx+Syy))return[0,0];return[(Stx*Syy-Sty*Sxy)/D,(Sty*Sxx-Stx*Sxy)/D]};
  const[bx0,by0]=sl(q.filter(p=>p.t<mid)),[bx1,by1]=sl(q.filter(p=>p.t>=mid)),tol=.012,
   useX=Math.max(Math.abs(bx0),Math.abs(bx1))>=Math.max(Math.abs(by0),Math.abs(by1)),
   s0=useX?bx0:by0,s1=useX?bx1:by1,g0=Math.abs(s0)>tol,g1=Math.abs(s1)>tol;
  const ag=s=>Math.round(Math.atan(Math.abs(s))*180/Math.PI*2)/2;let ct="d",th=0,th2=0;
  if(g0||g1){ct=g0&&g1?(s0*s1>0?"p":"t"):"s";th=g0?ag(s0):ag(s1);th2=g1?ag(s1):th}
  const rad=ed.filter(e=>{if(!e.c||e.c.n!=="CIRCLE")return false;const R0=parseFloat(e.c.a.split(",").pop())*sc;
   return(e.v1===e.v2||nl(sub(e.p1,e.p2))>1.9*R0)&&Math.abs(dot(nums(R(E.get(R(e.c.a)[0]).a)[1]),d))>.999}).map(e=>parseFloat(e.c.a.split(",").pop())*sc);
  const ins=q.filter(p=>Math.min(p.x,bs-p.x)>.3&&Math.min(p.y,bl-p.y)>.3),
   xr=ins.length?Math.max(...ins.map(p=>p.x))-Math.min(...ins.map(p=>p.x)):0,yr=ins.length?Math.max(...ins.map(p=>p.y))-Math.min(...ins.map(p=>p.y)):0,
   hol=ins.length>=4&&xr>.5*bs&&yr>.5*bl,n=new Set(q.map(p=>Math.round(p.x*10)+"_"+Math.round(p.y*10))).size,
   t0=Math.min(...q.map(p=>Math.min(p.x,bs-p.x,p.y,bl-p.y)).filter(v=>v>.3),bs);
  return{L:tx-tn,bs,bl,rad,hol,n,tk:(bs-xr)/2,t0,ct,th,th2,useX}};

 const cls=a=>{const{bs,bl,rad,hol,n}=a;
  if(rad.length){const Rm=Math.max(...rad),r=Math.min(...rad);
   if(Rm-r>.3)return{ty:"Boru",sz:String(near(T.Boru.s,2*Rm)),t:String(near(T.Boru.t,Rm-r))};
   return{ty:"Dolu yuvarlak",sz:String(near(T["Dolu yuvarlak"].s,2*Rm)),t:""}}
  if(hol){const k=T["Kutu profil"].s.reduce((p,s)=>{const[x,y]=s.split("x").map(Number),e=Math.abs(x-bs)+Math.abs(y-bl);return e<p.e?{s,e}:p},{e:1e9});
   return{ty:"Kutu profil",sz:k.s,t:String(near(T["Kutu profil"].t,a.tk))}}
  if(n<=4)return Math.abs(bs-bl)<.6?{ty:"Dolu kare",sz:String(near(T["Dolu kare"].s,bs)),t:""}:{ty:"Lama",sz:String(near(T.Lama.s,bl)),t:String(near(T.Lama.t,bs))};
  let best=null;const c=(ty,sz,e)=>{if(!best||e<best.e)best={ty,sz,e,t:""}},sp=(x,y)=>Math.abs(Math.min(x,y)-bs)+Math.abs(Math.max(x,y)-bl),pen=n<=8?4:0;
  for(const k in BI)c("IPE",k,sp(BI[k],+k)+pen);
  for(const k in BH){c("HEA",k,sp(BH[k],HAh[k])+pen);c("HEB",k,sp(BH[k],+k)+pen)}
  for(const k in UB)c("UPN",k,sp(UB[k],+k));
  for(const k in T["Köşebent (L)"].s){const p=k.split("x").map(Number);c("Köşebent (L)",k,sp(p[0],p[0])+Math.abs(p[2]-a.t0)+(n>10?4:0))}
  return best};

 const pname=[...E.values()].filter(e=>e.n==="PRODUCT").map(e=>(e.a.split("'")[3]||"")).find(x=>x&&!/^(part|none|\s*)$/i.test(x))||"";
 const grp=new Map();
 sets.forEach(s=>{const a=an(s);if(!a||!(a.L>0))return;const c=cls(a),tt=c.t?parseFloat(c.t):0,m=dims(c.ty,c.sz,tt),
   sw=Math.abs(a.bs-m[0])>Math.abs(a.bs-m[1]),pl=(a.useX!==sw)?"b":"h",L=Math.round(a.L*10)/10,k=[c.ty,c.sz,c.t,L,a.ct,a.th,a.th2,pl].join("|"),g=grp.get(k);
   if(g)g.cnt++;else grp.set(k,{ty:c.ty,sz:c.sz,t:c.t,L,ct:a.ct,th:a.th,th2:a.th2,pl,cnt:1,pn:pname})});
 return[...grp.values()].map(g=>({...g,q:g.cnt}))}

const opt=(a,v)=>a.map(x=>`<option value="${x}"${String(x)===String(v)?" selected":""}>${typeof x==="number"?tr(x):x}</option>`).join("");
const CT=[["d","Düz 90°"],["s","Tek uç açılı"],["p","Paralel //"],["t","Ters (trapez)"]];
function draw(){$("stt").classList.toggle("hid",!rows.length);
 $("stb").innerHTML=rows.map((r,i)=>`<tr data-i="${i}"><td>${r.f}${r.cnt>1?` <small>(${r.cnt} parça)</small>`:""}</td><td><select data-k="ty">${opt(Object.keys(T),r.ty)}</select> <select data-k="sz">${opt(SZ(r.ty),r.sz)}</select>${T[r.ty].t?` <select data-k="t">${opt(TH(r.ty,r.sz),r.t)}</select>`:""}</td><td><input data-k="L" type="number" step="any" min="0" value="${r.L}"></td><td><select data-k="ct">${CT.map(([v,l])=>`<option value="${v}"${v===r.ct?" selected":""}>${l}</option>`).join("")}</select> <input data-k="th" type="number" step="any" min="0" max="80" value="${r.th}" style="width:70px"> °${r.ct==="p"||r.ct==="t"?` / <input data-k="th2" type="number" step="any" min="0" max="80" value="${r.th2}" style="width:70px"> °`:""}</td><td><input data-k="q" type="number" min="0" step="1" value="${r.q}"></td><td><button class="x" data-del="${i}" aria-label="Sil">×</button></td></tr>`).join("")}

function mk(r){try{$("type").value=r.ty;setType();$("size").value=r.sz;fillThk();if(T[r.ty].t&&r.t)$("thk").value=r.t;
 $("ctype").value=r.ct;vis();$("ang").value=r.th||45;$("ang2").value=r.th2||r.th||45;$("plane").value=r.pl;autoW();$("len").value=r.L;$("qty").value=r.q;
 const c=cur();c.name+=" · "+r.f;return c}catch(e){return null}}

function sync(){list=list.filter(x=>!x.st);
 rows.forEach(r=>{if(!(r.q>0)||!(r.L>0))return;const c=mk(r);if(c&&c.ok){c.st=1;list.push(c)}});render()}

const on=e=>{const k=e.target.dataset.k;if(!k)return;const r=rows[e.target.closest("tr").dataset.i],v=e.target.value;
 if(k==="L"||k==="th"||k==="th2"||k==="q")r[k]=parseFloat(v)||0;else r[k]=v;
 if(k==="ty"){r.sz=String(SZ(v)[0]);r.t=T[v].t?String(TH(v,r.sz)[0]):""}
 if(k==="sz"&&T[r.ty].t){const o=TH(r.ty,v).map(String);if(!o.includes(String(r.t)))r.t=o[0]}
 if(k==="ct"&&v!=="d"&&!r.th)r.th=45;if(k==="ct"&&(v==="p"||v==="t")&&!r.th2)r.th2=r.th;if(k==="ct"&&v==="s")r.th2=r.th;
 if(["ty","sz","ct"].includes(k))draw();(e.type==="input"?ds:sync)()};
let tm;const ds=()=>{clearTimeout(tm);tm=setTimeout(sync,250)};
$("stb").addEventListener("change",on);
$("stb").addEventListener("input",e=>{if(["L","th","th2","q"].includes(e.target.dataset.k))on(e)});

$("stb").addEventListener("click",e=>{const i=e.target.dataset.del;if(i!==undefined){rows.splice(i,1);draw();sync()}});
$("stadd").onclick=()=>$("stp").click();
$("stp").onchange=async e=>{const m=$("stm");let bad=0;const fs=[...e.target.files];e.target.value="";
 for(const fl of fs){try{const ps=parse(await fl.text());if(!ps.length)bad++;
  const nm=fl.name.replace(/\.(step|stp)$/i,"");rows=rows.filter(r=>r.f!==nm);ps.forEach(p=>rows.push({...p,f:nm}))}catch(x){bad++}}
 draw();sync();
 m.textContent=rows.length?"STEP listesinde "+rows.length+" kalem var. Adetleri girin; kesim listesi otomatik güncellenir. Başka STEP dosyaları da ekleyebilirsiniz."+(bad?" "+bad+" dosya okunamadı.":""):"Dosyadan profil okunamadı. Parçayı katı model olarak STEP (AP203/AP214/AP242) biçiminde kaydedin."};
})();
