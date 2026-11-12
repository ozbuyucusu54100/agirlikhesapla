/* Üst menü: tek satır, yatay kaydırılabilir; sayfalar arası geçişte kaydırma konumu korunur, aktif öğe görünür kalır. */
(function(){var n=document.querySelector(".nv");if(!n)return;
 try{var x=sessionStorage.getItem("hahNavX");if(x!==null)n.scrollLeft=+x}catch(e){}
 var a=n.querySelector("[aria-current]");
 if(a){var r=a.getBoundingClientRect(),b=n.getBoundingClientRect();if(r.left<b.left+8||r.right>b.right-8)n.scrollLeft=a.offsetLeft-(n.clientWidth-a.offsetWidth)/2}
 var t;n.addEventListener("scroll",function(){clearTimeout(t);t=setTimeout(function(){try{sessionStorage.setItem("hahNavX",n.scrollLeft)}catch(e){}},60)},{passive:true});
 n.addEventListener("wheel",function(e){if(n.scrollWidth>n.clientWidth&&Math.abs(e.deltaY)>Math.abs(e.deltaX)){n.scrollLeft+=e.deltaY;e.preventDefault()}},{passive:false});
})();
