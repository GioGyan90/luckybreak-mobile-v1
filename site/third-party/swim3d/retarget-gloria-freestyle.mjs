import fs from 'node:fs/promises';
import * as T from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'meshoptimizer';
globalThis.self=globalThis;
async function load(file){
 const b=await fs.readFile(file),len=b.readUInt32LE(12),j=JSON.parse(b.subarray(20,20+len));
 for(const m of j.materials??[]){delete m.pbrMetallicRoughness?.baseColorTexture;delete m.normalTexture;delete m.emissiveTexture;delete m.occlusionTexture;delete m.pbrMetallicRoughness?.metallicRoughnessTexture;}
 j.images=[];j.textures=[];
 const raw=Buffer.from(JSON.stringify(j)),body=Buffer.alloc(Math.ceil(raw.length/4)*4,32);raw.copy(body);
 const tail=b.subarray(20+len),h=Buffer.alloc(20);h.writeUInt32LE(0x46546c67);h.writeUInt32LE(2,4);h.writeUInt32LE(20+body.length+tail.length,8);h.writeUInt32LE(body.length,12);h.writeUInt32LE(0x4e4f534a,16);
 const data=Buffer.concat([h,body,tail]);const g=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.length),'');
 const names={};for(const [o,a] of g.parser.associations)if(a.nodes!==undefined)names[j.nodes[a.nodes].name]=o;
 g.scene.updateMatrixWorld(true);g.scene.updateMatrixWorld(true);
 return {...g,names};
}
const source=await load('artifacts/swim3d-source/swimmer.glb'),target=await load('src/assets/underwater/gloria-diving-swim.glb');
const map={hips:'DEF-spine',spine:'DEF-spine.001',chest:'DEF-spine.002',upperChest:'DEF-spine.003',neck:'DEF-spine.004',head:'DEF-spine.006'};
for(const [side,s]of [['left','L'],['right','R']]){
 for(const [key,name]of [['Shoulder','shoulder'],['UpperArm','upper_arm'],['LowerArm','forearm'],['Hand','hand'],['UpperLeg','thigh'],['LowerLeg','shin'],['Foot','foot'],['Toes','toe']])map[side+key]='DEF-'+name+'.'+s;
 for(const [digit,name]of [['Thumb','thumb'],['Index','f_index'],['Middle','f_middle'],['Ring','f_ring'],['Little','f_pinky']])for(const [part,n]of [['Proximal','01'],['Intermediate','02'],['Distal','03']])map[side+digit+part]='DEF-'+name+'.'+n+'.'+s;
}
const targets={};target.scene.traverse(o=>{if(o.userData.humanoid)targets[o.userData.humanoid]=o});
const pos=o=>o.getWorldPosition(new T.Vector3()),quat=o=>o.getWorldQuaternion(new T.Quaternion());
const restS={},restT={};for(const [k,name]of Object.entries(map)){if(!source.names[name]||!targets[k])throw Error('missing '+k+' '+name);restS[k]=quat(source.names[name]);restT[k]=quat(targets[k]);}

// Source bind scene is horizontal (+X travel, -Z left); convert to game's +Z travel.
const C=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),-Math.PI/2),Ci=C.clone().invert();
const prone=new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),Math.PI/2);
const child={hips:'spine',spine:'chest',chest:'upperChest',upperChest:'neck',neck:'head'};
for(const side of ['left','right']){
 for(const [a,b]of [['Shoulder','UpperArm'],['UpperArm','LowerArm'],['LowerArm','Hand'],['Hand','MiddleProximal'],['UpperLeg','LowerLeg'],['LowerLeg','Foot'],['Foot','Toes']])child[side+a]=side+b;
 for(const digit of ['Thumb','Index','Middle','Ring','Little']){child[side+digit+'Proximal']=side+digit+'Intermediate';child[side+digit+'Intermediate']=side+digit+'Distal';}
}
const frame=(direction,normal)=>{const x=direction.clone().normalize(),y=normal.clone().addScaledVector(x,-normal.dot(x)).normalize(),z=new T.Vector3().crossVectors(x,y);return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z));};
const targetHandFrames={};
for(const side of ['left','right']){
 const at=k=>pos(targets[side+k]);
 const direction=at('MiddleProximal').sub(at('Hand'));
 const normal=new T.Vector3().crossVectors(direction,at('IndexProximal').sub(at('LittleProximal'))).normalize();
 targetHandFrames[side]=frame(direction,normal).invert();
}
// One shared elbow plane for both segments prevents opposing axial twists
// from collapsing linearly blended sleeve vertices.
const armRest={},sourceArmNormal={};
for(const side of ['left','right']){
 const at=k=>pos(targets[side+k]),src=k=>pos(source.names[map[side+k]]);
 const upper=at('LowerArm').sub(at('UpperArm')).normalize(),lower=at('Hand').sub(at('LowerArm')).normalize();
 const normal=new T.Vector3().crossVectors(upper,lower).normalize();
 armRest[side]={UpperArm:frame(upper,normal).invert(),LowerArm:frame(lower,normal).invert()};
 sourceArmNormal[side]=new T.Vector3().crossVectors(src('LowerArm').sub(src('UpperArm')),src('Hand').sub(src('LowerArm'))).normalize();
}
const base={};
for(const k of Object.keys(map)){
 base[k]=prone.clone().multiply(restT[k]);
 if(child[k]){
  const sd=pos(source.names[map[child[k]]]).sub(pos(source.names[map[k]])).normalize().applyQuaternion(C);
  const td=pos(targets[child[k]]).sub(pos(targets[k])).normalize().applyQuaternion(prone);
  base[k].premultiply(new T.Quaternion().setFromUnitVectors(td,sd));
 }
}
const mixer=new T.AnimationMixer(source.scene);mixer.clipAction(source.animations[0]).play();
const duration=source.animations[0].duration,frames=Math.round(duration*30)+1,times=Float32Array.from({length:frames},(_,i)=>duration*i/(frames-1));
const values=Object.fromEntries(Object.keys(map).map(k=>[k,[]]));
const depth=o=>o.parent?depth(o.parent)+1:0,order=Object.keys(map).sort((a,b)=>depth(targets[a])-depth(targets[b]));
const samples=[];
for(const t of times){
 mixer.setTime(t);source.scene.updateMatrixWorld(true);
 for(const k of order){
  const desired=C.clone().multiply(quat(source.names[map[k]])).multiply(restS[k].clone().invert()).multiply(Ci).multiply(base[k]);
  if(/^(left|right)(UpperArm|LowerArm)$/.test(k)){
   const side=k.startsWith('left')?'left':'right',part=k.slice(side.length),at=key=>pos(source.names[map[side+key]]);
   const upper=at('LowerArm').sub(at('UpperArm')).normalize(),lower=at('Hand').sub(at('LowerArm')).normalize();
   const transported=sourceArmNormal[side].clone().applyQuaternion(quat(source.names[map[side+'UpperArm']]).multiply(restS[side+'UpperArm'].clone().invert()));
   const plane=new T.Vector3().crossVectors(upper,lower),bend=plane.length();
   if(plane.dot(transported)<0)plane.negate();
   plane.normalize().lerp(transported,1-T.MathUtils.smoothstep(bend,0.03,0.15)).normalize().applyQuaternion(C);
   const direction=(part==='UpperArm'?upper:lower).applyQuaternion(C);
   desired.copy(frame(direction,plane).multiply(armRest[side][part]).multiply(restT[k]));
  }
  if(k==='leftHand'||k==='rightHand'){
   const side=k.startsWith('left')?'left':'right',at=key=>pos(source.names[map[side+key]]).applyQuaternion(C);
   const direction=at('MiddleProximal').sub(at('Hand'));
   const normal=new T.Vector3().crossVectors(direction,at('IndexProximal').sub(at('LittleProximal'))).normalize();
   desired.copy(frame(direction,normal).multiply(targetHandFrames[side]).multiply(restT[k]));
  }
  const parent=quat(targets[k].parent);
  targets[k].quaternion.copy(parent.invert().multiply(desired)).normalize();
  targets[k].updateWorldMatrix(false,true);
  values[k].push(...targets[k].quaternion.toArray());
 }
 samples.push({left:pos(targets.leftHand).toArray(),right:pos(targets.rightHand).toArray(),head:pos(targets.head).toArray()});
}
const tracks=[];
for(const [k,v]of Object.entries(values)){
 // Blend the final 0.12 seconds to the first pose for a continuous looping clip.
 const start=new T.Quaternion().fromArray(v);
 for(let i=0;i<frames;i++){
  const q=new T.Quaternion().fromArray(v,i*4);
  if(i>frames-5)q.slerp(start,(i-(frames-5))/4);
  if(i&&q.dot(new T.Quaternion().fromArray(v,(i-1)*4))<0)q.set(-q.x,-q.y,-q.z,-q.w);
  q.toArray(v,i*4);
 }
 tracks.push(new T.QuaternionKeyframeTrack(targets[k].name+'.quaternion',times,v));
}
const clip=new T.AnimationClip('freestyle',duration,tracks);
await fs.writeFile('src/assets/underwater/gloria-freestyle.json',JSON.stringify(T.AnimationClip.toJSON(clip)));
console.log('Freestyle retargeted',frames,'frames',tracks.length,'bones',duration,'seconds',samples.filter((_,i)=>i%20===0));
