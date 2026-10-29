import{a as e,aW as a}from"./BufferGeometryUtils-C4woviwh.js";const d=12,l={cloudShadowLobes:{value:Array.from({length:d},()=>new a(1e4,1e4,1,1))},cloudShadowWeights:{value:Array(12).fill(0)},cloudShadowSlope:{value:new e},cloudShadowStrength:{value:0}},r="uniform vec4 cloudShadowLobes[12];uniform float cloudShadowWeights[12];uniform vec2 cloudShadowSlope;uniform float cloudShadowStrength;varying vec3 cloudShadowWorld;",c=`
 float cloudCover=0.;
 for(int i=0;i<12;i++){
  vec4 lobe=cloudShadowLobes[i];
  vec2 delta=(cloudShadowWorld.xz-cloudShadowSlope*cloudShadowWorld.y-lobe.xy)/lobe.zw;
  cloudCover=max(cloudCover,exp(-dot(delta,delta)*1.6)*cloudShadowWeights[i]);
 }
 diffuseColor.rgb*=mix(vec3(1.),vec3(.66,.72,.83),cloudCover*cloudShadowStrength);`;function n(o){Object.assign(o.uniforms,l),o.vertexShader=`varying vec3 cloudShadowWorld;
`+o.vertexShader,o.vertexShader=o.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
cloudShadowWorld=(modelMatrix*vec4(transformed,1.)).xyz;`),o.fragmentShader=r+`
`+o.fragmentShader,o.fragmentShader=o.fragmentShader.replace("#include <alphamap_fragment>",c+`
#include <alphamap_fragment>`)}export{n as a,l as c};
