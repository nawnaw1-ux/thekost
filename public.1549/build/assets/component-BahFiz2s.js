import{r as s,f as B}from"./app-CiVsT29U.js";import{e as I,d as _}from"./tslib.es6-CuZy2iRz.js";function A(e){const n=s.useRef(e);return s.useEffect(()=>{n.current=e}),s.useMemo(()=>(...t)=>{var r;return(r=n.current)==null?void 0:r.call(n,...t)},[])}function fe({prop:e,defaultProp:n,onChange:t=()=>{}}){const[r,a]=z({defaultProp:n,onChange:t}),o=e!==void 0,u=o?e:r,i=A(t),p=s.useCallback(d=>{if(o){const c=typeof d=="function"?d(e):d;c!==e&&i(c)}else a(d)},[o,e,a,i]);return[u,p]}function z({defaultProp:e,onChange:n}){const t=s.useState(e),[r]=t,a=s.useRef(r),o=A(n);return s.useEffect(()=>{a.current!==r&&(o(r),a.current=r)},[r,a,o]),t}function de(e,n=globalThis==null?void 0:globalThis.document){const t=A(e);s.useEffect(()=>{const r=a=>{a.key==="Escape"&&t(a)};return n.addEventListener("keydown",r,{capture:!0}),()=>n.removeEventListener("keydown",r,{capture:!0})},[t,n])}var P=globalThis!=null&&globalThis.document?s.useLayoutEffect:()=>{},K=B.useId||(()=>{}),D=0;function le(e){const[n,t]=s.useState(K());return P(()=>{t(r=>r??String(D++))},[e]),n?`radix-${n}`:""}var O=function(e){if(typeof document>"u")return null;var n=Array.isArray(e)?e[0]:e;return n.ownerDocument.body},v=new WeakMap,m=new WeakMap,y={},b=0,L=function(e){return e&&(e.host||L(e.parentNode))},U=function(e,n){return n.map(function(t){if(e.contains(t))return t;var r=L(t);return r&&e.contains(r)?r:(console.error("aria-hidden",t,"in not contained inside",e,". Doing nothing"),null)}).filter(function(t){return!!t})},V=function(e,n,t,r){var a=U(n,Array.isArray(e)?e:[e]);y[t]||(y[t]=new WeakMap);var o=y[t],u=[],i=new Set,p=new Set(a),d=function(c){!c||i.has(c)||(i.add(c),d(c.parentNode))};a.forEach(d);var l=function(c){!c||p.has(c)||Array.prototype.forEach.call(c.children,function(f){if(i.has(f))l(f);else try{var g=f.getAttribute(r),k=g!==null&&g!=="false",x=(v.get(f)||0)+1,M=(o.get(f)||0)+1;v.set(f,x),o.set(f,M),u.push(f),x===1&&k&&m.set(f,!0),M===1&&f.setAttribute(t,"true"),k||f.setAttribute(r,"true")}catch(N){console.error("aria-hidden: cannot operate on ",f,N)}})};return l(n),i.clear(),b++,function(){u.forEach(function(c){var f=v.get(c)-1,g=o.get(c)-1;v.set(c,f),o.set(c,g),f||(m.has(c)||c.removeAttribute(r),m.delete(c)),g||c.removeAttribute(t)}),b--,b||(v=new WeakMap,v=new WeakMap,m=new WeakMap,y={})}},ve=function(e,n,t){t===void 0&&(t="data-aria-hidden");var r=Array.from(Array.isArray(e)?e:[e]),a=O(e);return a?(r.push.apply(r,Array.from(a.querySelectorAll("[aria-live]"))),V(r,a,t,"aria-hidden")):function(){return null}},S="right-scroll-bar-position",w="width-before-scroll-bar",j="with-scroll-bars-hidden",G="--removed-body-scroll-bar-size";function E(e,n){return typeof e=="function"?e(n):e&&(e.current=n),e}function Q(e,n){var t=s.useState(function(){return{value:e,callback:n,facade:{get current(){return t.value},set current(r){var a=t.value;a!==r&&(t.value=r,t.callback(r,a))}}}})[0];return t.callback=n,t.facade}var $=typeof window<"u"?s.useLayoutEffect:s.useEffect,R=new WeakMap;function he(e,n){var t=Q(null,function(r){return e.forEach(function(a){return E(a,r)})});return $(function(){var r=R.get(t);if(r){var a=new Set(r),o=new Set(e),u=t.current;a.forEach(function(i){o.has(i)||E(i,null)}),o.forEach(function(i){a.has(i)||E(i,u)})}R.set(t,e)},[e]),t}function q(e){return e}function F(e,n){n===void 0&&(n=q);var t=[],r=!1,a={read:function(){if(r)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return t.length?t[t.length-1]:e},useMedium:function(o){var u=n(o,r);return t.push(u),function(){t=t.filter(function(i){return i!==u})}},assignSyncMedium:function(o){for(r=!0;t.length;){var u=t;t=[],u.forEach(o)}t={push:function(i){return o(i)},filter:function(){return t}}},assignMedium:function(o){r=!0;var u=[];if(t.length){var i=t;t=[],i.forEach(o),u=t}var p=function(){var l=u;u=[],l.forEach(o)},d=function(){return Promise.resolve().then(p)};d(),t={push:function(l){u.push(l),d()},filter:function(l){return u=u.filter(l),t}}}};return a}function pe(e){e===void 0&&(e={});var n=F(null);return n.options=I({async:!0,ssr:!1},e),n}var T=function(e){var n=e.sideCar,t=_(e,["sideCar"]);if(!n)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var r=n.read();if(!r)throw new Error("Sidecar medium not found");return s.createElement(r,I({},t))};T.isSideCarExport=!0;function ge(e,n){return e.useMedium(n),T}var H=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function J(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var n=H();return n&&e.setAttribute("nonce",n),e}function X(e,n){e.styleSheet?e.styleSheet.cssText=n:e.appendChild(document.createTextNode(n))}function Y(e){var n=document.head||document.getElementsByTagName("head")[0];n.appendChild(e)}var Z=function(){var e=0,n=null;return{add:function(t){e==0&&(n=J())&&(X(n,t),Y(n)),e++},remove:function(){e--,!e&&n&&(n.parentNode&&n.parentNode.removeChild(n),n=null)}}},ee=function(){var e=Z();return function(n,t){s.useEffect(function(){return e.add(n),function(){e.remove()}},[n&&t])}},te=function(){var e=ee(),n=function(t){var r=t.styles,a=t.dynamic;return e(r,a),null};return n},ne={left:0,top:0,right:0,gap:0},C=function(e){return parseInt(e||"",10)||0},re=function(e){var n=window.getComputedStyle(document.body),t=n[e==="padding"?"paddingLeft":"marginLeft"],r=n[e==="padding"?"paddingTop":"marginTop"],a=n[e==="padding"?"paddingRight":"marginRight"];return[C(t),C(r),C(a)]},ae=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return ne;var n=re(e),t=document.documentElement.clientWidth,r=window.innerWidth;return{left:n[0],top:n[1],right:n[2],gap:Math.max(0,r-t+n[2]-n[0])}},oe=te(),h="data-scroll-locked",ie=function(e,n,t,r){var a=e.left,o=e.top,u=e.right,i=e.gap;return t===void 0&&(t="margin"),`
  .`.concat(j,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(i,"px ").concat(r,`;
  }
  body[`).concat(h,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([n&&"position: relative ".concat(r,";"),t==="margin"&&`
    padding-left: `.concat(a,`px;
    padding-top: `).concat(o,`px;
    padding-right: `).concat(u,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(i,"px ").concat(r,`;
    `),t==="padding"&&"padding-right: ".concat(i,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(S,` {
    right: `).concat(i,"px ").concat(r,`;
  }
  
  .`).concat(w,` {
    margin-right: `).concat(i,"px ").concat(r,`;
  }
  
  .`).concat(S," .").concat(S,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(w," .").concat(w,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat(h,`] {
    `).concat(G,": ").concat(i,`px;
  }
`)},W=function(){var e=parseInt(document.body.getAttribute(h)||"0",10);return isFinite(e)?e:0},ue=function(){s.useEffect(function(){return document.body.setAttribute(h,(W()+1).toString()),function(){var e=W()-1;e<=0?document.body.removeAttribute(h):document.body.setAttribute(h,e.toString())}},[])},me=function(e){var n=e.noRelative,t=e.noImportant,r=e.gapMode,a=r===void 0?"margin":r;ue();var o=s.useMemo(function(){return ae(a)},[a]);return s.createElement(oe,{styles:ie(o,!n,a,t?"":"!important")})};export{me as R,le as a,A as b,de as c,P as d,pe as e,he as f,w as g,ve as h,ge as i,te as s,fe as u,S as z};
