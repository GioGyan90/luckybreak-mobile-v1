import{a5 as mt,aP as gt,ak as wt,a7 as xt,a3 as Oe,a4 as Pe,G as ae,b as te,B as Y,c as it,F as we,p as Fe,_ as yt,at as vt,I as St,g as re,m as ze,l as Mt,a2 as bt,h as zt,E as _t,a_ as st,e as at,V,af as Et,a$ as At,b0 as Te,aF as se,b1 as Bt,f as Ie,a1 as ot,W as Ut,b2 as me,Y as rt,a as ct,Z as ge,b3 as xe,b4 as Dt,o as Lt,z as Tt,y as Ct}from"./proceduralGeometry-Ba5gc5BF.js";import{w as F}from"./scene-CMJ-9Asq.js";import{w as Rt,t as de}from"./materials-C0IFmB6n.js";const ye=1.06,en=-200,tn=202,nn=Rt,sn=12,Wt=[];function ke(s,e){const n=new Uint8Array(s*s*4);for(let t=3;t<n.length;t+=4)n[t]=255;for(const t of e)if(t.lit)for(let a=Math.max(0,Math.ceil(t.y-.5));a<Math.min(s,Math.ceil(t.y+t.height-.5));a++)for(let l=Math.max(0,Math.ceil(t.x-.5));l<Math.min(s,Math.ceil(t.x+t.width-.5));l++){const r=(a*s+l)*4;n[r]=n[r+1]=n[r+2]=255}const i=new mt(n,s,s,gt);return i.name="window-only-emission",i.flipY=!0,i.minFilter=wt,i.magFilter=xt,i.generateMipmaps=!0,i.anisotropy=4,i.needsUpdate=!0,i}function Gt(s,e,n,i,t,a){const l=[],r=t?2.83:3,c=i==="long"?4:t?3:2;for(let f=0;f<6;f++){const d=f*r+.72,o=t?1.55:1.65;if(!(d<n+.15||d+o>n+e-.12))for(let p=0;p<c;p++){const g=s/(c+1),m=i==="end"&&!t?(p===0?-1:1)*s*.34:-s/2+g*(p+1),h=Math.min(g*(i==="long"?.72:.58),i==="long"?2.05:1.25);a&&f===0&&Math.abs(m)<1.2+h/2||l.push({x:m,y:d,w:h,h:o,lit:(f*3+p+(t?1:0))%4===0})}}return l}const $e=new Map;function Ot(s,e,n,i,t,a,l){const r=[s,e,n,i,t,a,l].join("|"),c=$e.get(r);if(c)return c;const f=256,d=document.createElement("canvas");d.width=d.height=f;const o=d.getContext("2d");o.fillStyle=l,o.fillRect(0,0,f,f);const p=Gt(s,e,n,i,t,a),g=[];for(const h of p){const w=(h.x-h.w/2+s/2)/s*f,x=(1-(h.y+h.h-n)/e)*f,u=h.w/s*f,S=h.h/e*f;o.fillStyle="#d6c7a8",o.fillRect(w-2,x-2,u+4,S+4),o.fillStyle="#4389ab",o.fillRect(w,x,u,S),o.fillStyle="#e7ddc7",o.fillRect(w+u/2-1,x,2,S),o.fillRect(w,x+S*.36,u,2),o.fillStyle="#f5e8ce",o.fillRect(w-3,x+S+2,u+6,3);for(const[y,W]of[[1,u/2-2],[u/2+1,u/2-2]])for(const[K,O]of[[1,S*.36-1],[S*.36+2,S*.64-3]])g.push({x:w+y,y:x+K,width:W,height:O,lit:h.lit})}const m=new Oe(d);return m.colorSpace=Pe,m.anisotropy=4,m.userData.windowEmission=ke(f,g),m.userData.campusWindows=p,$e.set(r,m),m}function Pt(s,e,n,i){const t=[],l=112/n,r=112/e;for(let c=0;c<e;c++)for(let f=0;f<n;f++){const d=c===e-1;let o=.61,p=.58;if(s==="warehouse"){if(!d&&c!==0)continue;o=.52,p=.3}else s==="glass"?(o=f%4===0?.62:f%4===1?.9:.76,p=c%5===0?.56:.73):s==="arcade"?(o=d?.83:.56,p=d?.72:.57):s==="apartment"?(o=.58,p=.69):s==="villa"||s==="pitched"?(o=.49,p=.57):(s==="artdeco"||s==="stepped")&&(o=.48,p=.68);const g=l*o,m=r*p,h=8+f*l+(l-g)/2,w=8+c*r+(r-m)/2;i&&d&&h<80&&h+g>48||t.push({x:h,y:w,w:g,h:m,lit:(c*7+f*11+e+n)%5===0})}return t}const je=new Map;function _e(s,e,n,i,t,a){const l=[s,e,n,i,t,a].join("|"),r=je.get(l);if(r)return r;const c=128,f=document.createElement("canvas");f.width=f.height=c;const d=f.getContext("2d");d.fillStyle=s,d.fillRect(0,0,c,c);const o=Pt(t,n,i,a),p=[];for(const m of o){const{x:h,y:w,w:x,h:u}=m;d.fillStyle=t==="glass"?"#b7d8da":"#d4c6ae",d.fillRect(h-1,w-1,x+2,u+2),d.fillStyle=e,d.fillRect(h,w,x,u);const S=t==="glass"?"#b5dce0":"#ece2cc";d.fillStyle=S,x>7&&d.fillRect(h+x*.5-.55,w,1.1,u),u>9&&t!=="warehouse"&&d.fillRect(h,w+u*.4,x,1);const y=(t==="apartment"||t==="villa"||t==="pitched")&&x>5&&u>5&&Math.floor(h+w)%3===0?x*.17:0;y&&(d.fillStyle="#efdbb8",d.fillRect(h+1,w+1,y,Math.max(0,u-2))),t!=="glass"&&(d.fillStyle="#f2e4cd",d.fillRect(h-1,w+u+1,x+2,1.5)),(t==="villa"||t==="pitched")&&x>5&&(d.fillStyle="#728c80",d.fillRect(h-2,w,1,u),d.fillRect(h+x+1,w,1,u));const W=x>7?[[1,x*.5-1.6],[x*.5+.55,x*.5-1.55]]:[[1,x-2]],K=u>9&&t!=="warehouse"?[[1,u*.4-1],[u*.4+1,u*.6-2]]:[[1,u-2]];for(const[O,G]of W)for(const[D,P]of K){const _=Math.max(O,y?y+1:O),$=O+G;$>_&&P>0&&p.push({x:h+_,y:w+D,width:$-_,height:P,lit:m.lit})}}const g=new Oe(f);return g.colorSpace=Pe,g.anisotropy=4,g.userData.windowEmission=ke(c,p),g.userData.facadeType=t,g.userData.facadeWindows=o,je.set(l,g),g}function qe(s,e,n,i,t={x:0,z:e+20}){const a=i?.map(o=>({x0:o.x0*s,x1:o.x1*s,z0:o.z0*e,z1:o.z1*e,h:o.height*n}))??[{x0:-s/2,x1:s/2,z0:-e/2,z1:e/2,h:n}],l=[...new Set(a.flatMap(o=>[o.x0,o.x1]))].sort((o,p)=>o-p),r=[...new Set(a.flatMap(o=>[o.z0,o.z1]))].sort((o,p)=>o-p),c=(o,p)=>a.filter(g=>o>g.x0&&o<g.x1&&p>g.z0&&p<g.z1),f=[];for(const o of a)for(const[p,g,m,h,w,x]of[["x",o.x0,o.z0,o.z1,-1,0],["x",o.x1,o.z0,o.z1,1,0],["z",o.z0,o.x0,o.x1,0,-1],["z",o.z1,o.x0,o.x1,0,1]]){const u=(p==="x"?r:l).filter(y=>y>=m&&y<=h);let S=null;for(let y=0;y<u.length-1;y++){const W=(u[y]+u[y+1])/2,K=p==="x"?g:W,O=p==="x"?W:g,G=!c(K+w*.01,O+x*.01).length;if(G&&S===null&&(S=u[y]),S!==null&&(!G||y===u.length-2)){const D=G?u[y+1]:u[y],P=D-S,_=(S+D)/2;P>1.35&&o.h>2.7&&f.push({x:p==="x"?g:_,z:p==="x"?_:g,nx:w,nz:x,length:P,ceiling:o.h}),S=null}}}const d=o=>{const p=t.x-o.x,g=t.z-o.z;return Math.hypot(p,g)+(p*o.nx+g*o.nz<0?50:0)-Math.min(o.length,6)*.35};return f.sort((o,p)=>d(o)-d(p))[0]??{x:0,z:e/2,nx:0,nz:1,length:s,ceiling:n}}const Ee=new Map,Ft=s=>(Ee.has(s)||Ee.set(s,de(s)),Ee.get(s));function It(s,e,n=!1,i="house",t=0,a=!0){const l=new ae;l.name="building-entrance",l.position.set(e.x+e.nx*.05,t,e.z+e.nz*.05),l.rotation.y=Math.atan2(e.nx,e.nz),s.add(l);const r=Math.min(n?3.5:2.6,e.ceiling-.55),c=Math.min(n?3.5:i==="warehouse"?3.1:1.65,e.length*.72),f=(g,m,h,w,x,u,S)=>{const y=new te(new Y(g,m,h),Ft(S));return y.position.set(w,x,u),y.castShadow=y.receiveShadow=!0,l.add(y),y};f(c+.45,r+.36,.22,0,r/2+.18,.06,14206106);const d=i==="house"?8021578:2648969;f(c,r,.1,0,r/2+.18,.19,d);const o=n||i==="shop"?2:1;for(let g=0;g<o;g++){const m=(g-(o-1)/2)*c/o;if(i==="warehouse")for(let h=.5;h<r;h+=.32)f(c-.12,.045,.04,0,h,.26,11057337);else f(c/o-.13,r*.53,.05,m,r*.67,.255,i==="house"?7645111:5678271),f(.07,.5,.08,m+(o===2?(g===0?1:-1)*c*.16:c*.31),r*.47,.31,14267499)}o===2&&f(.1,r,.11,0,r/2+.18,.28,14337692),f(c+.65,.18,.8,0,.09,.45,14996919),f(c+.85,.1,.35,0,.05,.98,15852226);const p=n?1.8:1.1;if(a&&(f(c+.9,.17,p,0,r+.45,p/2,i==="house"?12154958:2979992),f(c+.95,.09,.12,0,r+.39,p-.04,15124364)),n&&a)for(const g of[-1,1])f(.11,r+.28,.11,g*(c/2+.3),(r+.28)/2,p-.14,5404546);for(const g of[-1,1])f(.17,.32,.17,g*(c/2+.24),r*.68,.29,4680061),f(.1,.18,.04,g*(c/2+.24),r*.68,.39,16768928);return l.userData.entrance={kind:i,width:c,height:r},l}function kt(s,e){const n=r=>{const c=Math.sin(e*.173+r*12.9898)*43758.5453;return c-Math.floor(c)},i=[],t=(r,c,f,d,o,p="wing")=>i.push({x0:r,x1:c,z0:f,z1:d,height:o,role:p}),a=-.28+.1*n(1),l=.5-.22-.09*n(2);if(s==="E"){t(-.5,a,-.5,.5,1,"main"),t(a,.29+.21*n(3),-.5,-.5+.19+.09*n(4),.64+.12*n(5));const r=-.05+.1*n(6),c=.075+.035*n(7);t(a,.12+.24*n(8),r-c,r+c,.4+.12*n(9)),t(a,.28+.2*n(10),.18+.1*n(11),.5,.77+.13*n(12))}else if(s==="T"){const r=-.09+.16*n(3),c=.12+.045*n(4),f=-.16-.1*n(5);t(r-c,r+c,-.5,.5,1,"main"),t(-.5,r-c,-.5,f,.48+.12*n(6)),t(r+c,.34+.16*n(7),-.5,f+.04,.7+.12*n(8))}else if(s==="H"){t(-.5,a,-.5,.5,1,"main"),t(l,.5,-.5+.15*n(3),.5-.12*n(4),.66+.17*n(5));const r=-.05+.12*n(6),c=.09+.04*n(7);t(a,l,r-c,r+c,.35+.16*n(8),"link")}else if(s==="L")t(-.5,a,-.5,.5,1,"main"),t(a,.3+.2*n(3),.16+.13*n(4),.5,.5+.21*n(5));else{const r=.17+.12*n(3);t(-.5,a,-.5,.5,1,"main"),t(l,.5,-.4+.1*n(4),.5,.62+.16*n(5)),t(a,l,r,.5,.37+.16*n(6),"link")}if(n(17)>.5)for(const r of i){const c=-r.x1;r.x1=-r.x0,r.x0=c}if(n(18)>.5)for(const r of i){const c=-r.z1;r.z1=-r.z0,r.z0=c}return i}function Ht(s,e,n,i){const t=[...new Set(s.flatMap(m=>[m.x0*e,m.x1*e]))].sort((m,h)=>m-h),a=[...new Set(s.flatMap(m=>[m.z0*n,m.z1*n]))].sort((m,h)=>m-h),l=t.slice(1).map((m,h)=>a.slice(1).map((w,x)=>{const u=(t[h]+t[h+1])/(2*e),S=(a[x]+a[x+1])/(2*n);return Math.max(0,...s.filter(y=>u>y.x0&&u<y.x1&&S>y.z0&&S<y.z1).map(y=>y.height*i))})),r=[],c=[],f=[],d=[],o=[],p=(m,h,w,x=!1)=>{for(const u of[0,1,2,0,2,3])m.push(...w[u]),h.push(x?w[u][0]/e+.5:Math.abs(w[0][0]-w[1][0])<1e-5&&Math.abs(w[0][0]-w[2][0])<1e-5?w[u][2]/n+.5:w[u][0]/e+.5,x?w[u][2]/n+.5:w[u][1]/i)};for(let m=0;m<t.length-1;m++)for(let h=0;h<a.length-1;h++){const w=l[m][h];if(!w)continue;const x=t[m],u=t[m+1],S=a[h],y=a[h+1];p(f,d,[[x,w,S],[x,w,y],[u,w,y],[u,w,S]],!0);for(const[W,K,O,G]of[[m-1,h,[x,y],[x,S]],[m+1,h,[u,S],[u,y]],[m,h-1,[x,S],[u,S]],[m,h+1,[u,y],[x,y]]]){const D=l[W]?.[K]??0;D>=w-1e-4||(p(r,c,[[O[0],D,O[1]],[O[0],w,O[1]],[G[0],w,G[1]],[G[0],D,G[1]]]),o.push({a:O,b:G,height:w}))}}const g=new it;return g.setAttribute("position",new we([...r,...f],3)),g.setAttribute("uv",new we([...c,...d],2)),g.addGroup(0,r.length/3,0),g.addGroup(r.length/3,f.length/3,1),g.computeVertexNormals(),{geometry:g,rims:o}}let Ae=20261021;function lt(){return Ae=Ae*1664525+1013904223>>>0,Ae/4294967296}const an=(s,e)=>s+lt()*(e-s),fe=(s,e,n)=>Math.max(e,Math.min(n,s)),on=Math.PI*2,le=[];function Ce(s,e,n,i,t=0){const a=new st(s,25),l=new at().compose(new V(e,n,i),new Et().setFromAxisAngle(new V(0,1,0),t),new V(1,1,1));a.applyMatrix4(l),le.push(a)}function Nt(){if(!le.length)return;const s=Fe(le,!1),e=new yt(s,new vt({color:2827320,transparent:!0,opacity:.76}));e.name="city-building-outlines",F.add(e),le.forEach(n=>n.dispose()),le.length=0}const Be=new Map,Ze=new Map;function Ye(s,e,n,i,t){t=Math.round(t*4)/4;const a=`${s}|${e}|${n}|${i}|${t}`;if(Be.has(a))return Be.get(a);const l=128,r=document.createElement("canvas");r.width=r.height=l;const c=r.getContext("2d");c.fillStyle=s,c.fillRect(0,0,l,l);const f=c.createLinearGradient(0,0,0,l);f.addColorStop(0,"rgba(255,255,255,0.22)"),f.addColorStop(.55,"rgba(255,255,255,0)"),f.addColorStop(1,"rgba(31,79,112,0.04)"),c.fillStyle=f,c.fillRect(0,0,l,l);const d=10,o=(l-d*2)/i,p=(l-d*2)/n,g=[];for(let h=0;h<n;h++)for(let w=0;w<i;w++){const x=d+w*o,u=d+h*p,S=o*(n>=9?.13:.19),y=p*(n>=9?.16:.21),W=lt()<t;c.fillStyle=W?"#ffe9a6":e,g.push({x:x+S+.4,y:u+y+.4,width:o-S*2-.8,height:p-y*2-.8,lit:W}),c.fillRect(x+S,u+y,o-S*2,p-y*2),c.strokeStyle="rgba(39,91,120,0.55)",c.lineWidth=.8,c.strokeRect(x+S,u+y,o-S*2,p-y*2)}c.strokeStyle="#dedcd0",c.lineWidth=2.6,c.strokeRect(1.5,1.5,l-3,l-3);const m=new Oe(r);return m.colorSpace=Pe,m.anisotropy=4,m.userData.windowEmission=ke(l,g),Be.set(a,m),m}function ce(s){let e=Ze.get(s.uuid);return e||(e=de(16777215,{map:s,emissiveMap:s.userData.windowEmission}),e.userData.lightingRole="window-facade",Ze.set(s.uuid,e)),e}const X={count:0,plans:{},samples:[],styles:{},batches:0,originalDrawCalls:0,entrances:[]},Re=[],Xe=new Map,Ue=new Map;function k(s){return Ue.has(s)||Ue.set(s,de(s)),Ue.get(s)}function We(s,e,n){if(s.index){const t=s.clone();return t.clearGroups(),t.setIndex(Array.from(s.index.array.slice(e,e+n))),t}const i=new it;for(const[t,a]of Object.entries(s.attributes)){const l=a.array.slice(e*a.itemSize,(e+n)*a.itemSize);i.setAttribute(t,new bt(l,a.itemSize,a.normalized))}return i}function rn(s){const{x:e,z:n,w:i=8,d:t=8,h:a=10,ry:l=0,base:r="#f3ebdd",win:c="#2183b3",roof:f=2522276,lit:d=.25,style:o="flat",plan:p="rect",detail:g=!0,elevation:m=ye}=s;X.count++,X.plans[p]=(X.plans[p]||0)+1,X.styles[o]=(X.styles[o]||0)+1,Wt.push({x:e,z:n,w:Math.abs(i*Math.cos(l))+Math.abs(t*Math.sin(l)),d:Math.abs(t*Math.cos(l))+Math.abs(i*Math.sin(l))});const h=new ae;h.name=`building-${o}`,h.position.set(e,m,n),h.rotation.y=l,F.add(h),Re.push(h);const w=new ae;w.name="building-roof",w.userData.style=o,h.add(w);const x=k(f),u=k(16050382),S=k(3770282),y=fe(Math.round(a/3),2,22),W=fe(Math.round(i/2.5),2,8),K=ce(Ye(r,c,y,W,d)),O=s.frontage?{x:(s.frontage[0]-e)*Math.cos(l)-(s.frontage[1]-n)*Math.sin(l),z:(s.frontage[0]-e)*Math.sin(l)+(s.frontage[1]-n)*Math.cos(l)}:void 0,G=qe(i,t,a,void 0,O),D=s.campusFacade?K:ce(_e(r,c,y,W,o,!1)),P=(M,v,b,E,A)=>{const B=new te(M,v);return B.position.set(b,E,A),B.castShadow=B.receiveShadow=!0,h.add(B),B},_=(M,v,b,E,A=D,B=0,z=0)=>{let U=A;if(A===D){const L=fe(Math.round(v/3),2,22),I=E-v/2<.05,j=(N,ee)=>s.campusFacade?D:ce(_e(r,c,L,fe(Math.round(N/(o==="glass"?1.55:2.5)),2,o==="glass"?12:8),o,ee&&I));if(U=[j(b,G.nx===1),j(b,G.nx===-1),x,u,j(M,G.nz===1),j(M,G.nz===-1)],s.campusFacade){const N=s.campusFacade==="tower",ee=E-v/2,ie=(Se,Me,be)=>ce(Ot(Se,v,ee,Me,N,be,r));U=[ie(b,"long",!1),ie(b,"long",!1),x,u,ie(M,"end",!0),ie(M,"end",!1)]}}return P(new Y(M,v,b),U,B,E,z)},$=(M,v,b,E,A)=>{const B=P(M,v,b,E,A);return w.add(B),B},H=(M,v,b,E,A=x,B=0,z=0)=>$(new Y(M,v,b),A,B,E,z),oe=(M,v,b,E=0,A=0,B=!0)=>{H(M+.15,.18,v+.15,b+.09,x,E,A);for(const z of[-1,1])H(M+.3,.42,.16,b+.38,u,E,A+z*v/2),H(.16,.42,v,.38+b,u,E+z*M/2,A);if(B&&Math.min(M,v)>5){H(M*.23,1.1,v*.22,b+.73,u,E-M*.18,A-v*.15),H(M*.26,.16,v*.25,b+1.36,x,E-M*.18,A-v*.15),H(.4,.7,.04,b+.55,k(6717312),E-M*.18,A-v*.04+.025);const z=H(.8,.55,.9,b+.46,k(13752269),E+M*.22,A-v*.18);z.name="roof-ventilation-unit";const U=$(new re(.25,.25,.045,12),k(7044989),E+M*.22,b+.76,A-v*.18);U.name="roof-ventilation-fan"}};if(p!=="rect"){const M=kt(p,e*37.1+n*19.7);X.samples.push({plan:p,x:e,z:n,w:i,d:t,h:a,wings:M}),h.userData.massing=M;const{geometry:v,rims:b}=Ht(M,i,t,a);o==="glass"&&Ye("#598ea5","#254f6c",y,W,d);const E=o==="glass"?ce(_e("#598ea5","#254f6c",y,W,o,!1)):D,A=v.groups[0],B=v.groups[1];P(We(v,A.start,A.count),E,0,0,0),$(We(v,B.start,B.count),x,0,0,0),v.dispose();for(const{a:z,b:U,height:L}of b){const I=H(Math.hypot(U[0]-z[0],U[1]-z[1])+.08,.28,.17,L+.14,u,(z[0]+U[0])/2,(z[1]+U[1])/2);I.rotation.y=-Math.atan2(U[1]-z[1],U[0]-z[0])}for(const z of M){const U=(z.x0+z.x1)*i/2,L=(z.z0+z.z1)*t/2,I=(z.x1-z.x0)*i,j=(z.z1-z.z0)*t,N=z.height*a;if(z.role==="link"){H(I*.7,.15,j*.52,N+.12,k(12100485),U,L);for(const ee of[-1,1])_(.55,.5,.55,N+.4,u,U+ee*I*.27,L),P(new St(.43,1),k(5669475),U+ee*I*.27,N+.9,L)}else z.role==="main"&&Math.min(I,j)>2.4&&(H(I*.42,.8,Math.min(j*.3,2.5),N+.4,u,U,L),H(I*.46,.14,Math.min(j*.34,2.8),N+.88,x,U,L),$(new re(.28,.28,.08,12),k(7044989),U,N+.99,L))}}else if(o==="round"){P(new re(i*.48,i*.48,a,16),S,0,a/2,0);for(let M=3;M<a;M+=5)P(new re(i*.5,i*.5,.45,16),u,0,M,0);$(new ze(i*.5,5,16),x,0,a+2.5,0),_(i*1.2,3,t*1.2,1.5,u)}else if(o==="stepped"||o==="artdeco"){_(i,a*.52,t,a*.26),_(i*.78,a*.3,t*.78,a*.67),_(i*.53,a*.18,t*.53,a*.91);for(const[M,v]of[[1,a*.52],[.78,a*.82],[.53,a]])oe(i*M,t*M,v,0,0,M===.53&&o!=="artdeco");if(o==="artdeco"){for(const M of[-i*.35,i*.35])_(.55,a*.5,.6,a*.26,u,M,t*.5+.2);s.omitArtdecoCrown||($(new Mt(i*.27,12,8,0,Math.PI*2,0,Math.PI/2),x,0,a,0),$(new re(.12,.23,7,6),k(15253081),0,a+i*.27+3.5,0))}}else{const M=o==="glass";if(M){const v=new ae;v.name="glass-office-l-shaped-massing",h.add(v);const b=i*.68,E=t*.68,A=i*.16,B=t*.16,z=_(b,a,E,a/2,D,A,B);z.name="glass-office-core";const U=(Math.sin(e*12.41+n*5.73)+1)/2,L=a*(.65+U*.1),I=a*(.41+U*.1),j=_(i*.32,L,t,L/2,D,-i*.34,0);j.name="glass-office-side-wing";const N=_(i*.68,I,t*.32,I/2,D,i*.16,-t*.34);N.name="glass-office-rear-wing",v.add(z,j,N);for(const[Se,Me,be,ht,pt]of[[b,E,a,A,B],[i*.32,t,L,-i*.34,0],[i*.68,t*.32,I,i*.16,-t*.34]])oe(Se,Me,be,ht,pt,!1);const ee=_(.25,L,.25,L/2,u,-i*.48,t*.48);ee.name="glass-wing-corner-pier",v.add(ee);const ie=H(i*.2,.15,t*.36,L+.2,k(5669475),-i*.34,0);ie.name="glass-wing-roof-garden",Ce(new Y(b,a,E),e+A*Math.cos(l)+B*Math.sin(l),m+a/2,n-A*Math.sin(l)+B*Math.cos(l),l)}else _(i,a,t,a/2,D),Ce(new Y(i,a,t),e,m+a/2,n,l);if(!M)if(o==="pitched"||o==="villa"||o==="warehouse"){const v=Math.min(i,t)*(o==="warehouse"?.28:.48),b=$(new ze(.7072,1,4),x,0,a+v/2,0);if(b.scale.set(i*1.1,v,t*1.1),b.rotation.y=Math.PI/4,o==="villa"){_(i*.38,a*.6,t*.3,a*.3,u,i*.53,t*.2);const E=$(new ze(i*.27,3.2,4),x,i*.53,a*.6+1.6,t*.2);E.rotation.y=Math.PI/4,_(i*.52,.4,2.4,a*.45,u,0,t*.5+1)}}else if(o==="apartment"){for(let v=3;v<a;v+=3.5)_(i*.86,.28,1.1,v,u,0,t/2+.4),_(i*.86,.65,.12,v+.4,S,0,t/2+.9);oe(i,t,a)}else if(o==="arcade")if(oe(i,t,a),s.campusFacade==="wing"){H(3.4,.18,1.25,3.18,x,0,t/2+.58);for(const b of[-1.53,1.53])_(.18,3.12,.18,1.56,u,b,t/2+1.04);const v=P(new Y(.52,.78,.1),k(3763578),1.2,1.95,t/2+.07);v.name="campus-noticeboard";for(const b of[1.77,1.94,2.11])P(new Y(.34,.07,.025),u,1.2,b,t/2+.14)}else{_(i+1,.5,t+.6,a*.64,u);for(const b of[-i*.37,i*.37])_(.55,a*.32,.65,a*.16,u,b,t/2+.5);const v=P(new Y(i*.9,.35,2.3),k(f),0,a*.35,t/2+.9);v.rotation.x=.15,_(i*.7,.9,.2,a*.48,k(15253081),0,t/2+.13)}else oe(i,t,a,0,0,g)}const ut=s.frontage?{x:(s.frontage[0]-e)*Math.cos(l)-(s.frontage[1]-n)*Math.sin(l),z:(s.frontage[0]-e)*Math.sin(l)+(s.frontage[1]-n)*Math.cos(l)}:void 0,He=a>25,Ne=o==="warehouse"?"warehouse":He?"office":o==="arcade"?"shop":"house",Q=qe(o==="round"?i*1.2:i,o==="round"?t*1.2:t,o==="round"?3:a,h.userData.massing,ut);o==="arcade"&&(Q.ceiling=Math.min(Q.ceiling,a*.35+.3)),It(h,Q,He,Ne,0,o!=="arcade"),h.userData.entranceWall=Q,X.entrances.push({x:e+Q.x*Math.cos(l)+Q.z*Math.sin(l),z:n-Q.x*Math.sin(l)+Q.z*Math.cos(l),kind:Ne,height:Q.ceiling});const Ve=o+"-"+p;if(!Xe.has(Ve)){const M=h.clone(!0);M.position.set(0,0,0),Xe.set(Ve,M)}return h}function cn(){const s=new Map;for(const e of Re)e.parent===F&&(e.updateMatrixWorld(!0),e.traverse(n=>{if(!(n instanceof te))return;const i=Array.isArray(n.material)?n.material:[n.material],t=Array.isArray(n.material)?n.geometry.groups:[{start:0,count:n.geometry.index?.count??n.geometry.attributes.position.count,materialIndex:0}];for(const a of t){const l=i[a.materialIndex||0],r=We(n.geometry,a.start,a.count);let c=r.index?r.toNonIndexed():r;c!==r&&r.dispose(),c.applyMatrix4(n.matrixWorld),s.has(l)||s.set(l,[]),s.get(l).push(c),X.originalDrawCalls++}n.geometry.dispose()}),F.remove(e));for(const[e,n]of s){const i=Fe(n,!1);if(n.forEach(a=>a.dispose()),!i)throw new Error("Unable to batch city building geometry");const t=new te(i,e);t.name="city-building-batch",t.castShadow=t.receiveShadow=!0,F.add(t)}X.batches=s.size,F.userData.buildings=X,Re.length=0}function ln(s,e,n,i,t,a,l,r={}){const c=new Y(s,e,n),f=new te(c,de(i));return f.position.set(t,a,l),r.ry&&(f.rotation.y=r.ry),f.castShadow=r.cast!==!1,f.receiveShadow=!0,F.add(f),r.outline!==!1&&Ce(c,t,a,l,r.ry||0),f}function dn(s,e,n,i,t,a,l,r=0){const c=new zt;c.moveTo(-s/2,0),c.lineTo(s/2,0),c.lineTo(0,e),c.closePath();const f=new _t(c,{depth:n,bevelEnabled:!1});f.translate(0,0,-n/2);const d=new te(f,de(i));return d.position.set(t,a,l),d.rotation.y=r,d.castShadow=!0,d.receiveShadow=!0,F.add(d),d}const Je=new Ie,ue=new V;class dt extends At{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],n=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new we(e,3)),this.setAttribute("uv",new we(n,2))}applyMatrix4(e){const n=this.attributes.instanceStart,i=this.attributes.instanceEnd;return n!==void 0&&(n.applyMatrix4(e),i.applyMatrix4(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const i=new Te(n,6,1);return this.setAttribute("instanceStart",new se(i,3,0)),this.setAttribute("instanceEnd",new se(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const i=new Te(n,6,1);return this.setAttribute("instanceColorStart",new se(i,3,0)),this.setAttribute("instanceColorEnd",new se(i,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Bt(e.geometry)),this}fromLineSegments(e){const n=e.geometry;return this.setPositions(n.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ie);const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;e!==void 0&&n!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Je.setFromBufferAttribute(n),this.boundingBox.union(Je))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ot),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;if(e!==void 0&&n!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let t=0;for(let a=0,l=e.count;a<l;a++)ue.fromBufferAttribute(e,a),t=Math.max(t,i.distanceToSquared(ue)),ue.fromBufferAttribute(n,a),t=Math.max(t,i.distanceToSquared(ue));this.boundingSphere.radius=Math.sqrt(t),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}ge.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ct(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};me.line={uniforms:rt.merge([ge.common,ge.fog,ge.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class ft extends Ut{constructor(e){super({type:"LineMaterial",uniforms:rt.clone(me.line.uniforms),vertexShader:me.line.vertexShader,fragmentShader:me.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1))}}const Ke=new V,Qe=new V,T=new xe,C=new xe,q=new xe,De=new V,Le=new at,R=new Dt,et=new V,he=new Ie,pe=new ot,Z=new xe;let J,ne;function tt(s,e,n){return Z.set(0,0,-e,1).applyMatrix4(s.projectionMatrix),Z.multiplyScalar(1/Z.w),Z.x=ne/n.width,Z.y=ne/n.height,Z.applyMatrix4(s.projectionMatrixInverse),Z.multiplyScalar(1/Z.w),Math.abs(Math.max(Z.x,Z.y))}function Vt(s,e){const n=s.matrixWorld,i=s.geometry,t=i.attributes.instanceStart,a=i.attributes.instanceEnd,l=Math.min(i.instanceCount,t.count);for(let r=0,c=l;r<c;r++){R.start.fromBufferAttribute(t,r),R.end.fromBufferAttribute(a,r),R.applyMatrix4(n);const f=new V,d=new V;J.distanceSqToSegment(R.start,R.end,d,f),d.distanceTo(f)<ne*.5&&e.push({point:d,pointOnLine:f,distance:J.origin.distanceTo(d),object:s,face:null,faceIndex:r,uv:null,uv1:null})}}function $t(s,e,n){const i=e.projectionMatrix,a=s.material.resolution,l=s.matrixWorld,r=s.geometry,c=r.attributes.instanceStart,f=r.attributes.instanceEnd,d=Math.min(r.instanceCount,c.count),o=-e.near;J.at(1,q),q.w=1,q.applyMatrix4(e.matrixWorldInverse),q.applyMatrix4(i),q.multiplyScalar(1/q.w),q.x*=a.x/2,q.y*=a.y/2,q.z=0,De.copy(q),Le.multiplyMatrices(e.matrixWorldInverse,l);for(let p=0,g=d;p<g;p++){if(T.fromBufferAttribute(c,p),C.fromBufferAttribute(f,p),T.w=1,C.w=1,T.applyMatrix4(Le),C.applyMatrix4(Le),T.z>o&&C.z>o)continue;if(T.z>o){const S=T.z-C.z,y=(T.z-o)/S;T.lerp(C,y)}else if(C.z>o){const S=C.z-T.z,y=(C.z-o)/S;C.lerp(T,y)}T.applyMatrix4(i),C.applyMatrix4(i),T.multiplyScalar(1/T.w),C.multiplyScalar(1/C.w),T.x*=a.x/2,T.y*=a.y/2,C.x*=a.x/2,C.y*=a.y/2,R.start.copy(T),R.start.z=0,R.end.copy(C),R.end.z=0;const h=R.closestPointToPointParameter(De,!0);R.at(h,et);const w=Lt.lerp(T.z,C.z,h),x=w>=-1&&w<=1,u=De.distanceTo(et)<ne*.5;if(x&&u){R.start.fromBufferAttribute(c,p),R.end.fromBufferAttribute(f,p),R.start.applyMatrix4(l),R.end.applyMatrix4(l);const S=new V,y=new V;J.distanceSqToSegment(R.start,R.end,y,S),n.push({point:y,pointOnLine:S,distance:J.origin.distanceTo(y),object:s,face:null,faceIndex:p,uv:null,uv1:null})}}}class jt extends te{constructor(e=new dt,n=new ft({color:Math.random()*16777215})){super(e,n),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,n=e.attributes.instanceStart,i=e.attributes.instanceEnd,t=new Float32Array(2*n.count);for(let l=0,r=0,c=n.count;l<c;l++,r+=2)Ke.fromBufferAttribute(n,l),Qe.fromBufferAttribute(i,l),t[r]=r===0?0:t[r-1],t[r+1]=t[r]+Ke.distanceTo(Qe);const a=new Te(t,2,1);return e.setAttribute("instanceDistanceStart",new se(a,1,0)),e.setAttribute("instanceDistanceEnd",new se(a,1,1)),this}raycast(e,n){const i=this.material.worldUnits,t=e.camera;t===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const a=e.params.Line2!==void 0&&e.params.Line2.threshold||0;J=e.ray;const l=this.matrixWorld,r=this.geometry,c=this.material;ne=c.linewidth+a,r.boundingSphere===null&&r.computeBoundingSphere(),pe.copy(r.boundingSphere).applyMatrix4(l);let f;if(i)f=ne*.5;else{const o=Math.max(t.near,pe.distanceToPoint(J.origin));f=tt(t,o,c.resolution)}if(pe.radius+=f,J.intersectsSphere(pe)===!1)return;r.boundingBox===null&&r.computeBoundingBox(),he.copy(r.boundingBox).applyMatrix4(l);let d;if(i)d=ne*.5;else{const o=Math.max(t.near,he.distanceToPoint(J.origin));d=tt(t,o,c.resolution)}he.expandByScalar(d),J.intersectsBox(he)!==!1&&(i?Vt(this,n):$t(this,t,n))}}const Ge=[],qt=[],ve=new ae;ve.name="ordinary-buildings";ve.position.y=ye;F.add(ve);const Zt=new Tt({visible:!1});function nt(s,e){s.updateWorldMatrix(!0,!0);const n=s.matrixWorld.clone().invert(),i=[];s.traverse(d=>{if(!(d instanceof te)||d instanceof Ct||!d.visible||Array.isArray(d.material)||!d.material.visible||d.material.transparent)return;const o=d.geometry;if(!o.getAttribute("position")||o.getAttribute("position").count>4e3||(o.boundingBox||o.computeBoundingBox(),!o.boundingBox))return;const p=n.clone().multiply(d.matrixWorld),g=o.boundingBox.clone().applyMatrix4(p).getSize(new V),m=[g.x,g.y,g.z].sort((h,w)=>w-h);m[0]<1.5||m[1]<1.1||m[2]<.08||i.push({mesh:d,score:m[0]*m[1]})});const t=i.sort((d,o)=>o.score-d.score).slice(0,e).map(({mesh:d})=>{const o=new st(d.geometry,35);return o.applyMatrix4(n.clone().multiply(d.matrixWorld)),o}).filter(d=>d.getAttribute("position").count>0);if(!t.length)return;const a=Fe(t,!1);if(t.forEach(d=>d.dispose()),!a)return;const l=new dt;l.setPositions(a.getAttribute("position").array),a.dispose();const r=new ft({color:2827320,linewidth:1.35,transparent:!0,opacity:.68,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}),c=new jt(l,r);c.name="landmark-ink";const f=new ct;c.onBeforeRender=d=>{d.getSize(f),r.resolution.copy(f)},s.add(c)}function Yt(){for(const s of Ge)s.id==="fishmarket"&&nt(s.group,16),s.id==="commercial"&&nt(s.group,4)}function fn(s,e,n,i,t,a){const l=new Set(F.children);a(),Nt();const r=new ae;r.name=`special-${s}`,r.position.set(i[0],ye,i[1]),F.add(r);for(const c of[...F.children])c!==r&&!l.has(c)&&!c.userData.ambient&&r.attach(c);return Xt(s,e,n,r,i,t)}function Xt(s,e,n,i,t,a){const l=new te(new Y(...a),Zt);l.name=`pick-${s}`,l.position.set(t[0],ye+a[1]/2,t[1]),l.userData.specialId=s,F.add(l),qt.push(l);const r={id:s,name:e,description:n,group:i,pick:l,radius:Math.max(a[0],a[2])*.56};return Ge.push(r),F.userData.specialBuildings=Ge.map(c=>({id:c.id,name:c.name})),r}function un(){for(const s of[...F.children])(s.name==="city-building-batch"||s.name==="city-building-outlines")&&ve.attach(s);Yt()}export{sn as B,nn as C,ye as G,on as T,tn as Z,It as a,ln as b,en as c,Wt as d,cn as e,Nt as f,un as g,Xt as h,lt as i,an as j,qt as k,ve as l,rn as m,dn as p,fn as r,Ge as s};
