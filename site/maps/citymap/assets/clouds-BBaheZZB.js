import{G as A}from"./gameQuality-7FNYzhuI.js";import{G as g,a6 as V,a7 as _,a8 as B,U as F,C as m,V as h,a9 as G,c as R,e as U,O as W,g as j,M as S}from"./BufferGeometryUtils-CwP6Sgp-.js";import{w as v,D as q}from"./scene-Ch64RdHu.js";import{d as M,e as N,f as O,g as P,p as T,s as k}from"./index-Dd16dMV_.js";import{c as u}from"./cloudShadows-jN73rCYW.js";const E="varying vec3 localSurface;void main(){localSurface=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",I=`
 varying vec3 localSurface;
 uniform vec3 cameraLocal;uniform vec3 sunLocal;uniform vec3 topColor;uniform vec3 baseColor;uniform vec3 rimColor;
 uniform sampler2D densityAtlas;uniform int marchSteps;
 uniform float opticalDepth;uniform float visibility;uniform float daylight;
 float density(vec3 p){
  vec3 q=clamp(p*.5+.5,0.,1.);float slice=q.z*47.;float a=floor(slice),b=min(a+1.,47.);
  vec2 cellA=vec2(mod(a,8.),floor(a/8.)),cellB=vec2(mod(b,8.),floor(b/8.));
  vec2 uvA=(cellA*48.+vec2(.5)+q.xy*47.)/vec2(384.,288.);
  vec2 uvB=(cellB*48.+vec2(.5)+q.xy*47.)/vec2(384.,288.);
  return mix(texture2D(densityAtlas,uvA).r,texture2D(densityAtlas,uvB).r,fract(slice));
 }
 void main(){
  vec3 ray=normalize(localSurface-cameraLocal);
  vec3 safeRay=sign(ray+vec3(.0000001))*max(abs(ray),vec3(.00001));
  vec3 t0=(-vec3(1.)-cameraLocal)/safeRay,t1=(vec3(1.)-cameraLocal)/safeRay;
  vec3 nearV=min(t0,t1),farV=max(t0,t1);
  float entry=max(0.,max(nearV.x,max(nearV.y,nearV.z))),exitT=min(farV.x,min(farV.y,farV.z));
  if(exitT<=entry)discard;
  float stepSize=(exitT-entry)/float(marchSteps);vec3 lightDir=normalize(sunLocal);vec3 total=vec3(0.);float transmission=1.;
  for(int step=0;step<32;step++){if(step>=marchSteps)break;
   vec3 p=cameraLocal+ray*(entry+(float(step)+.5)*stepSize);
   float d=density(p);if(d<.005)continue;
   float above=smoothstep(-.45,.55,p.y);
   float sunSide=max(dot(normalize(p+vec3(0.,.35,0.)),lightDir),0.);
   float selfShade=density(p+lightDir*.23);
   float illumination=clamp(.24+.46*above+.32*sunSide-.30*selfShade,0.,1.);
   vec3 color=mix(baseColor,topColor,illumination);
   float rim=pow(max(dot(-ray,lightDir),0.),5.)*(1.-d)*.16*daylight;
   color+=rimColor*rim;
   float alpha=1.-exp(-d*opticalDepth*stepSize);
   total+=transmission*alpha*color;transmission*=1.-alpha;
   if(transmission<.025)break;
  }
  float alpha=(1.-transmission)*visibility;if(alpha<.003)discard;
  gl_FragColor=vec4(total/max(1.-transmission,.0001),alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
 }`,f=[],w=new j,D=new h,n=new h(-.3,.8,.3).normalize();let z=1,b=!1;function H(t){return t.onBeforeRender=function(a,o,e,r,s){w.copy(s.matrixWorld).invert(),D.setFromMatrixPosition(e.matrixWorld).applyMatrix4(w);const i=this;i.uniforms.cameraLocal.value.copy(D),i.uniforms.sunLocal.value.copy(n).transformDirection(w),i.uniformsNeedUpdate=!0},t}function Y(t,a,o=54){const e=new g;e.name="cloud-"+t;const r=N(t,a),s=t==="veil"?o*.15:t==="towering"?o*.48:o*.35,i=o*.57,l=O(r,a),d=new V(new Uint8Array(l.data),l.width,l.height,_);d.minFilter=d.magFilter=B,d.needsUpdate=!0;const C=H(new F({vertexShader:E,fragmentShader:I,transparent:!0,depthWrite:!1,side:G,uniforms:{marchSteps:{value:A?12:typeof innerWidth=="number"&&innerWidth<700?20:32},cameraLocal:{value:new h},sunLocal:{value:n.clone()},topColor:{value:new m(16776695)},baseColor:{value:new m(9018807)},rimColor:{value:new m(16775135)},densityAtlas:{value:d},opticalDepth:{value:t==="veil"?2.3:t==="towering"?10:7},visibility:{value:1},daylight:{value:1},seed:{value:a*.013}}}));C.userData.lightingRole="volumetric-cloud";const y=new R(new U(2,2,2),C);y.name="soft-density-envelope",y.scale.set(o/2,s/2,i/2),e.add(y);const x=new g;x.name="designed-density-lobes",e.add(x);for(const c of r){const p=new W;p.name=c.name,p.position.set(c.center[0]*o/2,c.center[1]*s/2,c.center[2]*i/2),p.scale.set(c.radius[0]*o/2,c.radius[1]*s/2,c.radius[2]*i/2),x.add(p)}return e.userData={kind:t,seed:a,width:o,height:s,depth:i,parts:r.map(c=>c.name),motion:M(a+19)},e}function $(){if(v.getObjectByName("layered-moving-cloud-field"))return;f.length=0;const t=new g;t.name="layered-moving-cloud-field",v.add(t);const a=k(83017),o=(e,r)=>e+(r-e)*a();for(let e=0;e<12;e++){const r=e<4?"towering":e<9?"broken":"veil",s=r==="towering"?o(65,92):r==="broken"?o(36,61):o(82,115),i=83017+e*193,l=Y(r,i,s),d=[[35,-75],[145,20],[65,115],[225,125]];l.position.set(e<4?d[e][0]+o(-18,18):-240+e%4*155+o(-32,32),r==="veil"?o(265,300):r==="broken"?o(218,248):o(174,205),e<4?d[e][1]+o(-20,20):-160+Math.floor(e/4)*135+o(-35,35)),t.add(l),f.push({root:l,mesh:l.children[0],start:l.position.clone(),motion:M(i+19),shadow:e<4,elapsed:0})}v.userData.clouds={count:12,layers:3,shadowClouds:4,render:"20–32-step soft density volumes",seed:83017}}function L(){const t=!b&&n.y>.1;u.cloudShadowStrength.value=t?z*S.smoothstep(n.y,.1,.32):0,u.cloudShadowSlope.value.set(n.x/Math.max(.1,n.y),n.z/Math.max(.1,n.y));let a=0;for(const o of f.filter(e=>e.shadow)){const e=o.root.userData,r=o.root.position;for(const s of[-.2,0,.24]){const i=T(new h(r.x+s*e.width,r.y,r.z+s*e.depth*.25),n);u.cloudShadowLobes.value[a].set(i?.x??1e4,i?.y??1e4,e.width*.45,e.depth*.55),u.cloudShadowWeights.value[a++]=o.mesh.material.uniforms.visibility.value}}}function ee(t){if(!v.userData.assetView){if(Number.isFinite(t)&&t>0)for(const a of f){a.elapsed+=t,a.root.position.copy(P(a.start,a.motion,a.elapsed));const o=Math.min(a.root.position.x+410,450-a.root.position.x,a.root.position.z+350,300-a.root.position.z);a.mesh.material.uniforms.visibility.value=S.smoothstep(o,0,65)}L()}}function oe(t,a,o,e,r,s){b=!1,n.copy(r),z=S.clamp(s/1.4,0,1);for(const i of f){const l=i.mesh.material.uniforms;l.topColor.value.set(16776695).lerp(new m(7241386),t).lerp(new m(o),a*.78),l.baseColor.value.set(9018807).lerp(new m(2503761),t).lerp(new m(e),a*.36),l.rimColor.value.set(16775135).lerp(new m(o),a),l.daylight.value=1-t}L()}function ae(){b=!0,n.fromArray(q.sun.position).normalize(),u.cloudShadowStrength.value=0}export{$ as buildClouds,f as cloudStates,Y as createCloud,ae as disableCloudShadows,H as prepareCloudMaterial,oe as setCloudLighting,ee as updateClouds};
