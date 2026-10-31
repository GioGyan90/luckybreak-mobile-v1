import{B as q,F as M,U as _,D as L,c as C,d as T,C as s,M as g,V as b,a as W,X as N,Y as z}from"./BufferGeometryUtils-CwP6Sgp-.js";import{t as H,w as R,e as F,S as k,E as U,W as X}from"./materials-DlWyJylz.js";import{b as Z,l as x,w as D}from"./scene-Ch64RdHu.js";const y=-.26,S=.65,E="float swell(vec2 p){return .15*sin(dot(p,vec2(.025,.016))+time*.8)+.09*sin(dot(p,vec2(-.017,.04))-time*.65);}";function B(t,a,e=5e3,n=220){const r=[],m=[],h=[],l=(o,p,v,V)=>{r.push(o,p,v),h.push(V)},c=[];for(let o=0;o<n;o++)c.push([-e+o*2*e/n,-e]);for(let o=0;o<n;o++)c.push([e,-e+o*2*e/n]);for(let o=0;o<n;o++)c.push([e-o*2*e/n,e]);for(let o=0;o<n;o++)c.push([-e,e-o*2*e/n]);for(const[o,p]of c)l(o,y,p,1),l(o,y-S,p,0);for(let o=0;o<c.length;o++){const p=o*2,v=(o+1)%c.length*2;m.push(p,v,p+1,v,v+1,p+1)}const d=r.length/3;for(const[o,p]of[[-e,-e],[-e,e],[e,e],[e,-e]])l(o,y-S,p,0);m.push(d,d+2,d+1,d,d+3,d+2);const u=new q;u.setAttribute("position",new M(r,3)),u.setAttribute("surfaceEdge",new M(h,1)),u.setIndex(m),u.computeVertexNormals();const A=new _({transparent:!0,depthWrite:!1,side:L,uniforms:{time:t,deep:a},vertexShader:`uniform float time;attribute float surfaceEdge;varying vec3 volumeWorld;varying vec3 volumeNormal;${E}void main(){vec3 p=position;p.y+=surfaceEdge*swell(p.xz);vec4 wp=modelMatrix*vec4(p,1.);volumeWorld=wp.xyz;volumeNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*wp;}`,fragmentShader:`uniform vec3 deep;varying vec3 volumeWorld;varying vec3 volumeNormal;void main(){float angle=max(.18,abs(dot(normalize(cameraPosition-volumeWorld),normalize(volumeNormal))));float alpha=min(.14,1.-exp(-.022*.65/angle));gl_FragColor=vec4(deep*.84,alpha);#include <tonemapping_fragment>
#include <colorspace_fragment>
}`.replace(";#include",`;
#include`)}),f=new C(u,A);return f.name="thin-ocean-volume",f.renderOrder=-2,f.frustumCulled=!1,f.userData.thickness=S,f}function G(t,a){const e=g.clamp(a,-200,202),n=Math.max(R(e)-Z(a)-t,t-F(e)),r=Math.max(-200-a,a-202),m=Math.hypot(Math.max(n,0),Math.max(r,0))+Math.min(Math.max(n,r),0),h=Math.max(120-t,t-190),l=Math.max(144-a,a-182),c=Math.hypot(Math.max(h,0),Math.max(l,0))+Math.min(Math.max(h,l),0);return Math.min(m,c)}function I(t,a,e=G(t,a)){const n=Math.max(0,e),r=40+9*Math.sin(a*.027)+6*Math.sin(t*.019+a*.014),m=g.smoothstep(n,0,r),h=g.smoothstep(n,r,r+45);return .85+5.5*m+25*h}const O="float continentalDepth(vec2 p,float distanceToCoast){float d=max(0.,distanceToCoast);float width=40.+9.*sin(p.y*.027)+6.*sin(p.x*.019+p.y*.014);return .85+5.5*smoothstep(0.,width,d)+25.*smoothstep(width,width+45.,d);}";function $(){const t=new T(760,680,152,136);t.rotateX(-Math.PI/2),t.translate(70,0,-5);const a=t.attributes.position,e=[];for(let r=0;r<a.count;r++){const m=a.getX(r),h=a.getZ(r),l=I(m,h);a.setY(r,-.26-l);const c=new s(14209708).lerp(new s(7905171),g.smoothstep(l,1,10));c.multiplyScalar(.95+.035*Math.sin(m*.28+Math.sin(h*.19)*2)+.025*Math.cos(h*.36-m*.15)),e.push(c.r,c.g,c.b)}t.setAttribute("color",new M(e,3)),t.computeVertexNormals();const n=new C(t,H(16777215,{vertexColors:!0}));return n.name="submerged-continental-shelf",n.receiveShadow=!0,n.userData={nearDepth:.85,shelfWidth:[25,55],outerDepth:31.35},n}const i={lightDirection:{value:new b(-.3,.85,.4).normalize()},lightColor:{value:new s(16773063)},lightStrength:{value:1},skyReflection:{value:new s(7981037)},fogColor:{value:new s(12378871)},twilightStrength:{value:0},twilightHorizon:{value:new s},solarDirection:{value:new b},time:{value:0},night:{value:0},westShore:{value:k.map((t,a)=>new W(X[a],t))},eastShore:{value:k.map((t,a)=>new W(U[a],t))},shallow:{value:new s(x.shallow)},deep:{value:new s(x.deep)}},j=new _({transparent:!0,depthWrite:!1,lights:!0,uniforms:{...N.clone(z.lights),...i},vertexShader:`
    #include <common>
    #include <shadowmap_pars_vertex>
    uniform float time;varying vec3 vWorld;
    ${E}
    void main(){vec3 p=position;p.y+=swell(p.xz);vec4 wp=modelMatrix*vec4(p,1.);vWorld=wp.xyz;vec4 worldPosition=wp;vec3 transformedNormal=normalize(normalMatrix*vec3(0.,1.,0.));
    #include <shadowmap_vertex>
    gl_Position=projectionMatrix*viewMatrix*wp;}
  `,fragmentShader:`
    #include <common>
    #include <packing>
    #include <shadowmap_pars_fragment>
    uniform bool receiveShadow;
    #include <shadowmask_pars_fragment>
    uniform float twilightStrength;uniform vec3 twilightHorizon;uniform vec3 solarDirection;uniform vec3 lightDirection;uniform vec3 lightColor;uniform float lightStrength;uniform vec3 skyReflection;uniform vec3 fogColor;uniform vec2 westShore[12];uniform vec2 eastShore[12];uniform float time;uniform float night;uniform vec3 shallow;uniform vec3 deep;varying vec3 vWorld;
    float surface(vec2 p){p.x+=sin(p.y*.041+time*.22)*2.5;p.y+=sin(p.x*.032-time*.15)*1.7;return .15*sin(dot(p,vec2(.025,.016))+time*.8)+.09*sin(dot(p,vec2(-.017,.04))-time*.65)+(1.-smoothstep(80.,350.,length(cameraPosition.xz-p)))*(.045*sin(dot(p,vec2(.52,.28))+time*1.5)+.025*sin(dot(p,vec2(-.32,.71))-time*1.8));}
    ${O}
    void main(){
      vec2 p=vWorld.xz;float e=.12;
      vec3 n=normalize(vec3(surface(p-vec2(e,0.))-surface(p+vec2(e,0.)),2.*e,surface(p-vec2(0.,e))-surface(p+vec2(0.,e))));
      vec3 view=normalize(cameraPosition-vWorld);
      float fresnel=pow(1.-max(dot(n,view),0.),3.);
      float shoreZ=clamp(p.y,-200.,202.);
      float west=westShore[0].x,east=eastShore[0].x;
      for(int i=0;i<11;i++){if(shoreZ>=westShore[i].y){float k=clamp((shoreZ-westShore[i].y)/(westShore[i+1].y-westShore[i].y),0.,1.);k=k*k*(3.-2.*k);west=mix(westShore[i].x,westShore[i+1].x,k);east=mix(eastShore[i].x,eastShore[i+1].x,k);}}
      // Same foreshore profile as the terrain; keep the promenade restaurant inlet open.
      float beachWidth=smoothstep(-196.,-168.,p.y)*(1.-smoothstep(160.,196.,p.y))*(9.5+3.5*sin(p.y*.026)+1.5*cos(p.y*.063))*(1.-exp(-pow((p.y-98.)/17.,2.)));
      west-=beachWidth;
      vec2 shoreDistance=vec2(max(west-p.x,p.x-east),max(-200.-p.y,p.y-202.));
      float distanceToCoast=length(max(shoreDistance,vec2(0.)))+min(max(shoreDistance.x,shoreDistance.y),0.);
      vec2 quayDistance=vec2(max(120.-p.x,p.x-190.),max(144.-p.y,p.y-182.));
      float quay=length(max(quayDistance,vec2(0.)))+min(max(quayDistance.x,quayDistance.y),0.);
      distanceToCoast=min(distanceToCoast,quay);
      float depth=continentalDepth(p,distanceToCoast);
      float nearShore=1.-smoothstep(1.,30.,depth);
      float lagoon=1.-smoothstep(1.,7.,depth);
      vec3 middle=mix(deep,shallow,.45);
      vec3 color=mix(deep,middle,nearShore);
      color=mix(color,shallow,lagoon*.82);
      float current=sin(p.x*.055+p.y*.031+sin(p.y*.017)*2.-time*.12);
      color*=.98+.025*current*nearShore;
      vec2 towardSun=solarDirection.xz/max(length(solarDirection.xz),.0001);
      vec2 towardView=view.xz/max(length(view.xz),.0001);
      float sunsetFacing=pow(max(dot(towardView,towardSun),0.),4.);
      vec3 reflectedSky=mix(skyReflection,twilightHorizon,twilightStrength*sunsetFacing*.8);
      color=mix(color,reflectedSky,fresnel*.7);
      // A broken reflection path remains at dusk after direct sunlight ends.
      float across=dot(towardView,vec2(-towardSun.y,towardSun.x));
      float path=exp(-pow((across+.022*sin(p.y*.17+time*.5))/.055,2.));
      float detail=1.-smoothstep(80.,350.,length(cameraPosition.xz-p));
      float ripples=mix(.48,smoothstep(-.3,.7,sin(p.y*.9+p.x*.21+time*.8)),detail);
      color+=twilightHorizon*path*ripples*twilightStrength*fresnel*.28;
      vec3 light=normalize(lightDirection);
      float sun=pow(max(dot(reflect(-light,n),view),0.),76.);
      color*=.9+max(dot(n,light),0.)*.14;
      color+=lightColor*sun*.9*lightStrength;
      float crest=sin(distanceToCoast*2.4-time*1.6+sin(p.y*.23)*.8);
      float foam=smoothstep(.64,.97,crest)*(1.-smoothstep(.3,2.6,abs(distanceToCoast)));
      foam*=1.-smoothstep(197.,205.,abs(p.y));
      color=mix(color,mix(vec3(.8,.94,.91),vec3(.16,.31,.42),night),foam*.65);
      float boatShadow=getShadowMask();
      color*=mix(vec3(.50,.60,.72),vec3(1.),boatShadow);
      float distanceToCamera=length(cameraPosition-vWorld);
      color=mix(color,fogColor,smoothstep(700.,1500.,distanceToCamera));
      // Bottom transmission fades with depth, grazing angle and night.
      float transmission=(1.-smoothstep(2.,18.,depth))*(1.-fresnel)*(.24-.16*night);
      gl_FragColor=vec4(color,1.-transmission);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `}),P=new T(1e4,1e4,220,220);P.rotateX(-Math.PI/2);const w=new C(P,j);w.name="animated-ocean";w.position.y=-.26;w.renderOrder=-1;w.receiveShadow=!0;D.add($());D.add(B(i.time,i.deep));D.add(w);function ae(t){i.time.value=t}const Y=new s(x.shallow),K=new s(x.deep),J=new s("#123a58"),Q=new s("#081d3e");function ne(t,a,e,n,r,m,h,l){i.twilightStrength.value=l.glow,i.twilightHorizon.value.set(l.horizon),i.solarDirection.value.copy(r),i.night.value=t,i.shallow.value.copy(Y).lerp(J,t),i.deep.value.copy(K).lerp(Q,t),i.lightDirection.value.copy(e>0?r:m),i.lightColor.value.set(e>0?16773584:9087968),e>0&&i.lightColor.value.lerp(new s(l.sunlight),a),i.lightStrength.value=e>0?e/1.8:n*.3,i.skyReflection.value.set(7981037).lerp(new s(330527),t).lerp(new s(l.rose),l.glow*.78),i.fogColor.value.copy(h)}export{ne as s,ae as u};
